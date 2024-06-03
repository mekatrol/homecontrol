import asyncio
from configuration.YamlConfiguration import YamlConfiguration
from services.HomeAssistant import HomeAssistant


async def main():
    try:
        # Read configuration
        config = YamlConfiguration("config.yaml", "config.debug.yaml")
        cfg = await config.read()

        # Create home assistant instance
        home_assistant = HomeAssistant(
            cfg["home-assistant"]["server-url"], cfg["home-assistant"]["auth-token"]
        )

        # Connect and disconnect from home assistant
        version = await home_assistant.connect()

        if version is not None:
            print(f"Connected to home assistant version: '{version}'")
        else:
            print("Failed to connect to home assistant")

    finally:
        if home_assistant:
            await home_assistant.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
