from dataclasses import dataclass
from pathlib import Path

from .config import Settings


@dataclass(frozen=True)
class Readiness:
    ready: bool
    reason: str


def model_marker(settings: Settings) -> Path:
    return settings.model_dir / settings.model_version / "READY"


def evaluate_readiness(settings: Settings) -> Readiness:
    if not settings.model_required:
        return Readiness(ready=True, reason="model_not_required")

    marker = model_marker(settings)
    if settings.model_version == "unselected":
        return Readiness(ready=False, reason="model_version_unselected")
    if not marker.is_file():
        return Readiness(ready=False, reason="model_artifact_unavailable")

    return Readiness(ready=True, reason="ready")
