# PharmaBot - Complete Project Structure

## Root Directory
```
pharmabot_tech/
├── frontend/                 # Next.js Frontend Application
├── backend/                  # FastAPI Backend Application
├── README.md                 # Main project documentation
├── ARCHITECTURE.md           # System architecture overview
├── DEVELOPMENT.md            # Development guide
├── SETUP_GUIDE.md            # Setup and configuration guide
├── setup.sh                  # Automated setup script
└── .gitignore               # Git ignore rules
```

## Frontend Structure (Next.js)
```
frontend/
├── src/
│   ├── app/
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout component
│   │   ├── page.tsx              # Home page (redirects)
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   ├── register/
│   │   │   └── page.tsx          # Registration page
│   │   └── dashboard/
│   │       └── page.tsx          # Main dashboard (upload & analyze)
│   └── lib/
│       └── api.ts                # API client with Axios
│                                 # - Authentication service
│                                 # - Prescription service
│                                 # - Token management
│                                 # - Automatic token refresh
├── public/                       # Static assets
├── package.json                  # Node.js dependencies
├── tsconfig.json                 # TypeScript configuration
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── .env.local                   # Environment variables
├── .gitignore                   # Frontend-specific ignores
└── README.md                    # Frontend documentation
```

## Backend Structure (FastAPI)
```
backend/
├── app/
│   ├── __init__.py              # Package initialization
│   ├── main.py                  # FastAPI application entry point
│   │                            # - CORS configuration
│   │                            # - Router inclusion
│   │                            # - Health check endpoints
│   ├── config.py                # Application settings
│   │                            # - Environment variables
│   │                            # - Configuration management
│   ├── database.py              # Database configuration
│   │                            # - SQLAlchemy setup
│   │                            # - Session management
│   │                            # - get_db dependency
│   ├── models.py                # SQLAlchemy models
│   │                            # - User model
│   │                            # - RefreshToken model
│   │                            # - Prescription model
│   ├── schemas.py               # Pydantic schemas
│   │                            # - Request/Response models
│   │                            # - Data validation
│   ├── auth.py                  # Authentication utilities
│   │                            # - Password hashing
│   │                            # - JWT token creation
│   │                            # - Token verification
│   │                            # - get_current_user dependency
│   └── routers/
│       ├── __init__.py          # Routers package
│       ├── auth.py              # Authentication endpoints
│       │                        # - POST /auth/register
│       │                        # - POST /auth/login
│       │                        # - POST /auth/refresh
│       │                        # - GET /auth/me
│       └── prescriptions.py     # Prescription endpoints
│                                # - POST /prescriptions/analyze
│                                # - GET /prescriptions/history
├── alembic/
│   ├── versions/
│   │   └── 001_initial_migration.py  # Initial database schema
│   ├── env.py                   # Alembic environment
│   └── script.py.mako           # Migration template
├── alembic.ini                  # Alembic configuration
├── requirements.txt             # Python dependencies
├── .env                         # Environment variables
├── .gitignore                   # Backend-specific ignores
└── README.md                    # Backend documentation
```

## Key Files Explained

### Frontend

#### `src/lib/api.ts`
- **Purpose**: Centralized API client
- **Features**:
  - Axios instance with base URL
  - Request interceptor (adds JWT token)
  - Response interceptor (handles token refresh)
  - Authentication service methods
  - Prescription service methods

#### `src/app/login/page.tsx`
- **Purpose**: User login interface
- **Features**:
  - Username/password form
  - Login API call
  - Token storage
  - Error handling
  - Redirect to dashboard

#### `src/app/register/page.tsx`
- **Purpose**: User registration interface
- **Features**:
  - Registration form with validation
  - Password confirmation
  - API integration
  - Success redirect

#### `src/app/dashboard/page.tsx`
- **Purpose**: Main application interface
- **Features**:
  - Authentication check
  - Image upload
  - Preview display
  - Analysis results
  - Logout functionality

