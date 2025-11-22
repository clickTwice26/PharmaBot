# 🚀 PharmaBot - Quick Command Reference

## Start Development Servers

### One Command (Recommended)
```bash
python3 dev.py        # Cross-platform - Starts both servers (RECOMMENDED)
./dev.sh              # macOS/Linux - Shell script
dev.bat               # Windows - Batch script
```

**Features:**
- ✅ Auto-installs dependencies
- ✅ Sets up database
- ✅ Generates secrets
- ✅ Starts both servers
- ✅ Shows live logs
- ✅ Clean shutdown with Ctrl+C

---

## Manual Commands

### Backend
```bash
cd backend
source venv/bin/activate    # Activate virtual environment
uvicorn app.main:app --reload  # Start server
```

### Frontend
```bash
cd frontend
npm run dev                 # Start development server
```

---

## Common Tasks

### View Logs
```bash
tail -f backend.log         # Backend logs
tail -f frontend.log        # Frontend logs
tail -f backend.log frontend.log  # Both logs
```

### Stop Servers
```bash
Ctrl+C                      # In dev.sh terminal
lsof -ti:8000 | xargs kill -9  # Force kill backend
lsof -ti:3000 | xargs kill -9  # Force kill frontend
```

### Reset Database
```bash
cd backend
rm pharmabot.db
alembic upgrade head
```

### Install/Update Dependencies
```bash
# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### Generate SECRET_KEY
```bash
openssl rand -hex 32
# Copy output to backend/.env
```

---

## URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| API Health | http://localhost:8000/health |

---

## Configuration Files

| File | Purpose |
|------|---------|
| `backend/.env` | Backend configuration |
| `frontend/.env.local` | Frontend configuration |
| `backend/alembic.ini` | Database migrations |

---

## Key Scripts

| Script | Purpose |
|--------|---------|
| `./dev.sh` | Run both servers (macOS/Linux) |
| `dev.bat` | Run both servers (Windows) |
| `./setup.sh` | Initial project setup |

---

## Troubleshooting One-Liners

```bash
# Check if servers are running
lsof -i :8000 -i :3000

# View last 20 lines of logs
tail -n 20 backend.log frontend.log

# Clean everything and restart
rm -rf backend/venv frontend/node_modules frontend/.next backend/pharmabot.db && ./dev.sh

# Check Python/Node versions
python3 --version && node --version

# Test backend health
curl http://localhost:8000/health

# Test frontend
curl http://localhost:3000
```

---

## API Quick Test

```bash
# Register user
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test&password=test123"

# Health check
curl http://localhost:8000/health
```

---

## Directory Navigation

```bash
cd /Users/shagato/Desktop/PharmaBot/pharmabot_tech  # Project root
cd backend                                           # Backend
cd frontend                                          # Frontend
cd backend/app                                       # Backend code
cd frontend/src                                      # Frontend code
```

---

## Git Commands

```bash
git status                  # Check status
git add .                   # Stage all changes
git commit -m "message"     # Commit changes
git push                    # Push to remote
git pull                    # Pull from remote
```

---

## Quick Fixes

### Port Already in Use
```bash
lsof -ti:8000 | xargs kill -9  # Kill backend port
lsof -ti:3000 | xargs kill -9  # Kill frontend port
```

### Database Locked
```bash
cd backend
rm pharmabot.db
alembic upgrade head
```

### Module Not Found
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### TypeScript Errors
```bash
cd frontend
rm -rf .next node_modules
npm install
```

---

## Environment Variables

### Backend (.env)
```env
SECRET_KEY=<openssl rand -hex 32>
GEMINI_API_KEY=<your-key>
DATABASE_URL=sqlite:///./pharmabot.db
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Development Workflow

```bash
1. ./dev.sh                 # Start servers
2. # Make changes           # Edit code
3. # Test                   # Browser/Postman
4. tail -f *.log            # Check logs
5. Ctrl+C                   # Stop servers
```

---

**Bookmark this page for quick reference! 📖**
