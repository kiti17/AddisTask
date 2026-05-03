from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "AddisTask API"
    DATABASE_URL: str = "postgresql+psycopg2://postgres:123456@localhost:5432/addistask"
    JWT_SECRET: str = "change-this-secret"
    JWT_ALG: str = "HS256"
    JWT_EXPIRES_MIN: int = 60
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    class Config:
        env_file = ".env"


settings = Settings()