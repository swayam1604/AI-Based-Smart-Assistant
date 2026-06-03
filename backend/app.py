"""
AI Smart Assistant — Main Application
Run with: streamlit run app.py
"""

import streamlit as st
import sys
import os
from pathlib import Path
from datetime import datetime
import uuid

# ─── PATH SETUP ──────────────────────────────────────────────────────────────
sys.path.insert(0, str(Path(__file__).parent))

# Initialize database on startup
from database.db_manager import initialize_database
initialize_database()

from modules.ticket_manager import (
    process_new_ticket, get_tickets, get_ticket,
    update_status, update_priority, remove_ticket, get_dashboard_stats
)
from modules.classifier import is_model_loaded, get_model_info
from database.db_manager import save_chat_message, get_chat_history
from modules.response_generator import generate_chat_response

# ─── PAGE CONFIGURATION ───────────────────────────────────────────────────────
st.set_page_config(
    page_title="AI Smart Assistant",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ─── CUSTOM CSS ───────────────────────────────────────────────────────────────
st.markdown("""
<style>
    .main { background-color: #0f1117; }
    .stApp { background-color: #0f1117; }

    .metric-card {
        background: linear-gradient(135deg, #1a1f2e, #252b3d);
        border: 1px solid #2d3555;
        border-radius: 12px;
        padding: 20px;
        margin: 8px 0;
        text-align: center;
    }
    .metric-card h2 { color: #7c8cf8; font-size: 2rem; margin: 0; }
    .metric-card p  { color: #8892b0; margin: 0; font-size: 0.9rem; }

    .ticket-card {
        background: #1a1f2e;
        border: 1px solid #2d3555;
        border-radius: 10px;
        padding: 16px;
        margin: 8px 0;
    }

    .badge-open       { background:#2d4a3e; color:#4ade80; padding:3px 10px; border-radius:20px; font-size:0.8rem; }
    .badge-resolved   { background:#1e3a5f; color:#60a5fa; padding:3px 10px; border-radius:20px; font-size:0.8rem; }
    .badge-progress   { background:#3d2e1e; color:#fbbf24; padding:3px 10px; border-radius:20px; font-size:0.8rem; }
    .badge-closed     { background:#2d2d2d; color:#9ca3af; padding:3px 10px; border-radius:20px; font-size:0.8rem; }
    .badge-high       { background:#4a1e1e; color:#f87171; padding:3px 10px; border-radius:20px; font-size:0.8rem; }
    .badge-medium     { background:#3d2e1e; color:#fbbf24; padding:3px 10px; border-radius:20px; font-size:0.8rem; }
    .badge-low        { background:#1e3d2e; color:#4ade80; padding:3px 10px; border-radius:20px; font-size:0.8rem; }

    .chat-user { background:#1e3a5f; border-radius:12px 12px 4px 12px; padding:12px 16px; margin:8px 0 8px 60px; color:#e2e8f0; }
    .chat-bot  { background:#1a1f2e; border: 1px solid #2d3555; border-radius:12px 12px 12px 4px; padding:12px 16px; margin:8px 60px 8px 0; color:#e2e8f0; }

    .hero-title { font-size: 2.5rem; font-weight: 700; color: #7c8cf8; text-align: center; }
    .hero-sub   { font-size: 1.1rem; color: #8892b0; text-align: center; margin-bottom: 2rem; }

    .sidebar .stSelectbox label { color: #8892b0; }
    .stTextInput input, .stTextArea textarea {
        background-color: #1a1f2e !important;
        border: 1px solid #2d3555 !important;
        color: #e2e8f0 !important;
        border-radius: 8px !important;
    }
    .stButton > button {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        padding: 0.5rem 2rem;
        transition: all 0.3s;
    }
    .stButton > button:hover { opacity: 0.85; transform: translateY(-1px); }

    .success-box { background: #1e3d2e; border: 1px solid #4ade80; border-radius: 10px; padding: 16px; }
    .info-box { background: #1e3a5f; border: 1px solid #60a5fa; border-radius: 10px; padding: 16px; }
    div[data-testid="stExpander"] { border: 1px solid #2d3555 !important; border-radius: 10px !important; }
</style>
""", unsafe_allow_html=True)


# ─── SESSION STATE INIT ───────────────────────────────────────────────────────
if "chat_session_id" not in st.session_state:
    st.session_state.chat_session_id = str(uuid.uuid4())
if "chat_messages" not in st.session_state:
    st.session_state.chat_messages = []
if "current_page" not in st.session_state:
    st.session_state.current_page = "🏠 Home"


# ─── SIDEBAR ─────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("## 🤖 AI Smart Assistant")
    st.markdown("---")

    page = st.selectbox(
        "Navigate",
        [
            "🏠 Home",
            "🎫 Submit Ticket",
            "💬 AI Chat Assistant",
            "📋 All Tickets",
            "📊 Admin Dashboard",
            "🔍 Search Tickets",
        ],
        index=0,
    )

    st.markdown("---")

    # Model status
    if is_model_loaded():
        info = get_model_info()
        st.success("✅ AI Model Active")
        if info:
            st.caption(f"Accuracy: {info.get('accuracy', '?')}%")
            st.caption(f"Model: {info.get('model_type', 'N/A')}")
    else:
        st.error("❌ Model Not Trained")
        st.caption("Run: `python training/train.py`")

    st.markdown("---")
    st.caption("🛡️ Powered by scikit-learn + NLTK")
    st.caption("💾 SQLite Database")
    st.caption(f"🕐 {datetime.now().strftime('%H:%M:%S')}")


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE: HOME
# ═══════════════════════════════════════════════════════════════════════════════
if page == "🏠 Home":
    st.markdown('<div class="hero-title">🤖 AI Smart Assistant</div>', unsafe_allow_html=True)
    st.markdown(
        '<div class="hero-sub">Intelligent Customer Support powered by Machine Learning & NLP</div>',
        unsafe_allow_html=True
    )

    st.markdown("---")

    # Quick stats
    stats = get_dashboard_stats()
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.markdown(f'<div class="metric-card"><h2>{stats.get("total_tickets", 0)}</h2><p>Total Tickets</p></div>', unsafe_allow_html=True)
    with col2:
        st.markdown(f'<div class="metric-card"><h2>{stats.get("open_tickets", 0)}</h2><p>Open</p></div>', unsafe_allow_html=True)
    with col3:
        st.markdown(f'<div class="metric-card"><h2>{stats.get("resolved_tickets", 0)}</h2><p>Resolved</p></div>', unsafe_allow_html=True)
    with col4:
        st.markdown(f'<div class="metric-card"><h2>{stats.get("avg_confidence", 0)}%</h2><p>AI Confidence</p></div>', unsafe_allow_html=True)

    st.markdown("---")

    # Features
    st.markdown("### ✨ Features")
    col1, col2, col3 = st.columns(3)
    with col1:
        st.info("🧠 **AI Classification**\nAutomatically categorizes tickets using NLP + Machine Learning")
        st.info("💬 **AI Chat Assistant**\nReal-time intelligent chat support with context awareness")
    with col2:
        st.info("⚡ **Instant Responses**\nGenerates smart, personalized responses automatically")
        st.info("📊 **Analytics Dashboard**\nTrack metrics, trends, and team performance")
    with col3:
        st.info("🎯 **5 Categories**\nPayment, Technical, Account, Product, Service")
        st.info("🔍 **Search & Filter**\nPowerful search across all tickets and conversations")

    # Recent tickets
    if stats.get("recent_tickets"):
        st.markdown("### 📋 Recent Tickets")
        for ticket in stats["recent_tickets"][:5]:
            status = ticket["status"]
            badge_class = {
                "Open": "badge-open", "Resolved": "badge-resolved",
                "In Progress": "badge-progress", "Closed": "badge-closed"
            }.get(status, "badge-open")
            st.markdown(f"""
            <div class="ticket-card">
                <strong style="color:#e2e8f0">{ticket['ticket_id']}</strong>
                &nbsp;&nbsp;
                <span class="{badge_class}">{status}</span>
                &nbsp;&nbsp;
                <span style="color:#8892b0; font-size:0.85rem">{ticket['category']}</span>
                <br/>
                <span style="color:#e2e8f0">{ticket['subject'][:60]}...</span>
                <span style="color:#4a5568; float:right; font-size:0.8rem">{ticket['customer_name']}</span>
            </div>
            """, unsafe_allow_html=True)


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE: SUBMIT TICKET
# ═══════════════════════════════════════════════════════════════════════════════
elif page == "🎫 Submit Ticket":
    st.markdown("## 🎫 Submit a Support Ticket")
    st.markdown("Our AI will automatically classify your issue and generate a response.")
    st.markdown("---")

    with st.form("ticket_form", clear_on_submit=True):
        col1, col2 = st.columns(2)
        with col1:
            name = st.text_input("👤 Your Name *", placeholder="John Smith")
        with col2:
            email = st.text_input("📧 Your Email *", placeholder="john@example.com")

        subject = st.text_input("📝 Subject *", placeholder="Brief description of your issue")
        description = st.text_area(
            "📄 Describe Your Issue *",
            placeholder="Please describe your problem in detail...",
            height=150,
        )

        col1, col2 = st.columns([1, 3])
        with col1:
            submitted = st.form_submit_button("🚀 Submit Ticket", use_container_width=True)

    if submitted:
        if not all([name, email, subject, description]):
            st.error("⚠️ Please fill in all required fields.")
        elif "@" not in email:
            st.error("⚠️ Please enter a valid email address.")
        else:
            with st.spinner("🤖 AI is analyzing your ticket..."):
                result = process_new_ticket(
                    customer_name=name,
                    customer_email=email,
                    subject=subject,
                    description=description,
                )

            if result["ticket_id"]:
                st.balloons()
                st.markdown(f"""
                <div class="success-box">
                    <h3 style="color:#4ade80">✅ Ticket Submitted Successfully!</h3>
                    <p style="color:#e2e8f0">Ticket ID: <strong>{result['ticket_id']}</strong></p>
                </div>
                """, unsafe_allow_html=True)

                col1, col2 = st.columns(2)
                with col1:
                    st.markdown("### 🧠 AI Classification Result")
                    st.metric("Category", result["category"])
                    st.metric("Confidence", f"{result['confidence_pct']}%")
                    st.metric("Priority", result["priority"])

                    if result["all_scores"]:
                        st.markdown("**All Category Scores:**")
                        for cat, score in sorted(result["all_scores"].items(), key=lambda x: x[1], reverse=True):
                            pct = round(score * 100, 1)
                            color = "#7c8cf8" if cat == result["category"] else "#4a5568"
                            st.markdown(f'<span style="color:{color}">{cat}: **{pct}%**</span>', unsafe_allow_html=True)
                            st.progress(score)

                with col2:
                    st.markdown("### 💌 AI Generated Response")
                    st.markdown(f"""
                    <div class="info-box">
                        <p style="color:#e2e8f0; white-space: pre-wrap;">{result['ai_response']}</p>
                    </div>
                    """, unsafe_allow_html=True)

                    if result["keywords"]:
                        st.markdown(f"**Keywords Detected:** `{'` `'.join(result['keywords'])}`")
                    if result["is_urgent"]:
                        st.warning("🚨 Urgent ticket detected — marked as HIGH PRIORITY")
            else:
                st.error("❌ Failed to create ticket. Please try again.")


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE: AI CHAT ASSISTANT
# ═══════════════════════════════════════════════════════════════════════════════
elif page == "💬 AI Chat Assistant":
    st.markdown("## 💬 AI Chat Assistant")
    st.markdown("Chat with our intelligent support assistant in real-time.")
    st.markdown("---")

    # Chat container
    chat_container = st.container()
    with chat_container:
        if not st.session_state.chat_messages:
            st.markdown("""
            <div class="chat-bot">
                👋 <strong>Hello! I'm your AI Support Assistant.</strong><br/>
                I can help you with payment issues, technical problems, account questions,
                product complaints, and service requests.<br/><br/>
                How can I help you today?
            </div>
            """, unsafe_allow_html=True)

        for msg in st.session_state.chat_messages:
            if msg["role"] == "user":
                st.markdown(f'<div class="chat-user">👤 {msg["message"]}</div>', unsafe_allow_html=True)
            else:
                st.markdown(f'<div class="chat-bot">🤖 {msg["message"]}</div>', unsafe_allow_html=True)

    st.markdown("---")

    # Input
    with st.form("chat_form", clear_on_submit=True):
        col1, col2 = st.columns([5, 1])
        with col1:
            user_input = st.text_input(
                "Your message",
                placeholder="Type your message here...",
                label_visibility="collapsed"
            )
        with col2:
            send = st.form_submit_button("Send 📤", use_container_width=True)

    if send and user_input.strip():
        # Save user message
        st.session_state.chat_messages.append({
            "role": "user",
            "message": user_input
        })
        save_chat_message(st.session_state.chat_session_id, "user", user_input)

        # Generate response
        with st.spinner("🤖 Thinking..."):
            response = generate_chat_response(
                user_message=user_input,
                chat_history=st.session_state.chat_messages,
            )

        # Save bot response
        st.session_state.chat_messages.append({
            "role": "assistant",
            "message": response
        })
        save_chat_message(st.session_state.chat_session_id, "assistant", response)

        st.rerun()

    # Clear chat button
    col1, col2 = st.columns([5, 1])
    with col2:
        if st.button("🗑️ Clear Chat"):
            st.session_state.chat_messages = []
            st.session_state.chat_session_id = str(uuid.uuid4())
            st.rerun()


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE: ALL TICKETS
# ═══════════════════════════════════════════════════════════════════════════════
elif page == "📋 All Tickets":
    st.markdown("## 📋 All Support Tickets")

    # Filters
    col1, col2, col3 = st.columns(3)
    with col1:
        status_filter = st.selectbox(
            "Filter by Status",
            ["All", "Open", "In Progress", "Resolved", "Closed"]
        )
    with col2:
        category_filter = st.selectbox(
            "Filter by Category",
            ["All", "Payment Issues", "Technical Support",
             "Account Problems", "Product Complaints", "Service Requests"]
        )
    with col3:
        search_query = st.text_input("🔍 Search", placeholder="Search by name, email, subject...")

    tickets = get_tickets(
        status=status_filter if status_filter != "All" else None,
        category=category_filter if category_filter != "All" else None,
        search=search_query if search_query else None,
    )

    st.markdown(f"**{len(tickets)} ticket(s) found**")
    st.markdown("---")

    if not tickets:
        st.info("📭 No tickets found matching your filters.")
    else:
        for ticket in tickets:
            status = ticket["status"]
            priority = ticket["priority"]

            status_badge = {
                "Open": "🟢", "In Progress": "🟡",
                "Resolved": "🔵", "Closed": "⚫"
            }.get(status, "🟢")

            priority_badge = {"High": "🔴", "Medium": "🟡", "Low": "🟢"}.get(priority, "🟡")

            with st.expander(
                f"{status_badge} {ticket['ticket_id']} — {ticket['subject'][:50]} "
                f"| {ticket['category']} | {priority_badge} {priority}"
            ):
                col1, col2 = st.columns(2)
                with col1:
                    st.markdown(f"**Customer:** {ticket['customer_name']}")
                    st.markdown(f"**Email:** {ticket['customer_email']}")
                    st.markdown(f"**Category:** {ticket['category']}")
                    st.markdown(f"**Confidence:** {round(ticket['confidence_score'] * 100, 1)}%")
                    st.markdown(f"**Created:** {ticket['created_at'][:19]}")
                    st.markdown(f"**Description:**\n{ticket['description']}")

                with col2:
                    st.markdown("**AI Response:**")
                    st.markdown(f"""
                    <div class="info-box" style="max-height: 200px; overflow-y: auto;">
                        <p style="color:#e2e8f0; font-size: 0.85rem; white-space: pre-wrap;">{ticket.get('ai_response', 'N/A')}</p>
                    </div>
                    """, unsafe_allow_html=True)

                    # Update controls
                    st.markdown("**Update Ticket:**")
                    new_status = st.selectbox(
                        "Status",
                        ["Open", "In Progress", "Resolved", "Closed"],
                        index=["Open", "In Progress", "Resolved", "Closed"].index(status),
                        key=f"status_{ticket['ticket_id']}"
                    )
                    new_priority = st.selectbox(
                        "Priority",
                        ["High", "Medium", "Low"],
                        index=["High", "Medium", "Low"].index(priority),
                        key=f"priority_{ticket['ticket_id']}"
                    )

                    col_a, col_b = st.columns(2)
                    with col_a:
                        if st.button("💾 Update", key=f"update_{ticket['ticket_id']}"):
                            update_status(ticket["ticket_id"], new_status)
                            update_priority(ticket["ticket_id"], new_priority)
                            st.success("✅ Updated!")
                            st.rerun()
                    with col_b:
                        if st.button("🗑️ Delete", key=f"delete_{ticket['ticket_id']}"):
                            remove_ticket(ticket["ticket_id"])
                            st.warning("🗑️ Ticket deleted.")
                            st.rerun()


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE: ADMIN DASHBOARD
# ═══════════════════════════════════════════════════════════════════════════════
elif page == "📊 Admin Dashboard":
    st.markdown("## 📊 Admin Dashboard")
    st.markdown("Real-time analytics and system overview.")
    st.markdown("---")

    stats = get_dashboard_stats()

    # Row 1: Key Metrics
    col1, col2, col3, col4, col5 = st.columns(5)
    metrics = [
        ("📊 Total", stats.get("total_tickets", 0)),
        ("🟢 Open", stats.get("open_tickets", 0)),
        ("🟡 In Progress", stats.get("in_progress_tickets", 0)),
        ("🔵 Resolved", stats.get("resolved_tickets", 0)),
        ("🎯 AI Confidence", f"{stats.get('avg_confidence', 0)}%"),
    ]
    for col, (label, value) in zip([col1, col2, col3, col4, col5], metrics):
        with col:
            st.markdown(f'<div class="metric-card"><h2>{value}</h2><p>{label}</p></div>', unsafe_allow_html=True)

    st.markdown("---")

    # Row 2: Category & Priority breakdown
    col1, col2 = st.columns(2)

    with col1:
        st.markdown("### 📂 Tickets by Category")
        by_cat = stats.get("by_category", [])
        if by_cat:
            for item in by_cat:
                total = stats.get("total_tickets", 1) or 1
                pct = round(item["count"] / total * 100, 1)
                st.markdown(f"**{item['category']}** — {item['count']} tickets ({pct}%)")
                st.progress(item["count"] / total)
        else:
            st.info("No data yet.")

    with col2:
        st.markdown("### 🚦 Tickets by Priority")
        by_pri = stats.get("by_priority", [])
        priority_colors = {"High": "🔴", "Medium": "🟡", "Low": "🟢"}
        if by_pri:
            for item in by_pri:
                emoji = priority_colors.get(item["priority"], "⚪")
                st.markdown(f"**{emoji} {item['priority']}** — {item['count']} tickets")
        else:
            st.info("No data yet.")

    st.markdown("---")

    # Row 3: Recent Tickets Table
    st.markdown("### 📋 Recent Tickets")
    recent = stats.get("recent_tickets", [])
    if recent:
        for t in recent:
            col1, col2, col3, col4 = st.columns([2, 3, 2, 2])
            with col1:
                st.code(t["ticket_id"])
            with col2:
                st.write(t["subject"][:40] + "..." if len(t.get("subject", "")) > 40 else t.get("subject", ""))
            with col3:
                st.write(t["category"])
            with col4:
                st.write(t["status"])
    else:
        st.info("📭 No tickets yet. Submit your first ticket!")


# ═══════════════════════════════════════════════════════════════════════════════
# PAGE: SEARCH TICKETS
# ═══════════════════════════════════════════════════════════════════════════════
elif page == "🔍 Search Tickets":
    st.markdown("## 🔍 Search Tickets")
    st.markdown("---")

    query = st.text_input(
        "Search",
        placeholder="Enter ticket ID, customer name, email, or keywords...",
        label_visibility="collapsed"
    )

    if query:
        results = get_tickets(search=query)
        st.markdown(f"**{len(results)} result(s) found for:** `{query}`")
        st.markdown("---")

        if not results:
            st.info("😕 No tickets matched your search.")
        else:
            for ticket in results:
                st.markdown(f"""
                <div class="ticket-card">
                    <strong style="color:#7c8cf8">{ticket['ticket_id']}</strong>
                    &nbsp;·&nbsp;
                    <span style="color:#e2e8f0">{ticket['subject']}</span>
                    <br/>
                    <span style="color:#8892b0; font-size:0.85rem">
                        👤 {ticket['customer_name']} &nbsp;·&nbsp;
                        📧 {ticket['customer_email']} &nbsp;·&nbsp;
                        🏷️ {ticket['category']} &nbsp;·&nbsp;
                        📅 {ticket['created_at'][:10]}
                    </span>
                </div>
                """, unsafe_allow_html=True)
    else:
        st.info("👆 Type something in the search box above to find tickets.")