### Backend

#### `app/main.py`
- **Purpose**: Application entry point
- **Features**:
  - FastAPI app initialization
  - CORS middleware setup
  - Router inclusion
  - Database table creation
  - Health check endpoints

#### `app/auth.py`
- **Purpose**: Authentication logic
- **Features**:
  - Password hashing (bcrypt)
  - Access token generation (30min)
  - Refresh token generation (7 days)
  - Token verification
  - Current user dependency

#### `app/routers/auth.py`
- **Purpose**: Authentication API endpoints
- **Endpoints**:
  - Register new users
  - Login with credentials
  - Refresh access token
  - Get current user info

#### `app/routers/prescriptions.py`
- **Purpose**: Prescription analysis endpoints
- **Features**:
  - Image upload handling
  - Gemini AI integration
  - Image processing with Pillow
  - Database storage
  - User-specific history

#### `app/models.py`
- **Purpose**: Database models
- **Models**:
  - User: Authentication data
  - RefreshToken: Token management
  - Prescription: Analysis history

#### `alembic/versions/001_initial_migration.py`
- **Purpose**: Database schema migration
- **Creates**:
  - users table
  - refresh_tokens table
  - prescriptions table
  - Indexes for performance

## Database Schema

### users
```sql
id              INTEGER PRIMARY KEY
username        VARCHAR UNIQUE NOT NULL
hashed_password VARCHAR NOT NULL
created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
```

### refresh_tokens
```sql
id              INTEGER PRIMARY KEY
user_id         INTEGER NOT NULL
token           VARCHAR UNIQUE NOT NULL
expires_at      DATETIME NOT NULL
created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
```

### prescriptions
```sql
id              INTEGER PRIMARY KEY
user_id         INTEGER NOT NULL
filename        VARCHAR NOT NULL
analysis        TEXT
created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
```

## Configuration Files

### `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### `backend/.env`
```env
DATABASE_URL=sqlite:///./pharmabot.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
GEMINI_API_KEY=your-gemini-api-key
FRONTEND_URL=http://localhost:3000
```

## Dependencies

### Frontend (package.json)
```json
{
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@types/node": "^20.10.5",
    "@types/react": "^18.2.45",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.3.6"
  }
}
```

### Backend (requirements.txt)
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
alembic==1.13.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
python-dotenv==1.0.0
google-generativeai==0.3.1
Pillow==10.1.0
```

## API Endpoints Overview

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login and get tokens |
| GET | / | Welcome message |
| GET | /health | Health check |

### Protected Endpoints (Requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /auth/me | Get current user |
| POST | /auth/refresh | Refresh access token |
| POST | /prescriptions/analyze | Analyze prescription |
| GET | /prescriptions/history | Get user history |

## Security Implementation

1. **Password Security**: Bcrypt hashing with salt
2. **Token Security**: JWT with expiration
3. **API Protection**: Bearer token authentication
4. **CORS**: Configured for frontend domain
5. **Validation**: Pydantic schemas for all inputs

## Development Workflow

1. **Start Backend**: `uvicorn app.main:app --reload`
2. **Start Frontend**: `npm run dev`
3. **Access**: http://localhost:3000
4. **API Docs**: http://localhost:8000/docs

## Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] JWT tokens are generated
- [ ] Token refresh works
- [ ] Image upload works
- [ ] Gemini AI analysis works
- [ ] Results are saved to database
- [ ] Prescription history retrieval works
- [ ] Logout clears tokens
- [ ] Protected routes are secure

## Next Steps for Production

1. Replace SQLite with PostgreSQL
2. Add proper error logging
3. Implement rate limiting
4. Add input validation
5. Set up CI/CD pipeline
6. Configure SSL/TLS
7. Add monitoring and alerts
8. Implement backup strategy
9. Add comprehensive tests
10. Deploy to cloud provider
