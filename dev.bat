@echo off
REM PharmaBot Development Server Launcher (Windows)
REM This script starts both frontend and backend in development mode

setlocal enabledelayedexpansion

echo ========================================
echo   PharmaBot Development Servers
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "frontend" (
    echo ERROR: frontend directory not found!
    echo Please run this script from the pharmabot_tech directory
    exit /b 1
)

if not exist "backend" (
    echo ERROR: backend directory not found!
    echo Please run this script from the pharmabot_tech directory
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed!
    echo Please install Python 3.9 or higher
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 18 or higher
    exit /b 1
)

REM Check backend virtual environment
if not exist "backend\venv" (
    echo Creating Python virtual environment...
    cd backend
    python -m venv venv
    call venv\Scripts\activate
    echo Installing backend dependencies...
    pip install -r requirements.txt
    cd ..
    echo Virtual environment created!
)

REM Check backend dependencies
if not exist "backend\venv\Scripts\uvicorn.exe" (
    echo Installing backend dependencies...
    cd backend
    call venv\Scripts\activate
    pip install -r requirements.txt
    cd ..
    echo Backend dependencies installed!
)

REM Check frontend dependencies
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    echo Frontend dependencies installed!
)

REM Check database
if not exist "backend\pharmabot.db" (
    echo Creating database...
    cd backend
    call venv\Scripts\activate
    alembic upgrade head
    cd ..
    echo Database created!
)

REM Check .env file
if not exist "backend\.env" (
    echo ERROR: backend\.env file not found!
    echo Please create it with required configuration
    exit /b 1
)

echo.
echo ========================================
echo   Starting Backend Server (FastAPI)
echo ========================================
echo.

REM Start backend
cd backend
start "PharmaBot Backend" /min cmd /c "call venv\Scripts\activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
cd ..

REM Wait for backend to start
echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   Starting Frontend Server (Next.js)
echo ========================================
echo.

REM Start frontend
cd frontend
start "PharmaBot Frontend" /min cmd /c "npm run dev"
cd ..

REM Wait for frontend to start
echo Waiting for frontend to start...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   Both servers are running!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Press any key to stop both servers...
pause >nul

REM Kill processes
taskkill /FI "WINDOWTITLE eq PharmaBot Backend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq PharmaBot Frontend*" /F >nul 2>&1

echo.
echo Servers stopped.
