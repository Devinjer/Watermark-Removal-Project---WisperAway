from fastapi import FastAPI, status
from fastapi.responses import JSONResponse

from . import __version__
from .config import get_settings
from .readiness import evaluate_readiness

app = FastAPI(title="WisperAway Worker", version=__version__)


@app.get("/health/live")
def live() -> dict[str, str]:
    return {"service": "wisperaway-worker", "status": "ok", "version": __version__}


@app.get("/health/ready")
def ready() -> JSONResponse:
    result = evaluate_readiness(get_settings())
    code = status.HTTP_200_OK if result.ready else status.HTTP_503_SERVICE_UNAVAILABLE
    return JSONResponse(status_code=code, content={"ready": result.ready, "reason": result.reason})
