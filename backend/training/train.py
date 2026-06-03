"""
AI Model Training Script
Trains a ticket classification model using scikit-learn
Run this script once to generate the trained model files
"""

import sys
import os
import json
import joblib
import numpy as np

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.metrics import classification_report, confusion_matrix
from training.training_data import get_training_texts, get_training_labels, get_categories
from pathlib import Path

# ─── PATHS ────────────────────────────────────────────────────────────────────
MODELS_DIR = Path(__file__).parent.parent / "models"
MODELS_DIR.mkdir(exist_ok=True)

MODEL_PATH = MODELS_DIR / "classifier.pkl"
VECTORIZER_PATH = MODELS_DIR / "vectorizer.pkl"
METADATA_PATH = MODELS_DIR / "model_metadata.json"


def train_classifier():
    """Train the ticket classification model."""
    print("=" * 60)
    print("  AI Ticket Classifier — Training")
    print("=" * 60)

    # Load training data
    texts = get_training_texts()
    labels = get_training_labels()
    categories = get_categories()

    print(f"\n📊 Training Data Summary:")
    print(f"   Total samples     : {len(texts)}")
    print(f"   Total categories  : {len(categories)}")
    for cat in categories:
        count = labels.count(cat)
        print(f"   {cat:<30} {count} samples")

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        texts, labels, test_size=0.2, random_state=42, stratify=labels
    )

    print(f"\n🔀 Data Split:")
    print(f"   Training samples  : {len(X_train)}")
    print(f"   Testing samples   : {len(X_test)}")

    # Build pipeline: TF-IDF + Logistic Regression
    print("\n🔧 Building Model Pipeline...")
    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(
            ngram_range=(1, 2),      # Use single words and pairs
            max_features=5000,        # Top 5000 features
            sublinear_tf=True,        # Scale TF scores
            strip_accents="unicode",
            analyzer="word",
            token_pattern=r"\b[a-zA-Z]{2,}\b",
            min_df=1,
        )),
        ("clf", LogisticRegression(
            max_iter=1000,
            C=5.0,                    # Regularization
            solver="lbfgs",
            
            random_state=42,
        ))
    ])

    # Train the model
    print("🚀 Training model...")
    pipeline.fit(X_train, y_train)

    # Evaluate
    print("\n📈 Model Evaluation:")
    y_pred = pipeline.predict(X_test)
    accuracy = (np.array(y_pred) == np.array(y_test)).mean()
    print(f"   Test Accuracy     : {accuracy * 100:.1f}%")

    # Cross-validation
    cv_scores = cross_val_score(pipeline, texts, labels, cv=5)
    print(f"   Cross-Val (5-fold): {cv_scores.mean() * 100:.1f}% ± {cv_scores.std() * 100:.1f}%")

    print("\n📋 Classification Report:")
    print(classification_report(y_test, y_pred))

    # Save model
    print("💾 Saving model files...")
    joblib.dump(pipeline, MODEL_PATH)
    print(f"   ✅ Model saved to: {MODEL_PATH}")

    # Save metadata
    metadata = {
        "categories": categories,
        "accuracy": round(accuracy * 100, 2),
        "cv_accuracy": round(cv_scores.mean() * 100, 2),
        "training_samples": len(texts),
        "model_type": "TF-IDF + Logistic Regression",
        "features": 5000,
    }
    with open(METADATA_PATH, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"   ✅ Metadata saved to: {METADATA_PATH}")

    print("\n" + "=" * 60)
    print("  Training Complete! ✅")
    print("=" * 60)

    return pipeline, metadata


if __name__ == "__main__":
    train_classifier()