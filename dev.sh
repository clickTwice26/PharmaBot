#!/bin/bash

# PharmaBot Development Server Launcher
# This script starts both frontend and backend in development mode

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to cleanup on exit
cleanup() {
    print_warning "Shutting down servers..."
    
    # Kill all child processes
    jobs -p | xargs -r kill 2>/dev/null || true
    
    # Kill processes on specific ports
    lsof -ti:8000 | xargs -r kill -9 2>/dev/null || true
    lsof -ti:3000 | xargs -r kill -9 2>/dev/null || true
    
    print_info "Cleanup complete"
    exit 0
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    print_error "Error: frontend or backend directory not found!"
    print_info "Please run this script from the pharmabot_tech directory"
    exit 1
fi

print_info "🚀 Starting PharmaBot Development Servers..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check if backend virtual environment exists
if [ ! -d "backend/venv" ]; then
    print_warning "Backend virtual environment not found. Creating one..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    print_info "Installing backend dependencies..."
    pip install -r requirements.txt
    cd ..
    print_success "Virtual environment created and dependencies installed"
fi

# Check if backend dependencies are installed
if [ ! -f "backend/venv/bin/uvicorn" ]; then
    print_warning "Backend dependencies not found. Installing..."
    cd backend
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
    print_success "Backend dependencies installed"
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    print_warning "Frontend dependencies not found. Installing..."
    cd frontend
    npm install
    cd ..
    print_success "Frontend dependencies installed"
fi

# Check if database exists
if [ ! -f "backend/pharmabot.db" ]; then
    print_warning "Database not found. Running migrations..."
    cd backend
    source venv/bin/activate
    alembic upgrade head
    cd ..
    print_success "Database created and migrations applied"
fi

# Check backend .env file
if [ ! -f "backend/.env" ]; then
    print_error "Backend .env file not found!"
    print_info "Please create backend/.env with required configuration"
    exit 1
fi

# Check if SECRET_KEY is configured
if grep -q "your-secret-key-here" backend/.env 2>/dev/null; then
    print_warning "SECRET_KEY not configured in backend/.env"
    print_info "Generating a secure SECRET_KEY..."
    SECRET_KEY=$(openssl rand -hex 32)
    sed -i.bak "s/your-secret-key-here.*/$SECRET_KEY/" backend/.env
    print_success "SECRET_KEY generated and saved"
fi

# Check if GEMINI_API_KEY is configured
if grep -q "your-gemini-api-key" backend/.env 2>/dev/null; then
    print_warning "GEMINI_API_KEY not configured in backend/.env"
    print_info "Please add your Gemini API key to backend/.env"
    print_info "Get it from: https://makersuite.google.com/app/apikey"
fi

# Check if ports are available
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_error "Port 8000 is already in use!"
    print_info "Killing process on port 8000..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_error "Port 3000 is already in use!"
    print_info "Killing process on port 3000..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

echo ""
print_info "========================================="
print_success "Starting Backend Server (FastAPI)..."
print_info "========================================="

# Start backend in background
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
print_info "Waiting for backend to start..."
for i in {1..30}; do
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        print_success "Backend is ready at http://localhost:8000"
        print_info "API Docs available at http://localhost:8000/docs"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Backend failed to start. Check backend.log for details"
        tail -n 20 backend.log
        cleanup
    fi
    sleep 1
done

echo ""
print_info "========================================="
print_success "Starting Frontend Server (Next.js)..."
print_info "========================================="

# Start frontend in background
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
print_info "Waiting for frontend to start..."
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend is ready at http://localhost:3000"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Frontend failed to start. Check frontend.log for details"
        tail -n 20 frontend.log
        cleanup
    fi
    sleep 1
done

echo ""
print_info "========================================="
print_success "🎉 Both servers are running!"
print_info "========================================="
echo ""
print_info "Frontend: http://localhost:3000"
print_info "Backend:  http://localhost:8000"
print_info "API Docs: http://localhost:8000/docs"
echo ""
print_info "Logs:"
print_info "  Backend:  tail -f backend.log"
print_info "  Frontend: tail -f frontend.log"
echo ""
print_warning "Press Ctrl+C to stop both servers"
echo ""

# Keep script running and show logs
tail -f backend.log frontend.log &
TAIL_PID=$!

# Wait for user interrupt
wait $BACKEND_PID $FRONTEND_PID
