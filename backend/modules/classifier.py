"""
AI Ticket Classifier Module
Loads the trained model and classifies new support tickets
"""

import os
import json
import joblib
import numpy as np
from pathlib import Path

from modules.nlp_processor import preprocess

# ─── PATHS ────────────────────────────────────────────────────────────────────
MODELS_DIR = Path(__file__).parent.parent / "models"
MODEL_PATH = MODELS_DIR / "classifier.pkl"
METADATA_PATH = MODELS_DIR / "model_metadata.json"

# ─── GLOBALS ─────────────────────────────────────────────────────────────────
_model = None
_metadata = None


def load_model():
    """Load the trained classifier model into memory."""
    global _model, _metadata

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model not found at {MODEL_PATH}. "
            "Please run: python training/train.py"
        )

    if _model is None:
        print("📦 Loading AI classifier model...")
        _model = joblib.load(MODEL_PATH)
        print("✅ Model loaded successfully.")

    if _metadata is None and METADATA_PATH.exists():
        with open(METADATA_PATH, "r") as f:
            _metadata = json.load(f)

    return _model


def classify_ticket(text: str) -> dict:
    """
    Classify a support ticket into a category.

    Returns:
        {
            "category": "Payment Issues",
            "confidence": 0.92,
            "all_scores": {"Payment Issues": 0.92, ...},
            "preprocessed_text": "...",
        }
    """
    model = load_model()

    # Preprocess the text
    preprocessed = preprocess(text)

    # Get prediction
    prediction = model.predict([preprocessed])[0]

    # Get probability scores for all categories
    proba = model.predict_proba([preprocessed])[0]
    classes = model.classes_

    # Build score dictionary
    all_scores = {
        cls: round(float(score), 4)
        for cls, score in zip(classes, proba)
    }

    # Confidence = highest probability
    confidence = float(max(proba))

    return {
        "category": prediction,
        "confidence": round(confidence, 4),
        "confidence_pct": round(confidence * 100, 1),
        "all_scores": all_scores,
        "preprocessed_text": preprocessed,
    }


def get_model_info() -> dict:
    """Return metadata about the loaded model."""
    load_model()
    return _metadata or {}


def is_model_loaded() -> bool:
    """Check if model files exist."""
    return MODEL_PATH.exists()