# PharmaBot - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                    (Next.js + TypeScript)                    │
│  ┌───────────┐  ┌───────────┐  ┌──────────────────────┐   │
│  │  Login    │  │ Register  │  │     Dashboard        │   │
│  │  Page     │  │   Page    │  │ (Upload & Analysis)  │   │
│  └───────────┘  └───────────┘  └──────────────────────┘   │
│                                                              │
│              ┌──────────────────────────┐                   │
│              │    API Client (Axios)    │                   │
│              │  - JWT Token Management  │                   │
│              │  - Auto Token Refresh    │                   │
│              └──────────────────────────┘                   │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST API
                       │ (JWT Bearer Token)
┌──────────────────────▼──────────────────────────────────────┐
│                         Backend                              │
│                   (FastAPI + Python)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  API Endpoints                        │  │
│  │  ┌────────────┐  ┌─────────────────────────────┐    │  │
│  │  │    Auth    │  │      Prescriptions          │    │  │
│  │  │  /register │  │  /analyze (Protected)       │    │  │
│  │  │  /login    │  │  /history (Protected)       │    │  │
│  │  │  /refresh  │  │                             │    │  │
│  │  └────────────┘  └─────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Authentication Middleware                  │  │
│  │  - JWT Token Validation                              │  │
│  │  - User Session Management                           │  │
│  │  - Dependency Injection (FastAPI Depends)            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │               Business Logic Layer                    │  │
│  │  - Password Hashing (bcrypt)                         │  │
│  │  - Token Generation (JWT)                            │  │
│  │  - Image Processing (Pillow)                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            External Services                          │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │      Google Gemini AI API                    │   │  │
│  │  │  - Prescription Image Analysis               │   │  │
│  │  │  - Text Extraction                           │   │  │
│  │  │  - Medical Information Parsing               │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Database Layer (SQLAlchemy ORM)            │  │
│  │  - User Management                                   │  │
│  │  - Refresh Token Storage                             │  │
│  │  - Prescription History                              │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
             ┌──────────────────┐
             │   SQLite Database │
             │   - users         │
             │   - refresh_tokens│
             │   - prescriptions │
             └──────────────────┘
```

## Authentication Flow

```
┌─────────┐                  ┌─────────┐                 ┌──────────┐
│ Client  │                  │ Backend │                 │ Database │
└────┬────┘                  └────┬────┘                 └────┬─────┘
     │                            │                           │
     │  1. POST /auth/register    │                           │
     │  (username, password)      │                           │
     ├───────────────────────────>│                           │
     │                            │  2. Hash password         │
     │                            │     Create user           │
     │                            ├──────────────────────────>│
     │                            │                           │
     │  3. User created           │<──────────────────────────┤
     │<───────────────────────────┤                           │
     │                            │                           │
     │  4. POST /auth/login       │                           │
     │  (username, password)      │                           │
     ├───────────────────────────>│                           │
     │                            │  5. Verify credentials    │
     │                            ├──────────────────────────>│
     │                            │                           │
     │                            │  6. Generate tokens       │
     │                            │     - Access Token (30m)  │
     │                            │     - Refresh Token (7d)  │
     │                            │                           │
     │  7. Return tokens          │                           │
     │<───────────────────────────┤                           │
     │                            │                           │
     │  8. Store tokens           │                           │
     │     in localStorage        │                           │
     │                            │                           │
     │  9. API Request            │                           │
     │  Authorization: Bearer     │                           │
     │  {access_token}            │                           │
     ├───────────────────────────>│                           │
     │                            │  10. Validate JWT         │
     │                            │                           │
     │  11. Protected Resource    │                           │
     │<───────────────────────────┤                           │
     │                            │                           │
```

## Prescription Analysis Flow

```
┌─────────┐              ┌─────────┐              ┌──────────┐
│ Client  │              │ Backend │              │ Gemini AI│
└────┬────┘              └────┬────┘              └────┬─────┘
     │                        │                        │
     │  1. Upload Image       │                        │
     │  + JWT Token           │                        │
     ├───────────────────────>│                        │
     │                        │  2. Validate Token     │
     │                        │     Verify User        │
     │                        │                        │
     │                        │  3. Process Image      │
     │                        │     (Pillow)           │
     │                        │                        │
     │                        │  4. Send to Gemini     │
     │                        │     with prompt        │
     │                        ├───────────────────────>│
     │                        │                        │
     │                        │  5. AI Analysis        │
     │                        │<───────────────────────┤
     │                        │                        │
     │                        │  6. Save to DB         │
     │                        │     (user_id, file,    │
     │                        │      analysis)         │
     │                        │                        │
     │  7. Return Analysis    │                        │
     │<───────────────────────┤                        │
     │                        │                        │
```

## Database Schema

```sql
┌─────────────────────────────┐
│           users             │
├─────────────────────────────┤
│ id (PK)                     │
│ username (UNIQUE)           │
│ hashed_password             │
│ created_at                  │
│ updated_at                  │
└─────────────────────────────┘
              │
              │ 1:N
              │
┌─────────────▼───────────────┐
│      refresh_tokens         │
├─────────────────────────────┤
│ id (PK)                     │
│ user_id (FK)                │
│ token (UNIQUE)              │
│ expires_at                  │
│ created_at                  │
└─────────────────────────────┘

┌─────────────────────────────┐
│       prescriptions         │
├─────────────────────────────┤
│ id (PK)                     │
│ user_id (FK)                │
│ filename                    │
│ analysis (TEXT)             │
│ created_at                  │
└─────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Hooks (useState, useEffect)

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.9+
- **Database**: SQLite3
- **ORM**: SQLAlchemy
- **Migrations**: Alembic
- **Authentication**: JWT (python-jose)
- **Password Hashing**: Passlib (bcrypt)
- **AI Service**: Google Gemini API
- **Image Processing**: Pillow

## Security Features

1. **Password Security**
   - Passwords hashed with bcrypt
   - Never stored in plain text

2. **Token-Based Authentication**
   - Short-lived access tokens (30 minutes)
   - Long-lived refresh tokens (7 days)
   - Automatic token refresh

3. **API Protection**
   - All sensitive endpoints require authentication
   - JWT validation on every request
   - CORS configuration

4. **Session Management**
   - Refresh tokens stored in database
   - Token expiration validation
   - Logout support (client-side token removal)

## API Endpoints Summary

### Public Endpoints
- `POST /auth/register` - Create new user account
- `POST /auth/login` - Authenticate and receive tokens

### Protected Endpoints (Require JWT)
- `GET /auth/me` - Get current user information
- `POST /auth/refresh` - Refresh access token
- `POST /prescriptions/analyze` - Upload and analyze prescription
- `GET /prescriptions/history` - Get user's prescription history

## Deployment Considerations

### Frontend
- Build with `npm run build`
- Deploy to Vercel, Netlify, or any static hosting
- Set environment variables for API URL

### Backend
- Use production WSGI server (gunicorn + uvicorn)
- Secure SECRET_KEY generation
- Use proper database (PostgreSQL for production)
- Set up HTTPS
- Configure proper CORS origins
- Store API keys securely (environment variables or secrets manager)
