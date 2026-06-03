"""
Smart Response Generator Module
Generates AI-powered responses to customer tickets
"""

import random
from modules.nlp_processor import extract_keywords, get_text_stats
from training.training_data import RESPONSE_TEMPLATES


def generate_response(text: str, category: str, customer_name: str = "Valued Customer") -> dict:
    """
    Generate a smart response for a support ticket.

    Args:
        text: The customer's message
        category: Classified category of the ticket
        customer_name: Customer's name for personalization

    Returns:
        dict with response text and metadata
    """
    # Get a template for this category
    templates = RESPONSE_TEMPLATES.get(category, [
        "Thank you for contacting us. We have received your message and our team will respond shortly."
    ])
    base_response = random.choice(templates)

    # Personalize the response
    personalized = f"Dear {customer_name},\n\n{base_response}"

    # Add keyword-based context
    keywords = extract_keywords(text, top_n=3)
    stats = get_text_stats(text)

    # Add urgency detection
    urgency_words = ["urgent", "immediately", "asap", "critical", "emergency", "now"]
    is_urgent = any(word in text.lower() for word in urgency_words)

    if is_urgent:
        personalized += "\n\nWe notice this is an urgent matter and have marked your ticket as HIGH PRIORITY."

    # Add closing
    personalized += (
        "\n\nIf you need any further assistance, please do not hesitate to reply to this ticket. "
        "We are here to help you 24/7.\n\nBest regards,\nAI Smart Assistant Support Team"
    )

    return {
        "response": personalized,
        "keywords_detected": keywords,
        "is_urgent": is_urgent,
        "word_count": stats["word_count"],
        "suggested_priority": "High" if is_urgent else "Medium",
    }


def generate_chat_response(user_message: str, chat_history: list, ticket_id: str = None) -> str:
    """
    Generate a conversational chatbot response.

    Args:
        user_message: The user's current message
        chat_history: List of previous messages [{"role": ..., "message": ...}]
        ticket_id: Optional ticket reference

    Returns:
        str: The chatbot's response
    """
    msg_lower = user_message.lower()

    # ── GREETING ──────────────────────────────────────────────────────────────
    greetings = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"]
    if any(greet in msg_lower for greet in greetings):
        return (
            "Hello! 👋 Welcome to AI Smart Assistant support. "
            "I'm here to help you with any issues you're facing. "
            "Could you please describe your problem or question?"
        )

    # ── STATUS CHECK ──────────────────────────────────────────────────────────
    if any(word in msg_lower for word in ["status", "update", "progress", "ticket"]):
        if ticket_id:
            return (
                f"Your ticket **{ticket_id}** is currently being processed by our team. "
                "You'll receive an email update within 24 hours. "
                "Is there anything else I can help you with?"
            )
        return (
            "To check your ticket status, please provide your ticket ID "
            "(format: TKT-XXXXXXXX). You can find it in your confirmation email."
        )

    # ── REFUND ────────────────────────────────────────────────────────────────
    if any(word in msg_lower for word in ["refund", "money back", "return", "reimburse"]):
        return (
            "I understand you're requesting a refund. Our refund policy allows returns within 30 days. "
            "To process your refund:\n"
            "1. Share your order ID\n"
            "2. Describe the reason for refund\n"
            "3. Our billing team will process it within 3-5 business days\n\n"
            "Would you like to submit a refund request ticket?"
        )

    # ── PAYMENT ───────────────────────────────────────────────────────────────
    if any(word in msg_lower for word in ["payment", "charge", "bill", "invoice", "pay"]):
        return (
            "I'm sorry to hear you're having payment issues. Here's what you can do:\n"
            "• **Double charge**: We'll reverse it within 24 hours\n"
            "• **Failed payment**: Try a different card or payment method\n"
            "• **Invoice query**: We'll email your invoice within 1 hour\n\n"
            "Please submit a ticket with your transaction ID for faster resolution."
        )

    # ── ACCOUNT ───────────────────────────────────────────────────────────────
    if any(word in msg_lower for word in ["account", "login", "password", "access", "locked"]):
        return (
            "Account issues can be frustrating! Let me help you:\n"
            "• **Forgot password**: Use 'Forgot Password' on the login page\n"
            "• **Account locked**: Wait 30 minutes or contact support\n"
            "• **Can't login**: Clear browser cache and try again\n\n"
            "If none of these work, I'll escalate this to our account team immediately."
        )

    # ── TECHNICAL ─────────────────────────────────────────────────────────────
    if any(word in msg_lower for word in ["not working", "error", "bug", "crash", "broken", "slow"]):
        return (
            "I'm sorry you're experiencing technical difficulties. Let's troubleshoot:\n"
            "1. 🔄 Refresh the page or restart the app\n"
            "2. 🗑️ Clear your browser cache (Ctrl+Shift+Del)\n"
            "3. 🌐 Try a different browser\n"
            "4. 📱 Try on a different device\n\n"
            "If the issue persists, our technical team will investigate. "
            "What device and browser are you using?"
        )

    # ── THANKS ────────────────────────────────────────────────────────────────
    if any(word in msg_lower for word in ["thank", "thanks", "great", "perfect", "awesome"]):
        return (
            "You're welcome! 😊 I'm glad I could help. "
            "Is there anything else you need assistance with today?"
        )

    # ── GOODBYE ───────────────────────────────────────────────────────────────
    if any(word in msg_lower for word in ["bye", "goodbye", "done", "that's all", "nothing"]):
        return (
            "Thank you for contacting AI Smart Assistant! 👋 "
            "Have a wonderful day. Don't hesitate to reach out if you need help!"
        )

    # ── DEFAULT ───────────────────────────────────────────────────────────────
    keywords = extract_keywords(user_message, top_n=2)
    keyword_str = ", ".join(keywords) if keywords else "your concern"

    return (
        f"I understand you're reaching out about {keyword_str}. "
        "To better assist you, could you please provide:\n"
        "• Your account email or ID\n"
        "• A brief description of the issue\n"
        "• When did this issue start?\n\n"
        "I'll make sure this gets to the right team immediately!"
    )