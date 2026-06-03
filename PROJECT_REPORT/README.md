# 🤖 AI-Based Smart Assistant

An AI-powered customer support system built with Python, Streamlit, NLTK, scikit-learn, and Next.js.

## Features
- AI ticket classification (5 categories)
- NLP text preprocessing
- Smart response generation
- Real-time AI chat assistant
- Admin dashboard with analytics
- SQLite database
- Search and filter

## Quick Start

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate      # Mac/Linux
pip install -r requirements.txt
python training/train.py
streamlit run app.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Python, Streamlit, Flask
- **AI/NLP**: scikit-learn, NLTK, pandas
- **Database**: SQLite