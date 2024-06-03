import asyncio
import logging
from configuration.YamlConfiguration import YamlConfiguration
from services.HomeAssistant import HomeAssistant

logger = logging.getLogger(__name__)


async def main():
    try:
        # Read configuration
        config = YamlConfiguration("config.yaml", "config.debug.yaml")
        cfg = await config.read()

        # Configure logging
        log_levels = logging.getLevelNamesMapping()
        log_level = log_levels[cfg["logging"]["level"]]
        logging.basicConfig(filename=cfg["logging"]["file-name"], level=log_level)

        # Create home assistant instance
        server_url = cfg["home-assistant"]["server-url"]
        auth_token = cfg["home-assistant"]["auth-token"]
        home_assistant = HomeAssistant(server_url, auth_token)

        # Connect and disconnect from home assistant
        version = await home_assistant.connect()

        if version is not None:
            logger.info(f"Connected to home assistant version: '{version}'")
        else:
            logger.error("Failed to connect to home assistant")

    finally:
        if home_assistant:
            await home_assistant.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
