import asyncio
import logging
from configuration.YamlConfiguration import YamlConfiguration
from services.HomeAssistant import HomeAssistant
from state.ExecutionState import ExecutionState

logger = logging.getLogger(__name__)


async def home_assistant_task(server_configuration, server_state):
    home_assistant = None
    try:
        # Create home assistant instance
        server_url = server_configuration["home-assistant"]["server-url"]
        auth_token = server_configuration["home-assistant"]["auth-token"]
        home_assistant = HomeAssistant(server_url, auth_token)

        # Connect and disconnect from home assistant
        version = await home_assistant.connect()

        if version is not None:
            logger.info(f"Connected to home assistant version: '{version}'")
        else:
            logger.error("Failed to connect to home assistant")

        # Subscribe to all events
        message = await home_assistant.subscribe_events()

        while home_assistant.is_connected():
            message = await home_assistant.next_message()
            print(message)

        logger.debug("home_assistant_task complete")
    finally:
        if home_assistant:
            await home_assistant.disconnect()


async def automation_task(server_configuration, server_state):
    await asyncio.sleep(2)
    logger.debug("automation_task complete")


async def monitor_task(server_configuration, server_state):
    await asyncio.sleep(5)
    logger.debug("monitor_task complete")


async def main():
    try:
        # Read configuration
        config = YamlConfiguration("config.yaml", "config.debug.yaml")
        server_configuration = await config.read()

        # Configure logging
        log_levels = logging.getLevelNamesMapping()
        log_level = log_levels[server_configuration["logging"]["level"]]
        logging.basicConfig(
            filename=server_configuration["logging"]["file-name"], level=log_level
        )

        # Configure state
        server_state = ExecutionState(server_configuration)

        task1 = asyncio.create_task(
            home_assistant_task(server_configuration, server_state)
        )
        task2 = asyncio.create_task(automation_task(server_configuration, server_state))
        task3 = asyncio.create_task(monitor_task(server_configuration, server_state))

        await asyncio.wait([task1, task2, task3])

    finally:
        logger.debug("All tasks have completed")


if __name__ == "__main__":
    asyncio.run(main())
