"""
Database Manager for AI Smart Assistant
Handles all SQLite database operations
"""

import sqlite3
import os
import uuid
from datetime import datetime
from pathlib import Path


# Path to the SQLite database file
DB_PATH = Path(__file__).parent / "smart_assistant.db"
SCHEMA_PATH = Path(__file__).parent / "schema.sql"


def get_connection():
    """Create and return a database connection."""
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row  # Makes rows accessible like dicts
    conn.execute("PRAGMA journal_mode=WAL")  # Better performance
    return conn


def initialize_database():
    """Create all tables from schema.sql if they don't exist."""
    conn = get_connection()
    try:
        with open(SCHEMA_PATH, "r") as f:
            schema = f.read()
        conn.executescript(schema)
        conn.commit()
        print("✅ Database initialized successfully.")
    except Exception as e:
        print(f"❌ Database initialization error: {e}")
    finally:
        conn.close()


# ─── TICKET OPERATIONS ────────────────────────────────────────────────────────

def create_ticket(customer_name, customer_email, subject, description,
                  category="Uncategorized", confidence_score=0.0,
                  ai_response="", priority="Medium"):
    """Insert a new support ticket into the database."""
    ticket_id = f"TKT-{str(uuid.uuid4())[:8].upper()}"
    conn = get_connection()
    try:
        conn.execute("""
            INSERT INTO tickets
            (ticket_id, customer_name, customer_email, subject, description,
             category, confidence_score, ai_response, priority)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (ticket_id, customer_name, customer_email, subject, description,
              category, confidence_score, ai_response, priority))
        conn.commit()
        return ticket_id
    except Exception as e:
        print(f"❌ Error creating ticket: {e}")
        return None
    finally:
        conn.close()


def get_all_tickets(status_filter=None, category_filter=None, search_query=None):
    """Retrieve all tickets with optional filtering."""
    conn = get_connection()
    try:
        query = "SELECT * FROM tickets WHERE 1=1"
        params = []

        if status_filter and status_filter != "All":
            query += " AND status = ?"
            params.append(status_filter)

        if category_filter and category_filter != "All":
            query += " AND category = ?"
            params.append(category_filter)

        if search_query:
            query += """ AND (
                customer_name LIKE ? OR
                customer_email LIKE ? OR
                subject LIKE ? OR
                description LIKE ? OR
                ticket_id LIKE ?
            )"""
            like = f"%{search_query}%"
            params.extend([like, like, like, like, like])

        query += " ORDER BY created_at DESC"
        cursor = conn.execute(query, params)
        rows = cursor.fetchall()
        return [dict(row) for row in rows]
    except Exception as e:
        print(f"❌ Error fetching tickets: {e}")
        return []
    finally:
        conn.close()


def get_ticket_by_id(ticket_id):
    """Get a single ticket by its ID."""
    conn = get_connection()
    try:
        cursor = conn.execute(
            "SELECT * FROM tickets WHERE ticket_id = ?", (ticket_id,)
        )
        row = cursor.fetchone()
        return dict(row) if row else None
    except Exception as e:
        print(f"❌ Error fetching ticket: {e}")
        return None
    finally:
        conn.close()


def update_ticket_status(ticket_id, status):
    """Update the status of a ticket."""
    conn = get_connection()
    try:
        resolved_at = datetime.now().isoformat() if status == "Resolved" else None
        conn.execute("""
            UPDATE tickets
            SET status = ?, updated_at = ?, resolved_at = ?
            WHERE ticket_id = ?
        """, (status, datetime.now().isoformat(), resolved_at, ticket_id))
        conn.commit()
        return True
    except Exception as e:
        print(f"❌ Error updating ticket status: {e}")
        return False
    finally:
        conn.close()


def update_ticket_priority(ticket_id, priority):
    """Update the priority of a ticket."""
    conn = get_connection()
    try:
        conn.execute("""
            UPDATE tickets SET priority = ?, updated_at = ?
            WHERE ticket_id = ?
        """, (priority, datetime.now().isoformat(), ticket_id))
        conn.commit()
        return True
    except Exception as e:
        print(f"❌ Error updating ticket priority: {e}")
        return False
    finally:
        conn.close()


def delete_ticket(ticket_id):
    """Delete a ticket by ID."""
    conn = get_connection()
    try:
        conn.execute("DELETE FROM tickets WHERE ticket_id = ?", (ticket_id,))
        conn.commit()
        return True
    except Exception as e:
        print(f"❌ Error deleting ticket: {e}")
        return False
    finally:
        conn.close()


# ─── CHAT HISTORY OPERATIONS ─────────────────────────────────────────────────

def save_chat_message(session_id, role, message, ticket_id=None):
    """Save a chat message to the database."""
    conn = get_connection()
    try:
        conn.execute("""
            INSERT INTO chat_history (session_id, ticket_id, role, message)
            VALUES (?, ?, ?, ?)
        """, (session_id, ticket_id, role, message))
        conn.commit()
        return True
    except Exception as e:
        print(f"❌ Error saving chat message: {e}")
        return False
    finally:
        conn.close()


def get_chat_history(session_id):
    """Retrieve chat history for a session."""
    conn = get_connection()
    try:
        cursor = conn.execute("""
            SELECT role, message, timestamp
            FROM chat_history
            WHERE session_id = ?
            ORDER BY timestamp ASC
        """, (session_id,))
        return [dict(row) for row in cursor.fetchall()]
    except Exception as e:
        print(f"❌ Error fetching chat history: {e}")
        return []
    finally:
        conn.close()


# ─── ANALYTICS OPERATIONS ────────────────────────────────────────────────────

def get_analytics_summary():
    """Return summary statistics for the admin dashboard."""
    conn = get_connection()
    try:
        stats = {}

        # Total tickets
        cursor = conn.execute("SELECT COUNT(*) as count FROM tickets")
        stats["total_tickets"] = cursor.fetchone()["count"]

        # Open tickets
        cursor = conn.execute(
            "SELECT COUNT(*) as count FROM tickets WHERE status = 'Open'"
        )
        stats["open_tickets"] = cursor.fetchone()["count"]

        # Resolved tickets
        cursor = conn.execute(
            "SELECT COUNT(*) as count FROM tickets WHERE status = 'Resolved'"
        )
        stats["resolved_tickets"] = cursor.fetchone()["count"]

        # In Progress tickets
        cursor = conn.execute(
            "SELECT COUNT(*) as count FROM tickets WHERE status = 'In Progress'"
        )
        stats["in_progress_tickets"] = cursor.fetchone()["count"]

        # Tickets by category
        cursor = conn.execute("""
            SELECT category, COUNT(*) as count
            FROM tickets
            GROUP BY category
            ORDER BY count DESC
        """)
        stats["by_category"] = [dict(row) for row in cursor.fetchall()]

        # Tickets by priority
        cursor = conn.execute("""
            SELECT priority, COUNT(*) as count
            FROM tickets
            GROUP BY priority
        """)
        stats["by_priority"] = [dict(row) for row in cursor.fetchall()]

        # Average confidence score
        cursor = conn.execute(
            "SELECT AVG(confidence_score) as avg_score FROM tickets"
        )
        avg = cursor.fetchone()["avg_score"]
        stats["avg_confidence"] = round(avg * 100, 1) if avg else 0.0

        # Recent tickets (last 7)
        cursor = conn.execute("""
            SELECT ticket_id, customer_name, subject, category, status, created_at
            FROM tickets
            ORDER BY created_at DESC
            LIMIT 7
        """)
        stats["recent_tickets"] = [dict(row) for row in cursor.fetchall()]

        return stats
    except Exception as e:
        print(f"❌ Error fetching analytics: {e}")
        return {}
    finally:
        conn.close()