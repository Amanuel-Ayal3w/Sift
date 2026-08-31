from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    llm_provider: str = "openai"
    openai_api_key: str = ""
    gemini_api_key: str = ""
    enrichment_api_key: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
