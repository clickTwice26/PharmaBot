#!/bin/bash

echo "🚀 PharmaBot Setup Script"
echo "=========================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Python and Node.js are installed"
echo ""

# Backend setup
echo "📦 Setting up Backend..."
cd backend

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Please configure it with your API keys."
    echo "   See SETUP_GUIDE.md for instructions."
else
    echo "✅ .env file found"
fi

# Run migrations
echo "Running database migrations..."
alembic upgrade head

echo "✅ Backend setup complete!"
echo ""

# Frontend setup
echo "📦 Setting up Frontend..."
cd ../frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

echo "✅ Frontend setup complete!"
echo ""

# Final instructions
echo "🎉 Setup Complete!"
echo ""
echo "To start the application:"
echo ""
echo "1. Start the backend (in backend directory):"
echo "   source venv/bin/activate"
echo "   uvicorn app.main:app --reload"
echo ""
echo "2. Start the frontend (in frontend directory):"
echo "   npm run dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "⚠️  Don't forget to configure your .env file with:"
echo "   - SECRET_KEY (generate with: openssl rand -hex 32)"
echo "   - GEMINI_API_KEY (get from: https://makersuite.google.com/app/apikey)"
echo ""
