import json
import websockets


class HomeAssistant:

    def __init__(self, server_url, auth_token):
        self.server_url = server_url
        self.auth_token = auth_token

        # Create empty dictionary for config
        self._config = {}

        # Create null websocket
        self._ws = None

    async def connect(self):
        try:
            # Connect to server
            self._ws = await websockets.connect(self.server_url)
            message = json.loads(await self._ws.recv())

            message_type = message["type"]
            ha_version = message["ha_version"]

            if message_type != "auth_required":
                return None

            # Send auth message
            await self._ws.send(
                json.dumps(
                    {
                        "type": "auth",
                        "access_token": self.auth_token,
                    }
                )
            )
            message = json.loads(await self._ws.recv())

            if message["type"] != "auth_ok":
                await self.disconnect()
                return None

            return ha_version
        except Exception:
            return None

    async def disconnect(self):
        if self._ws is None:
            return

        await self._ws.close()
        self._ws = None
