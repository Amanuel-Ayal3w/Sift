from fastapi import FastAPI

app = FastAPI(title="Sift Agent Service")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
