from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    CONSOLE_LOGGING: bool = True
    # Used for calendar-day interpretation of UTC-stored timestamps.
    # SQLite CURRENT_TIMESTAMP is UTC; display/calendar logic uses this zone.
    APP_TIMEZONE: str = "America/Chicago"

    class Config:
        env_file = ".env"  # Specifies the .env file to load
        env_file_encoding = "utf-8"  # Optional: specify encoding


settings = Settings()
