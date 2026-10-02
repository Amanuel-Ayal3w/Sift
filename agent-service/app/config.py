from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    llm_provider: str = "openai"
    openai_api_key: str = ""
    openai_model: str = "gpt-4.1-mini"
    gemini_api_key: str = ""
    enrichment_provider: str = "clearbit"
    enrichment_api_key: str = ""
    enrichment_timeout_seconds: float = 5.0

    class Config:
        env_file = ".env"


settings = Settings()
