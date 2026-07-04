from pydantic import model_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "AddisTask API"
    APP_ENV: str = "local"
    DATABASE_URL: str = "postgresql+psycopg2://postgres:123456@localhost:5432/addistask"
    JWT_SECRET: str = "change-this-secret"
    JWT_ALG: str = "HS256"
    JWT_EXPIRES_MIN: int = 60
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"

    @property
    def is_production(self) -> bool:
        return self.APP_ENV.lower() == "production"

    @property
    def cors_origin_list(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.CORS_ORIGINS.split(",")
            if origin.strip()
        ]

    @model_validator(mode="after")
    def validate_production_settings(self):
        if not self.is_production:
            return self

        if self.JWT_SECRET in {"change-this-secret", "", "replace-with-secure-secret"}:
            raise ValueError("JWT_SECRET must be set to a secure value in production")

        if len(self.JWT_SECRET) < 32:
            raise ValueError("JWT_SECRET must be at least 32 characters in production")

        if "localhost" in self.DATABASE_URL or "127.0.0.1" in self.DATABASE_URL:
            raise ValueError("DATABASE_URL must point to a production database")

        return self

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
