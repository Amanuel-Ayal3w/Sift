import json
import logging
from collections.abc import Iterator

from openai import OpenAI

from app.config import settings
from app.schemas import QualifyRequest, QualifyResponse
from app.services.enrichment import enrich_company, resolve_company_domain
from app.services.qualifier import SYSTEM_PROMPT, build_user_prompt, run_structured_qualification

logger = logging.getLogger(__name__)

REASONING_SYSTEM_PROMPT = (
    SYSTEM_PROMPT
    + "\n\nFor this request, narrate your analysis in plain prose as you go — think out loud "
    "through steps 1-3. Do not write the reply draft here; that comes in a separate step."
)


def _sse(event: str, data: dict | str) -> str:
    payload = data if isinstance(data, str) else json.dumps(data)
    return f"event: {event}\ndata: {payload}\n\n"


def stream_qualification(request: QualifyRequest) -> Iterator[str]:
    """Yields Server-Sent Events: a series of `reasoning` deltas as the model
    narrates its analysis, followed by one final `result` event once the
    structured score/tier/reply have been produced, or an `error` event if
    either step fails. Errors can't become an HTTP status here since headers
    are already sent by the time the OpenAI call runs.
    """
    client = OpenAI(api_key=settings.openai_api_key)
    enrichment = enrich_company(
        resolve_company_domain(request.lead.company_domain, request.lead.email)
    )
    user_prompt = build_user_prompt(request, enrichment)

    try:
        with client.responses.stream(
            model=settings.openai_model,
            input=[
                {"role": "system", "content": REASONING_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
        ) as stream:
            for event in stream:
                if event.type == "response.output_text.delta":
                    yield _sse("reasoning", event.delta)
    except Exception as exc:
        logger.error("Reasoning stream failed: %s", exc)
        yield _sse("error", f"Reasoning stream failed: {exc}")
        return

    try:
        result = run_structured_qualification(client, user_prompt)
    except Exception as exc:
        logger.error("Structured qualification failed: %s", exc)
        yield _sse("error", f"Qualification failed: {exc}")
        return

    response = QualifyResponse(result=result, model=settings.openai_model, enrichment=enrichment)
    yield _sse("result", response.model_dump())
    yield "event: done\ndata: {}\n\n"
