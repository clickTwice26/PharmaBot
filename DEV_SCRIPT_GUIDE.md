# Development Script Guide

## Overview

The `dev.sh` (macOS/Linux) and `dev.bat` (Windows) scripts provide a robust, automated way to run both the frontend and backend in development mode.

---

## Features

### 🔍 Pre-flight Checks
- ✅ Verifies Python 3.9+ is installed
- ✅ Verifies Node.js 18+ is installed
- ✅ Checks for correct directory structure
- ✅ Validates configuration files exist

### 📦 Automatic Setup
- ✅ Creates Python virtual environment if missing
- ✅ Installs backend dependencies automatically
- ✅ Installs frontend dependencies automatically
- ✅ Runs database migrations if needed
- ✅ Generates SECRET_KEY if not configured

### 🚀 Server Management
- ✅ Starts both servers concurrently
- ✅ Waits for servers to be ready
- ✅ Health checks before reporting success
- ✅ Handles port conflicts automatically

### 📊 Monitoring & Logs
- ✅ Real-time log tailing from both servers
- ✅ Saves logs to `backend.log` and `frontend.log`
- ✅ Colored output for better readability
- ✅ Clear status messages

### 🛑 Clean Shutdown
- ✅ Graceful shutdown on Ctrl+C
- ✅ Kills all child processes
- ✅ Frees up ports 3000 and 8000
- ✅ Cleanup confirmation

---

## Usage

### macOS/Linux

```bash
# Navigate to project directory
cd /Users/shagato/Desktop/PharmaBot/pharmabot_tech

# Run the script
./dev.sh

# Stop with Ctrl+C
```

### Windows

```cmd
# Navigate to project directory
cd C:\path\to\pharmabot_tech

# Run the script
dev.bat

# Stop by pressing any key
```

---

## What the Script Does

### 1. Initial Checks (5-10 seconds)
```
✅ Checking if Python is installed
✅ Checking if Node.js is installed
✅ Checking project structure
✅ Checking configuration files
```

### 2. Dependency Management (0-60 seconds, first run only)
```
✅ Creating virtual environment (if needed)
✅ Installing backend dependencies (if needed)
✅ Installing frontend dependencies (if needed)
✅ Setting up database (if needed)
```

### 3. Configuration (2-3 seconds)
```
✅ Checking backend .env file
✅ Generating SECRET_KEY (if needed)
✅ Validating GEMINI_API_KEY configuration
```

### 4. Port Management (2-3 seconds)
```
✅ Checking if port 8000 is available
✅ Checking if port 3000 is available
✅ Killing conflicting processes if needed
```

### 5. Server Startup (10-15 seconds)
```
✅ Starting backend server
✅ Waiting for backend health check
✅ Starting frontend server
✅ Waiting for frontend to be ready
```

### 6. Running State
```
✅ Both servers running
✅ Live log output
✅ Ready to develop!
```

---

## Log Files

The script creates two log files in the root directory:

### `backend.log`
Contains all backend output:
- FastAPI startup messages
- API requests
- Database queries
- Errors and warnings

**View in real-time:**
```bash
tail -f backend.log
```

### `frontend.log`
Contains all frontend output:
- Next.js compilation
- Page requests
- Build errors
- Hot reload messages

**View in real-time:**
```bash
tail -f frontend.log
```

---

## Troubleshooting

### Script won't start

**Issue:** Permission denied
```bash
# Solution (macOS/Linux)
chmod +x dev.sh
```

**Issue:** Python not found
```bash
# Install Python 3.9+
brew install python@3.11  # macOS
```

**Issue:** Node.js not found
```bash
# Install Node.js 18+
brew install node  # macOS
```

### Backend fails to start

**Check the log:**
```bash
tail -n 50 backend.log
```

**Common issues:**
- Missing SECRET_KEY → Script auto-generates
- Missing GEMINI_API_KEY → Add to backend/.env
- Port 8000 in use → Script auto-kills process
- Database error → Delete pharmabot.db and restart

### Frontend fails to start

**Check the log:**
```bash
tail -n 50 frontend.log
```

**Common issues:**
- Missing node_modules → Script auto-installs
- Port 3000 in use → Script auto-kills process
- TypeScript errors → Check file syntax
- Build errors → Check component imports

### Servers start but don't respond

**Health check failed:**
```bash
# Check if servers are running
lsof -i :8000  # Backend
lsof -i :3000  # Frontend

# Manual health checks
curl http://localhost:8000/health
curl http://localhost:3000
```

### Can't stop servers

**Force kill:**
```bash
# Kill backend
lsof -ti:8000 | xargs kill -9

# Kill frontend  
lsof -ti:3000 | xargs kill -9
```

---

## Advanced Usage

### Custom Port Configuration

Edit the script to use different ports:

```bash
# In dev.sh, change:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8080  # Backend
# Frontend uses port from package.json
```

