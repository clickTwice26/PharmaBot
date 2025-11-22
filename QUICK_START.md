# 🏥 PharmaBot - Quick Start Guide

## 🎉 Welcome!

Your complete PharmaBot application is ready! This guide will get you up and running in minutes.

---

## 🚀 Quick Start (2 Steps)

### Step 1: Navigate to Project
```bash
cd /Users/shagato/Desktop/PharmaBot/pharmabot_tech
```

### Step 2: Run Development Script
```bash
# Cross-platform Python script (Recommended)
python3 dev.py

# Or use shell scripts:
./dev.sh          # macOS/Linux
dev.bat           # Windows
```

**That's it!** 🎉 The script will:
- ✅ Install all dependencies (if needed)
- ✅ Create and configure virtual environment
- ✅ Set up the database
- ✅ Generate SECRET_KEY automatically
- ✅ Start both frontend and backend
- ✅ Open in your browser

**To stop**: Press `Ctrl+C`

---

## 🏃 Running the Application

### Option 1: Automated (Recommended)
```bash
./dev.sh
```
✅ Both servers start automatically  
✅ Backend at http://localhost:8000  
✅ Frontend at http://localhost:3000  
✅ API Docs at http://localhost:8000/docs  

### Option 2: Manual

**Start Backend (Terminal 1)**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```
✅ Backend running at http://localhost:8000

**Start Frontend (Terminal 2)**
```bash
cd frontend
npm run dev
```
✅ Frontend running at http://localhost:3000

---

## 🔧 Development Script Features

The `dev.sh` script includes:
- 🔍 **Pre-flight checks** - Verifies Python, Node.js installation
- 📦 **Auto-install** - Installs missing dependencies
- 🔐 **Secret generation** - Creates SECRET_KEY if not configured
- 🚀 **Parallel startup** - Runs both servers concurrently
- 📊 **Live logs** - Tails logs from both servers
- 🛑 **Clean shutdown** - Gracefully stops all processes
- ⚡ **Port management** - Kills conflicting processes

---

## 🎯 Test the Application

1. **Open**: http://localhost:3000
2. **Register**: Create a new account
3. **Login**: Sign in with your credentials
4. **Upload**: Select a prescription image
5. **Analyze**: Click "Analyze Prescription"
6. **View**: See AI-generated analysis

---

## 📚 Project Overview

### What's Included
- ✅ **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- ✅ **Backend**: FastAPI + Python + SQLite
- ✅ **Authentication**: JWT tokens with auto-refresh
- ✅ **AI Integration**: Google Gemini for prescription analysis
- ✅ **Database**: SQLite with Alembic migrations
- ✅ **Security**: Bcrypt password hashing, JWT tokens

### Key Features
- User registration and login
- JWT-based authentication with refresh tokens
- Prescription image upload
- AI-powered prescription analysis
- User-specific prescription history
- Automatic token refresh
- Responsive design

---

## 📂 Project Structure

```
pharmabot_tech/
├── frontend/           # Next.js app
│   ├── src/app/       # Pages (login, register, dashboard)
│   └── src/lib/       # API client
├── backend/           # FastAPI app
│   ├── app/          # Application code
│   │   ├── routers/  # API endpoints
│   │   └── models.py # Database models
│   └── alembic/      # Database migrations
└── Documentation files
```

---

## 🔐 API Endpoints

### Public
- `POST /auth/register` - Create account
- `POST /auth/login` - Get JWT tokens

### Protected (requires JWT)
- `GET /auth/me` - Current user info
- `POST /auth/refresh` - Refresh token
- `POST /prescriptions/analyze` - Analyze prescription
- `GET /prescriptions/history` - Get history

**Interactive Docs**: http://localhost:8000/docs

---

## 🛠️ Common Commands

### Backend
```bash
# Start server
cd backend && source venv/bin/activate
uvicorn app.main:app --reload

# Reset database
rm pharmabot.db && alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "description"
```

### Frontend
```bash
# Development
npm run dev

# Production build
npm run build && npm start
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### Database issues
```bash
cd backend
rm pharmabot.db
alembic upgrade head
```

### Port already in use
```bash
# Backend (port 8000)
lsof -ti:8000 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

---

## 📖 Documentation

| File | Purpose |
|------|---------|
| `README.md` | Main project overview |
| `ARCHITECTURE.md` | System architecture diagrams |
| `DEVELOPMENT.md` | Development guide |
| `SETUP_GUIDE.md` | Configuration instructions |
| `PROJECT_STRUCTURE.md` | Detailed file structure |

---

## 🎓 Next Steps

### For Learning
1. Explore the code structure
2. Test all API endpoints at /docs
3. Review the architecture diagrams
4. Read the development guide

### For Development
1. Customize the UI
2. Add new features
3. Write tests
4. Improve error handling

### For Production
1. Use PostgreSQL instead of SQLite
2. Set up HTTPS
3. Configure proper secrets management
4. Add monitoring and logging
5. Deploy to cloud provider

---

## ✅ Quick Checklist

Before you start:
- [ ] Python 3.9+ installed
- [ ] Node.js 18+ installed
- [ ] Generated SECRET_KEY
- [ ] Obtained GEMINI_API_KEY

To verify installation:
- [ ] Backend runs at http://localhost:8000
- [ ] Frontend runs at http://localhost:3000
- [ ] Can register a user
- [ ] Can login successfully
- [ ] Can upload an image
- [ ] AI analysis works

---

## 🔑 Important Configuration

### Backend `.env` (Required)
```env
SECRET_KEY=<run: openssl rand -hex 32>
GEMINI_API_KEY=<get from: https://makersuite.google.com/app/apikey>
```

### Frontend `.env.local` (Already configured)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 💡 Tips

1. **API Testing**: Use the interactive docs at /docs
2. **Database Viewer**: Use SQLite browser to inspect data
3. **Logging**: Check terminal output for errors
4. **Token Issues**: Clear browser localStorage if needed

---

## 🎊 Success!

Your PharmaBot is ready! Here's what to do:

1. ✅ Start both servers
2. ✅ Open http://localhost:3000
3. ✅ Register an account
4. ✅ Upload a prescription
5. ✅ See the magic happen!

---

## 🆘 Need Help?

1. Check the documentation files
2. Visit http://localhost:8000/docs
3. Review error messages in terminal
4. Check the troubleshooting section above

---

**Happy Coding! 🚀**

Built with Next.js, FastAPI, and Google Gemini AI
