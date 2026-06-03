"""
NLP Processor Module
Handles text preprocessing using NLTK
"""

import re
import nltk
from pathlib import Path

# Download required NLTK data (runs once automatically)
NLTK_DATA_DIR = Path(__file__).parent.parent / "assets" / "nltk_data"
NLTK_DATA_DIR.mkdir(parents=True, exist_ok=True)
nltk.data.path.append(str(NLTK_DATA_DIR))


def download_nltk_resources():
    """Download required NLTK resources if not already present."""
    resources = [
        ("tokenizers/punkt", "punkt"),
        ("corpora/stopwords", "stopwords"),
        ("tokenizers/punkt_tab", "punkt_tab"),
        ("corpora/wordnet", "wordnet"),
    ]
    for path, name in resources:
        try:
            nltk.data.find(path)
        except LookupError:
            print(f"📥 Downloading NLTK resource: {name}")
            nltk.download(name, download_dir=str(NLTK_DATA_DIR), quiet=True)


# Download on import
download_nltk_resources()

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer

# Initialize NLP tools
stemmer = PorterStemmer()
STOP_WORDS = set(stopwords.words("english"))

# Words that are important for customer support — don't remove these
KEEP_WORDS = {
    "not", "no", "never", "cannot", "can't", "won't", "didn't",
    "doesn't", "isn't", "wasn't", "weren't", "failed", "error",
    "broken", "wrong", "missing", "refund", "cancel", "issue", "problem"
}
STOP_WORDS -= KEEP_WORDS


def clean_text(text: str) -> str:
    """
    Clean and normalize input text.
    Removes special characters, URLs, extra spaces.
    """
    if not text:
        return ""

    # Lowercase
    text = text.lower()

    # Remove URLs
    text = re.sub(r"http\S+|www\S+|https\S+", "", text)

    # Remove email addresses
    text = re.sub(r"\S+@\S+", "", text)

    # Remove special characters (keep letters, numbers, spaces)
    text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)

    # Remove extra whitespace
    text = re.sub(r"\s+", " ", text).strip()

    return text


def tokenize(text: str) -> list:
    """Split text into individual words (tokens)."""
    return word_tokenize(text)


def remove_stopwords(tokens: list) -> list:
    """Remove common words that don't add meaning."""
    return [t for t in tokens if t not in STOP_WORDS and len(t) > 1]


def stem_tokens(tokens: list) -> list:
    """Reduce words to their root form (e.g., 'running' → 'run')."""
    return [stemmer.stem(t) for t in tokens]


def preprocess(text: str, use_stemming: bool = False) -> str:
    """
    Full preprocessing pipeline:
    clean → tokenize → remove stopwords → (optional) stem → rejoin
    """
    cleaned = clean_text(text)
    tokens = tokenize(cleaned)
    tokens = remove_stopwords(tokens)
    if use_stemming:
        tokens = stem_tokens(tokens)
    return " ".join(tokens)


def extract_keywords(text: str, top_n: int = 5) -> list:
    """
    Extract the most important keywords from a text.
    Returns top N words by frequency (excluding stopwords).
    """
    cleaned = clean_text(text)
    tokens = tokenize(cleaned)
    tokens = remove_stopwords(tokens)

    # Count word frequency
    freq = {}
    for token in tokens:
        freq[token] = freq.get(token, 0) + 1

    # Sort by frequency
    sorted_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)
    return [word for word, _ in sorted_words[:top_n]]


def get_text_stats(text: str) -> dict:
    """Return basic statistics about the input text."""
    words = text.split()
    sentences = re.split(r"[.!?]+", text)
    return {
        "word_count": len(words),
        "sentence_count": len([s for s in sentences if s.strip()]),
        "character_count": len(text),
        "avg_word_length": round(sum(len(w) for w in words) / len(words), 1) if words else 0,
        "keywords": extract_keywords(text),
    }