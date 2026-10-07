import os
from typing import List

class Settings:
    APP_TITLE: str = "TrustGuard AI Multimodal Ingress Gateway"
    VERSION: str = "1.0.0"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"

    # CORS configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ]

    # Multimodal weights for risk aggregation
    WEIGHT_VIDEO: float = 0.35
    WEIGHT_AUDIO: float = 0.25
    WEIGHT_TEXT: float = 0.25
    WEIGHT_DOC: float = 0.15

    # 3-Tier Autonomous Enforcement thresholds
    ALLOW_THRESHOLD: int = 39
    WARN_THRESHOLD: int = 69
    BLOCK_THRESHOLD: int = 70

    # Model Checkpoint Identifiers
    CHECKPOINT_VIDEO: str = "trustguard/timesformer-deepfake-v1"
    CHECKPOINT_AUDIO: str = "trustguard/wav2vec2-synthetic-voice"
    CHECKPOINT_TEXT: str = "trustguard/scam-deberta-v3-intent"
    CHECKPOINT_DOC: str = "trustguard/docu-tamper-vit-ocr"

settings = Settings()
