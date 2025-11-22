# 🐍 Python Development Script - dev.py

## Overview

`dev.py` is a **cross-platform Python script** that manages both frontend and backend development servers. It replaces the need for separate shell scripts for different operating systems.

## Why Python Script?

✅ **Cross-platform** - Works on macOS, Linux, and Windows  
✅ **No shell compatibility issues** - Pure Python  
✅ **Better error handling** - Detailed error messages  
✅ **Easier to maintain** - Single codebase  
✅ **More robust** - Proper process management  
✅ **Fixed Pillow issue** - Compatible with Python 3.13+  

## Installation Fixed

The script automatically handles the Pillow compatibility issue with Python 3.13 by:
- Upgrading pip before installing dependencies
- Using `Pillow>=10.1.0` instead of exact version
- Better error reporting if installation fails

## Usage

### Basic Usage
```bash
# From project root directory
python3 dev.py
```

That's it! The script will:
1. ✅ Check Python and Node.js versions
2. ✅ Create virtual environment if needed
3. ✅ Install all dependencies (with proper Pillow version)
4. ✅ Set up database
5. ✅ Generate SECRET_KEY
6. ✅ Start both servers
7. ✅ Show live status

### Stop Servers
Press `Ctrl+C` in the terminal running the script.

## Features

### 🔍 Smart Pre-flight Checks
- Verifies Python 3.9+ installed
- Verifies Node.js 18+ installed
- Checks directory structure
- Validates configuration files

### 📦 Automatic Dependency Management
- Creates Python virtual environment
- Upgrades pip to latest version
- Installs backend dependencies (fixes Pillow issue)
- Installs frontend dependencies
- No manual intervention needed

### 🗄️ Database Management
- Checks if database exists
- Runs Alembic migrations automatically
- Creates tables on first run

### 🔐 Configuration
- Validates `.env` file exists
- Auto-generates SECRET_KEY if missing
- Warns if GEMINI_API_KEY not configured

### ⚡ Port Management
- Checks if ports 3000 and 8000 are free
- Automatically kills conflicting processes
- Clean port management

### 🚀 Server Startup
- Starts backend with uvicorn
- Starts frontend with npm
- Waits for health checks
- Confirms servers are ready

### 📊 Logging
- Saves backend logs to `backend.log`
- Saves frontend logs to `frontend.log`
- Real-time status updates in terminal
- Colored output for readability

### 🛑 Clean Shutdown
- Graceful shutdown with Ctrl+C
- Terminates all child processes
- Frees up ports
- Cleanup confirmation

## Requirements

- Python 3.9 or higher (tested with Python 3.13)
- Node.js 18 or higher
- No additional Python packages needed (uses standard library)

## What Gets Installed

### Backend Dependencies
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
Pillow>=10.1.0  ← Fixed for Python 3.13 compatibility
```

### Frontend Dependencies
```
next, react, react-dom, axios, typescript, tailwindcss, etc.
(from package.json)
```

## Troubleshooting

### Script won't run
```bash
# Make sure you're in the project root
cd /Users/shagato/Desktop/PharmaBot/pharmabot_tech

# Make script executable
chmod +x dev.py

# Run with python3
python3 dev.py
```

### Pillow installation fails
The script now handles this automatically by:
- Using flexible Pillow version (`>=10.1.0`)
- Upgrading pip before installation
- Better error messages

If it still fails, try:
```bash
# Update pip manually
python3 -m pip install --upgrade pip

