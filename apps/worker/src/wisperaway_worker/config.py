from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_env: str = "development"
    model_dir: Path = Path("./models")
    model_version: str = "unselected"
    model_required: bool = True


@lru_cache
def get_settings() -> Settings:
    return Settings()
