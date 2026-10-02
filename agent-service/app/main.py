from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse

from app.config import settings
from app.schemas import QualifyRequest, QualifyResponse
from app.services.qualifier import qualify_lead
from app.services.reasoning_stream import stream_qualification

app = FastAPI(title="Sift Agent Service")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/leads/qualify", response_model=QualifyResponse)
def qualify(request: QualifyRequest) -> QualifyResponse:
    if not settings.openai_api_key:
        raise HTTPException(status_code=503, detail="OPENAI_API_KEY is not configured")

    try:
        result, enrichment = qualify_lead(request)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"LLM qualification failed: {exc}") from exc

    return QualifyResponse(result=result, model=settings.openai_model, enrichment=enrichment)


@app.post("/leads/qualify/stream")
def qualify_stream(request: QualifyRequest) -> StreamingResponse:
    """Same qualification as /leads/qualify, but streams the model's reasoning
    as SSE `reasoning` events while it's generated, then a final `result`
    event with the same payload /leads/qualify returns."""
    if not settings.openai_api_key:
        raise HTTPException(status_code=503, detail="OPENAI_API_KEY is not configured")

    return StreamingResponse(stream_qualification(request), media_type="text/event-stream")
