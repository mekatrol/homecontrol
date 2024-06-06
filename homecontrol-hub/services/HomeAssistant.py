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

        # Create logger
        self._logger = logging.getLogger(__name__)

    async def connect(self):
        try:
            # Connect to server
            self._logger.debug(
                f"Connecting to home assistant server '{self._server_url}'"
            )

            self._ws = await websockets.connect(self._server_url)
            message = json.loads(await self._ws.recv())

            message_type = message["type"]
            ha_version = message["ha_version"]

            if message_type != "auth_required":
                return None

            message = await self._auth()

            if message["type"] != "auth_ok":
                await self.disconnect()
                return None

            return ha_version
        except Exception:
            return None

    async def _auth(self):
        # Send auth message
        self._logger.debug("Authenticating to server")
        await self._ws.send(
            json.dumps(
                {
                    "type": "auth",
                    "access_token": self._auth_token,
                }
            )
        )

        message = json.loads(await self._ws.recv())
        return message

    async def disconnect(self):
        if self._ws is None:
            return

        self._logger.debug(
            f"Disconnecting from home assistant server '{self._server_url}'"
        )
        await self._ws.close()
        self._ws = None
