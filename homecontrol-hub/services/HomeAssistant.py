import json
import logging
import websockets


class HomeAssistant:

    def __init__(self, server_url, auth_token):
        self._server_url = server_url
        self._auth_token = auth_token

        # Create empty dictionary for config
        self._config = {}

        # Create null websocket
        self._ws = None

        # Init message id
        self._message_id = 1

        # Create logger
        self._logger = logging.getLogger(__name__)

    async def connect(self):
        try:
            # Connect to server
            self._logger.debug(
                f"Connecting to home assistant server '{self._server_url}'"
            )

            self._ws = await websockets.connect(self._server_url)
            message = await self.next_message()

            message_type = message["type"]
            ha_version = message["ha_version"]

            if message_type != "auth_required":
                return None

            message = await self._auth()

            if message["type"] != "auth_ok":
                await self.disconnect()
                return None

            # Reset message id
            self._message_id = 1

            # Set connected flag
            self._is_connected = True

            return ha_version
        except Exception:
            return None

    async def disconnect(self):
        if self._ws is None:
            return

        self._logger.debug(
            f"Disconnecting from home assistant server '{self._server_url}'"
        )
        await self._ws.close()
        self._ws = None

        # Clear connected flag
        self._is_connected = False

    def is_connected(self):
        return self._is_connected

    async def subscribe_events(self):
        # Send subscribe events message
        self._logger.debug("Subscribing to events")
        await self.send_message(
            {
                "id": self._message_id,
                "type": "subscribe_events",
                "event_type": "state_changed",
            }
        )

        message = await self.next_message()
        return message

    async def send_message(self, message):
        await self._ws.send(json.dumps(message))

        # Increment message id
        self._message_id = self._message_id + 1

    async def next_message(self):
        message = json.loads(await self._ws.recv())
        return message

    async def _auth(self):
        # Send auth message
        self._logger.debug("Authenticating to server")
        await self.send_message(
            {
                "type": "auth",
                "access_token": self._auth_token,
            }
        )

        message = json.loads(await self._ws.recv())
        return message
