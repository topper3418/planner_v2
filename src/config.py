from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    CONSOLE_LOGGING: bool = True

    class Config:
        env_file = ".env"  # Specifies the .env file to load
        env_file_encoding = "utf-8"  # Optional: specify encoding


settings = Settings()
