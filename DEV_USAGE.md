# 🚀 PharmaBot Dev Script - Quick Guide

## Usage

### Start Both Servers (Default)
```bash
python3 dev.py
```

### Start Backend Only
```bash
python3 dev.py --backend-only
# or
python3 dev.py -b
```

### Start Frontend Only
```bash
python3 dev.py --frontend-only
# or
python3 dev.py -f
```

---

## What It Does

### ✅ Automatic Setup
- Creates Python virtual environment if needed
- Installs backend dependencies (pip)
- Installs frontend dependencies (npm)
- Runs database migrations
- Generates SECRET_KEY if missing

### ✅ Smart Management
- Kills conflicting processes on ports 3000 & 8000
- Health checks servers before confirming ready
- Colored output for easy reading
- Saves logs to backend.log and frontend.log

### ✅ Clean Shutdown
- Press Ctrl+C to stop
- Gracefully terminates all processes
- Cleans up ports

---

## Examples

```bash
# Full stack development
python3 dev.py

# Backend API development only
python3 dev.py -b

# Frontend UI development only
python3 dev.py -f

# Stop servers
Ctrl+C
```

---

## URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

---

## Logs

```bash
# View backend logs
tail -f backend.log

# View frontend logs
tail -f frontend.log

# View both
tail -f backend.log frontend.log
```

---

## Troubleshooting

### Port already in use
```bash
# Kill backend port
lsof -ti:8000 | xargs kill -9

# Kill frontend port
lsof -ti:3000 | xargs kill -9
```

### Reset everything
```bash
# Remove virtual environment and dependencies
rm -rf backend/venv frontend/node_modules

# Remove database
rm backend/pharmabot.db

# Start fresh
python3 dev.py
```

### Dependencies not installing
```bash
# Upgrade pip manually
cd backend
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

---

## Features

✅ **Cross-platform** - Works on macOS, Linux, Windows  
✅ **Smart dependency management** - Auto-installs missing packages  
✅ **Port conflict resolution** - Automatically kills conflicting processes  
✅ **Health checks** - Waits for servers to be ready  
✅ **Separate or combined** - Run backend, frontend, or both  
✅ **Color-coded output** - Easy to read status messages  
✅ **Log files** - All output saved for debugging  
✅ **Graceful shutdown** - Clean exit with Ctrl+C  

---

## Requirements

- Python 3.9+
- Node.js 18+
- pip (comes with Python)
- npm (comes with Node.js)

---

**Happy Coding! 🎉**
