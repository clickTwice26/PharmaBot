# PharmaBot Backend

FastAPI backend with JWT authentication and Gemini AI integration.

## Quick Start

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure `.env` file with your credentials

4. Run migrations:
```bash
alembic upgrade head
```

5. Start server:
```bash
uvicorn app.main:app --reload
```

## API Documentation

Visit http://localhost:8000/docs for interactive API documentation.

## Project Structure

```
backend/
├── app/
│   ├── routers/          # API endpoints
│   ├── models.py         # Database models
│   ├── schemas.py        # Request/response schemas
│   ├── auth.py           # Authentication logic
│   ├── database.py       # Database setup
│   ├── config.py         # Configuration
│   └── main.py           # Application entry point
├── alembic/              # Database migrations
├── requirements.txt
└── .env                  # Environment variables
```