# Then run the script
python3 dev.py
```

### Port already in use
The script automatically kills processes on ports 3000 and 8000.

If that fails, manually kill:
```bash
# macOS/Linux
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
taskkill /PID <pid> /F
```

### Database issues
```bash
# Delete database and let script recreate it
rm backend/pharmabot.db
python3 dev.py
```

### Virtual environment issues
```bash
# Delete venv and let script recreate it
rm -rf backend/venv
python3 dev.py
```

## Command-Line Options (Future Enhancement)

Future versions could support:
```bash
python3 dev.py --backend-only    # Start only backend
python3 dev.py --frontend-only   # Start only frontend
python3 dev.py --no-install      # Skip dependency check
python3 dev.py --port 8080       # Use custom port
python3 dev.py --debug           # Verbose output
```

## Comparison: Shell vs Python Script

| Feature | Shell Script | Python Script |
|---------|--------------|---------------|
| Cross-platform | ❌ Separate files | ✅ Single file |
| Error handling | Basic | Advanced |
| Process management | Limited | Robust |
| Pillow fix | ❌ | ✅ |
| Readability | Medium | High |
| Maintainability | Medium | High |
| Exit handling | Basic | Proper cleanup |

## Script Architecture

```python
PharmaBot (main class)
├── Check prerequisites
│   ├── check_directories()
│   ├── check_python()
│   └── check_node()
├── Setup backend
│   ├── setup_backend_venv()
│   ├── install_backend_deps()  ← Fixes Pillow issue
│   └── setup_database()
├── Setup frontend
│   └── install_frontend_deps()
├── Configuration
│   └── check_env_file()
├── Port management
│   └── free_ports()
├── Start servers
│   ├── start_backend()
│   └── start_frontend()
└── Process management
    ├── ProcessManager.add_process()
    └── ProcessManager.cleanup()
```

## Example Output

```
ℹ️  🚀 Starting PharmaBot Development Servers...

✅ Python 3.13.0 found
✅ Node.js 18.17.0 found
⚠️  Backend virtual environment not found. Creating one...
✅ Virtual environment created
⚠️  Backend dependencies not found. Installing...
ℹ️  This may take a few minutes...
ℹ️  Upgrading pip...
ℹ️  Installing dependencies...
✅ Backend dependencies installed
✅ Frontend dependencies found
⚠️  Database not found. Running migrations...
✅ Database created and migrations applied
⚠️  SECRET_KEY not configured. Generating...
✅ SECRET_KEY generated and saved

=============================================
✅ Starting Backend Server (FastAPI)...
=============================================

ℹ️  Waiting for backend to start...
✅ Backend is ready at http://localhost:8000
ℹ️  API Docs available at http://localhost:8000/docs

=============================================
✅ Starting Frontend Server (Next.js)...
=============================================

ℹ️  Waiting for frontend to start...
✅ Frontend is ready at http://localhost:3000

=============================================
✅ 🎉 Both servers are running!
=============================================

ℹ️  Frontend: http://localhost:3000
ℹ️  Backend:  http://localhost:8000
ℹ️  API Docs: http://localhost:8000/docs

ℹ️  Logs:
ℹ️    Backend:  tail -f backend.log
ℹ️    Frontend: tail -f frontend.log

⚠️  Press Ctrl+C to stop both servers
```

## Best Practices

1. **Always use from project root**
   ```bash
   cd /path/to/pharmabot_tech
   python3 dev.py
   ```

2. **Check logs if issues occur**
   ```bash
   tail -f backend.log
   tail -f frontend.log
   ```

3. **Clean shutdown**
   - Always use Ctrl+C to stop
   - Don't force kill the terminal

4. **Update dependencies**
   ```bash
   # If you update requirements.txt or package.json
   rm -rf backend/venv frontend/node_modules
   python3 dev.py
   ```

## Contributing

To improve the script:
1. Edit `dev.py`
2. Test on your platform
3. Ensure cross-platform compatibility
4. Update this documentation

## Support

- **Script issues**: Check the troubleshooting section
- **Pillow errors**: Script now handles Python 3.13 automatically
- **Port conflicts**: Script auto-kills conflicting processes
- **General issues**: Check `backend.log` and `frontend.log`

---

**Recommended**: Use `python3 dev.py` for the best cross-platform experience! 🚀
