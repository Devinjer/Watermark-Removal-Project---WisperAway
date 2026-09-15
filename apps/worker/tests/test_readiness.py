from pathlib import Path

from wisperaway_worker.config import Settings
from wisperaway_worker.readiness import evaluate_readiness


def test_readiness_fails_when_model_version_is_unselected(tmp_path: Path) -> None:
    settings = Settings(model_dir=tmp_path, model_version="unselected", model_required=True)
    result = evaluate_readiness(settings)
    assert result.ready is False
    assert result.reason == "model_version_unselected"


def test_readiness_requires_model_marker(tmp_path: Path) -> None:
    settings = Settings(model_dir=tmp_path, model_version="lama-v1", model_required=True)
    result = evaluate_readiness(settings)
    assert result.ready is False
    assert result.reason == "model_artifact_unavailable"


def test_readiness_passes_when_marker_exists(tmp_path: Path) -> None:
    marker = tmp_path / "lama-v1" / "READY"
    marker.parent.mkdir(parents=True)
    marker.write_text("ok", encoding="utf-8")
    settings = Settings(model_dir=tmp_path, model_version="lama-v1", model_required=True)
    result = evaluate_readiness(settings)
    assert result.ready is True