### Disable Auto-install

Comment out dependency installation:

```bash
# In dev.sh, comment out:
# if [ ! -d "backend/venv" ]; then
#     ... installation code ...
# fi
```

### Run Only Backend

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### Run Only Frontend

```bash
cd frontend
npm run dev
```

### Background Mode

Run servers in the background:

```bash
# Start
./dev.sh &

# Stop
jobs -p | xargs kill
```

---

## Script Output Explained

### Color Codes

- 🔵 **Blue** - Information messages
- 🟢 **Green** - Success messages
- 🟡 **Yellow** - Warning messages
- 🔴 **Red** - Error messages

### Sample Output

```
ℹ️  🚀 Starting PharmaBot Development Servers...

✅ Python 3.11.0 found
✅ Node.js 18.17.0 found
⚠️  Backend dependencies not found. Installing...
✅ Backend dependencies installed
✅ Database found
⚠️  SECRET_KEY not configured in backend/.env
✅ SECRET_KEY generated and saved

=========================================
✅ Starting Backend Server (FastAPI)...
=========================================

ℹ️  Waiting for backend to start...
✅ Backend is ready at http://localhost:8000
ℹ️  API Docs available at http://localhost:8000/docs

=========================================
✅ Starting Frontend Server (Next.js)...
=========================================

ℹ️  Waiting for frontend to start...
✅ Frontend is ready at http://localhost:3000

=========================================
✅ 🎉 Both servers are running!
=========================================

ℹ️  Frontend: http://localhost:3000
ℹ️  Backend:  http://localhost:8000
ℹ️  API Docs: http://localhost:8000/docs

ℹ️  Logs:
ℹ️    Backend:  tail -f backend.log
ℹ️    Frontend: tail -f frontend.log

⚠️  Press Ctrl+C to stop both servers
```

---

## Environment Variables

The script checks and uses these environment variables:

### Required
- `SECRET_KEY` - Generated automatically if missing
- `DATABASE_URL` - Default: `sqlite:///./pharmabot.db`

### Optional
- `GEMINI_API_KEY` - Shows warning if missing
- `FRONTEND_URL` - Default: `http://localhost:3000`

---

## Best Practices

### Development Workflow

1. **Start servers**: `./dev.sh`
2. **Make changes**: Edit code files
3. **Auto-reload**: Changes detected automatically
4. **View logs**: Check terminal or log files
5. **Stop servers**: Press Ctrl+C

### Before Committing

```bash
# Stop dev servers
Ctrl+C

# Run tests (if available)
cd backend && pytest
cd frontend && npm test

# Check for errors
tail backend.log frontend.log
```

### Daily Development

```bash
# Morning: Start servers
./dev.sh

# Work on features
# Backend auto-reloads on Python changes
# Frontend hot-reloads on JS/TS changes

# Evening: Stop servers
Ctrl+C
```

---

## Comparison: Manual vs Script

| Task | Manual | Script |
|------|--------|--------|
| Check dependencies | 2 terminals | Automatic |
| Install missing deps | Manual install | Auto-installs |
| Create venv | `python -m venv` | Automatic |
| Activate venv | `source venv/bin/activate` | Automatic |
| Run migrations | `alembic upgrade head` | Automatic |
| Generate SECRET_KEY | Manual | Automatic |
| Start backend | `uvicorn ...` | Automatic |
| Start frontend | `npm run dev` | Automatic |
| Monitor logs | Multiple terminals | Single view |
| Stop servers | Kill each | Ctrl+C once |
| Clean ports | Manual lsof/kill | Automatic |

**Time saved:** ~5-10 minutes per session

---

## Script Maintenance

### Update Dependencies

The script automatically installs new dependencies when:
- `requirements.txt` changes (backend)
- `package.json` changes (frontend)

Force reinstall:
```bash
rm -rf backend/venv frontend/node_modules
./dev.sh
```

### Update Script

To get the latest version:
```bash
# If script is in git
git pull origin main

# Or download manually
# Replace dev.sh with new version
```

---

## FAQ

**Q: Can I run the script multiple times?**  
A: No, it will detect ports in use and clean them up.

**Q: Does the script work on M1/M2 Macs?**  
A: Yes, it's compatible with Apple Silicon.

**Q: Can I customize the script?**  
A: Yes, it's a regular bash/batch script. Edit as needed.

**Q: Does it work in Docker?**  
A: The script is for local development. Use docker-compose for containers.

**Q: Can I run it in the background?**  
A: Yes: `./dev.sh &` but logs won't be visible.

**Q: How do I update Python/Node versions?**  
A: Install new versions, delete venv/node_modules, run script.

---

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review log files: `backend.log`, `frontend.log`
3. Check script output for error messages
4. Verify environment configuration
5. Try manual setup to isolate the issue

---

**Happy Developing! 🚀**
