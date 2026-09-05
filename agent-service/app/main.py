from fastapi import FastAPI, HTTPException

from app.config import settings
from app.schemas import QualifyRequest, QualifyResponse
from app.services.qualifier import qualify_lead

app = FastAPI(title="Sift Agent Service")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/leads/qualify", response_model=QualifyResponse)
def qualify(request: QualifyRequest) -> QualifyResponse:
    if not settings.openai_api_key:
        raise HTTPException(status_code=503, detail="OPENAI_API_KEY is not configured")

    try:
        result = qualify_lead(request)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"LLM qualification failed: {exc}") from exc

    return QualifyResponse(result=result, model=settings.openai_model)
