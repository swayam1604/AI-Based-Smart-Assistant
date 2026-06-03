"""
Ticket Manager Module
Orchestrates ticket creation: classify → generate response → save to DB
"""

from modules.classifier import classify_ticket, is_model_loaded
from modules.response_generator import generate_response
from modules.nlp_processor import get_text_stats
from database.db_manager import (
    create_ticket, get_all_tickets, get_ticket_by_id,
    update_ticket_status, update_ticket_priority,
    delete_ticket, get_analytics_summary
)


def process_new_ticket(
    customer_name: str,
    customer_email: str,
    subject: str,
    description: str,
) -> dict:
    """
    Full pipeline: classify ticket → generate AI response → save to database.

    Returns dict with ticket_id, category, confidence, ai_response
    """
    # Combine subject and description for better classification
    full_text = f"{subject}. {description}"

    # Step 1: Classify the ticket
    if is_model_loaded():
        classification = classify_ticket(full_text)
        category = classification["category"]
        confidence = classification["confidence"]
        all_scores = classification["all_scores"]
    else:
        category = "Uncategorized"
        confidence = 0.0
        all_scores = {}
        classification = {"preprocessed_text": full_text}

    # Step 2: Generate AI response
    response_data = generate_response(
        text=full_text,
        category=category,
        customer_name=customer_name,
    )
    ai_response = response_data["response"]
    suggested_priority = response_data["suggested_priority"]

    # Step 3: Get text statistics
    text_stats = get_text_stats(description)

    # Step 4: Save to database
    ticket_id = create_ticket(
        customer_name=customer_name,
        customer_email=customer_email,
        subject=subject,
        description=description,
        category=category,
        confidence_score=confidence,
        ai_response=ai_response,
        priority=suggested_priority,
    )

    return {
        "ticket_id": ticket_id,
        "category": category,
        "confidence": confidence,
        "confidence_pct": round(confidence * 100, 1),
        "all_scores": all_scores,
        "ai_response": ai_response,
        "priority": suggested_priority,
        "is_urgent": response_data["is_urgent"],
        "keywords": response_data["keywords_detected"],
        "text_stats": text_stats,
    }


def get_tickets(status=None, category=None, search=None):
    """Fetch tickets with optional filters."""
    return get_all_tickets(status, category, search)


def get_ticket(ticket_id):
    """Fetch a single ticket."""
    return get_ticket_by_id(ticket_id)


def update_status(ticket_id, status):
    """Update ticket status."""
    return update_ticket_status(ticket_id, status)


def update_priority(ticket_id, priority):
    """Update ticket priority."""
    return update_ticket_priority(ticket_id, priority)


def remove_ticket(ticket_id):
    """Delete a ticket."""
    return delete_ticket(ticket_id)


def get_dashboard_stats():
    """Get analytics summary for admin dashboard."""
    return get_analytics_summary()