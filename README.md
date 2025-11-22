# PharmaBot

AI-powered prescription scanning and analysis application with secure user authentication.

## Project Structure

```
pharmabot_tech/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   │   ├── login/       # Login page
│   │   │   ├── register/    # Registration page
│   │   │   ├── dashboard/   # Main dashboard
│   │   │   └── ...
│   │   └── lib/             # Utilities and API client
│   ├── package.json
│   └── ...
│
└── backend/                  # FastAPI backend application
    ├── app/
    │   ├── routers/         # API route handlers
    │   │   ├── auth.py      # Authentication endpoints
    │   │   └── prescriptions.py  # Prescription endpoints
    │   ├── models.py        # Database models
    │   ├── schemas.py       # Pydantic schemas
    │   ├── auth.py          # JWT authentication utilities
    │   ├── database.py      # Database configuration
    │   ├── config.py        # Application settings
    │   └── main.py          # FastAPI application entry point
    ├── alembic/             # Database migrations
    ├── requirements.txt
    └── ...
```

## Features

- **User Authentication**: Secure JWT-based authentication with access and refresh tokens
- **Prescription Scanning**: Upload and analyze prescription images using Google Gemini AI
- **Session Management**: Automatic token refresh and session persistence
- **Database**: SQLite database with Alembic migrations
- **Modern UI**: Responsive Next.js frontend with Tailwind CSS

## Prerequisites

- Python 3.9+
- Node.js 18+
- Google Gemini API Key

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate  # On Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables:
   - Copy `.env` file and update the following:
     - `SECRET_KEY`: Generate a secure random key (min 32 characters)
     - `GEMINI_API_KEY`: Your Google Gemini API key

5. Run database migrations:
```bash
alembic upgrade head
```

6. Start the FastAPI server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: http://localhost:8000
API Documentation: http://localhost:8000/docs

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - The `.env.local` file is already configured for local development
   - Update `NEXT_PUBLIC_API_URL` if your backend runs on a different port

4. Start the development server:
```bash
npm run dev
```

The application will be available at: http://localhost:3000

## Usage

1. **Register**: Create a new account at `/register`
2. **Login**: Sign in at `/login`
3. **Upload Prescription**: Navigate to `/dashboard` and upload a prescription image
4. **View Analysis**: The AI will analyze the prescription and display the results

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and receive tokens
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user info

### Prescriptions
- `POST /prescriptions/analyze` - Upload and analyze prescription (requires authentication)
- `GET /prescriptions/history` - Get user's prescription history (requires authentication)

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Automatic token refresh
- Protected API endpoints
- CORS configuration
- Session management

## Technologies Used

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Axios for API requests

### Backend
- FastAPI
- SQLAlchemy (ORM)
- Alembic (Migrations)
- SQLite (Database)
- JWT (Authentication)
- Google Gemini AI
- Pillow (Image processing)

## Development

### Generate a new migration
```bash
cd backend
alembic revision --autogenerate -m "Description of changes"
alembic upgrade head
```

### Reset database
```bash
rm pharmabot.db
alembic upgrade head
```

## Environment Variables

### Backend (.env)
- `DATABASE_URL`: Database connection string
- `SECRET_KEY`: JWT secret key (generate with `openssl rand -hex 32`)
- `ALGORITHM`: JWT algorithm (HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Access token expiry time
- `REFRESH_TOKEN_EXPIRE_DAYS`: Refresh token expiry time
- `GEMINI_API_KEY`: Google Gemini API key
- `FRONTEND_URL`: Frontend URL for CORS

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL`: Backend API URL

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.
