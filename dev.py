#!/usr/bin/env python3
"""
PharmaBot Development Server Launcher
Starts frontend and/or backend in development mode
"""

import argparse
import os
import platform
import subprocess
import sys
import time
import signal
import shutil
from pathlib import Path
from typing import Optional, List

# ANSI color codes
class Colors:
    BLUE = '\033[0;34m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    RED = '\033[0;31m'
    NC = '\033[0m'  # No Color

def print_info(msg: str):
    print(f"{Colors.BLUE}ℹ️  {msg}{Colors.NC}")

def print_success(msg: str):
    print(f"{Colors.GREEN}✅ {msg}{Colors.NC}")

def print_warning(msg: str):
    print(f"{Colors.YELLOW}⚠️  {msg}{Colors.NC}")

def print_error(msg: str):
    print(f"{Colors.RED}❌ {msg}{Colors.NC}")

class DevServer:
    def __init__(self):
        self.root_dir = Path(__file__).parent
        self.backend_dir = self.root_dir / "backend"
        self.frontend_dir = self.root_dir / "frontend"
        self.venv_dir = self.backend_dir / "venv"
        self.processes: List[subprocess.Popen] = []
        self.is_windows = platform.system() == "Windows"
        
        # Set up signal handlers
        signal.signal(signal.SIGINT, self.cleanup)
        signal.signal(signal.SIGTERM, self.cleanup)
    
    def cleanup(self, signum=None, frame=None):
        """Clean up processes on exit"""
        print()
        print_warning("Shutting down servers...")
        
        # Kill all child processes
        for proc in self.processes:
            try:
                if self.is_windows:
                    proc.terminate()
                else:
                    proc.send_signal(signal.SIGTERM)
                proc.wait(timeout=5)
            except:
                try:
                    proc.kill()
                except:
                    pass
        
        # Kill processes on ports
        self.kill_port(8000)
        self.kill_port(3000)
        
        print_info("Cleanup complete")
        sys.exit(0)
    
    def kill_port(self, port: int):
        """Kill process on given port"""
        try:
            if self.is_windows:
                subprocess.run(
                    f'FOR /F "tokens=5" %P IN (\'netstat -a -n -o ^| findstr :{port}\') DO TaskKill.exe /PID %P /F',
                    shell=True,
                    capture_output=True
                )
            else:
                result = subprocess.run(
                    f"lsof -ti:{port}",
                    shell=True,
                    capture_output=True,
                    text=True
                )
                if result.stdout.strip():
                    pids = result.stdout.strip().split('\n')
                    for pid in pids:
                        try:
                            subprocess.run(["kill", "-9", pid], check=False)
                        except:
                            pass
        except:
            pass
    
    def check_python(self) -> bool:
        """Check if Python 3.9+ is installed"""
        try:
            result = subprocess.run(
                [sys.executable, "--version"],
                capture_output=True,
                text=True
            )
            version = result.stdout.strip()
            print_success(f"Python {version.split()[1]} found")
            
            # Check version
            version_parts = version.split()[1].split('.')
            major, minor = int(version_parts[0]), int(version_parts[1])
            if major < 3 or (major == 3 and minor < 9):
                print_error("Python 3.9 or higher is required")
                return False
            return True
        except:
            print_error("Python is not installed")
            return False
    
    def check_node(self) -> bool:
        """Check if Node.js is installed"""
        try:
            result = subprocess.run(
                ["node", "--version"],
                capture_output=True,
                text=True
            )
            version = result.stdout.strip()
            print_success(f"Node.js {version} found")
            return True
        except:
            print_error("Node.js is not installed")
            return False
    
    def create_venv(self) -> bool:
        """Create Python virtual environment"""
        print_warning("Backend virtual environment not found. Creating one...")
        try:
            subprocess.run(
                [sys.executable, "-m", "venv", str(self.venv_dir)],
                check=True,
                cwd=self.backend_dir
            )
            print_success("Virtual environment created")
            return True
        except subprocess.CalledProcessError as e:
            print_error(f"Failed to create virtual environment: {e}")
            return False
    
    def get_pip_path(self) -> str:
        """Get pip executable path"""
        if self.is_windows:
            return str(self.venv_dir / "Scripts" / "pip.exe")
        return str(self.venv_dir / "bin" / "pip")
    
    def get_python_path(self) -> str:
        """Get Python executable path in venv"""
        if self.is_windows:
            return str(self.venv_dir / "Scripts" / "python.exe")
        return str(self.venv_dir / "bin" / "python")
    
    def get_uvicorn_path(self) -> str:
        """Get uvicorn executable path"""
        if self.is_windows:
            return str(self.venv_dir / "Scripts" / "uvicorn.exe")
        return str(self.venv_dir / "bin" / "uvicorn")
    
    def install_backend_deps(self) -> bool:
        """Install backend dependencies"""
        if not self.venv_dir.exists():
            if not self.create_venv():
                return False
        
        pip_path = self.get_pip_path()
        
        if not Path(pip_path).exists():
            print_error(f"Pip not found at {pip_path}")
            if not self.create_venv():
                return False
            pip_path = self.get_pip_path()
        
        print_warning("Backend dependencies not found. Installing...")
        print_info("This may take a few minutes...")
        
        try:
            # Upgrade pip
            print_info("Upgrading pip...")
            subprocess.run(
                [pip_path, "install", "--upgrade", "pip"],
                check=True,
                cwd=self.backend_dir,
                capture_output=True
            )
            
            # Install requirements
            print_info("Installing backend packages...")
            subprocess.run(
                [pip_path, "install", "-r", "requirements.txt"],
                check=True,
                cwd=self.backend_dir
            )
            print_success("Backend dependencies installed")
            return True
        except subprocess.CalledProcessError as e:
            print_error(f"Failed to install backend dependencies")
            if e.stderr:
                print(e.stderr.decode())
            return False
    
    def install_frontend_deps(self) -> bool:
        """Install frontend dependencies"""
        print_warning("Frontend dependencies not found. Installing...")
        print_info("This may take a few minutes...")
        try:
            subprocess.run(
                ["npm", "install"],
                check=True,
                cwd=self.frontend_dir
            )
            print_success("Frontend dependencies installed")
            return True
        except subprocess.CalledProcessError as e:
            print_error("Failed to install frontend dependencies")
            return False
    
    def check_backend_deps(self) -> bool:
        """Check if backend dependencies are installed"""
        uvicorn_path = self.get_uvicorn_path()
        return Path(uvicorn_path).exists()
    
    def check_frontend_deps(self) -> bool:
        """Check if frontend dependencies are installed"""
        return (self.frontend_dir / "node_modules").exists()
    
    def setup_database(self) -> bool:
        """Set up database with migrations"""
        db_file = self.backend_dir / "pharmabot.db"
        if db_file.exists():
            return True
        
        print_warning("Database not found. Running migrations...")
        try:
            python_path = self.get_python_path()
            alembic_path = self.venv_dir / "bin" / "alembic"
            if self.is_windows:
                alembic_path = self.venv_dir / "Scripts" / "alembic.exe"
            
            subprocess.run(
                [str(alembic_path), "upgrade", "head"],
                check=True,
                cwd=self.backend_dir
            )
            print_success("Database created and migrations applied")
            return True
        except subprocess.CalledProcessError:
            print_error("Failed to run database migrations")
            return False
    
    def check_env_file(self) -> bool:
        """Check and configure .env file"""
        env_file = self.backend_dir / ".env"
        if not env_file.exists():
            print_error("Backend .env file not found!")
            print_info("Please create backend/.env with required configuration")
            return False
        
        # Check and generate SECRET_KEY if needed
        env_content = env_file.read_text()
        if "your-secret-key-here" in env_content:
            print_warning("SECRET_KEY not configured in backend/.env")
            print_info("Generating a secure SECRET_KEY...")
            
            import secrets
            secret_key = secrets.token_hex(32)
            env_content = env_content.replace(
                "your-secret-key-here-change-in-production-min-32-characters",
                secret_key
            )
            env_file.write_text(env_content)
            print_success("SECRET_KEY generated and saved")
        
        # Check GEMINI_API_KEY
        if "your-gemini-api-key" in env_content:
            print_warning("GEMINI_API_KEY not configured in backend/.env")
            print_info("Please add your Gemini API key to backend/.env")
            print_info("Get it from: https://makersuite.google.com/app/apikey")
        
        return True
    
    def wait_for_server(self, url: str, timeout: int = 30) -> bool:
        """Wait for server to be ready"""
        import urllib.request
        import urllib.error
        
        for i in range(timeout):
            try:
                urllib.request.urlopen(url, timeout=1)
                return True
            except urllib.error.HTTPError:
                # HTTP error means server is responding (e.g., 404, 302)
                return True
            except (urllib.error.URLError, ConnectionError, OSError):
                if i < timeout - 1:
                    time.sleep(1)
        return False
    
    def start_backend(self) -> bool:
        """Start backend server"""
        print()
        print_info("=" * 40)
        print_success("Starting Backend Server (FastAPI)...")
        print_info("=" * 40)
        
        uvicorn_path = self.get_uvicorn_path()
        
        # Start backend
        log_file = self.root_dir / "backend.log"
        with open(log_file, "w") as f:
            proc = subprocess.Popen(
                [uvicorn_path, "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"],
                cwd=self.backend_dir,
                stdout=f,
                stderr=subprocess.STDOUT
            )
            self.processes.append(proc)
        
        # Wait for backend to start
        print_info("Waiting for backend to start...")
        if self.wait_for_server("http://localhost:8000/health"):
            print_success("Backend is ready at http://localhost:8000")
            print_info("API Docs available at http://localhost:8000/docs")
            return True
        else:
            print_error("Backend failed to start. Check backend.log for details")
            # Show last 20 lines of log
            with open(log_file) as f:
                lines = f.readlines()
                for line in lines[-20:]:
                    print(line.rstrip())
            return False
    
    def start_frontend(self) -> bool:
        """Start frontend server"""
        print()
        print_info("=" * 40)
        print_success("Starting Frontend Server (Next.js)...")
        print_info("=" * 40)
        
        # Start frontend
        log_file = self.root_dir / "frontend.log"
        with open(log_file, "w") as f:
            proc = subprocess.Popen(
                ["npm", "run", "dev"],
                cwd=self.frontend_dir,
                stdout=f,
                stderr=subprocess.STDOUT
            )
            self.processes.append(proc)
        
        # Wait for frontend to start
        print_info("Waiting for frontend to start...")
        if self.wait_for_server("http://localhost:3000", timeout=60):
            print_success("Frontend is ready at http://localhost:3000")
            return True
        else:
            print_error("Frontend failed to start. Check frontend.log for details")
            # Show last 20 lines of log
            with open(log_file) as f:
                lines = f.readlines()
                for line in lines[-20:]:
                    print(line.rstrip())
            return False
    
    def show_running_info(self, backend: bool = True, frontend: bool = True):
        """Show information about running servers"""
        print()
        print_info("=" * 40)
        print_success("🎉 Server(s) running!")
        print_info("=" * 40)
        print()
        
        if frontend:
            print_info("Frontend: http://localhost:3000")
        if backend:
            print_info("Backend:  http://localhost:8000")
            print_info("API Docs: http://localhost:8000/docs")
        
        print()
        print_info("Logs:")
        if backend:
            print_info("  Backend:  tail -f backend.log")
        if frontend:
            print_info("  Frontend: tail -f frontend.log")
        
        print()
        print_warning("Press Ctrl+C to stop server(s)")
        print()
    
    def tail_logs(self, backend: bool = True, frontend: bool = True):
        """Tail log files"""
        try:
            files = []
            if backend and (self.root_dir / "backend.log").exists():
                files.append(str(self.root_dir / "backend.log"))
            if frontend and (self.root_dir / "frontend.log").exists():
                files.append(str(self.root_dir / "frontend.log"))
            
            if files:
                if self.is_windows:
                    # Windows doesn't have tail, just wait
                    while True:
                        time.sleep(1)
                else:
                    subprocess.run(["tail", "-f"] + files)
        except KeyboardInterrupt:
            pass
    
    def run(self, start_backend: bool = True, start_frontend: bool = True):
        """Main run function"""
        print_info("🚀 Starting PharmaBot Development Servers...")
        print()
        
        # Check prerequisites
        if not self.check_python():
            return False
        
        if start_frontend and not self.check_node():
            return False
        
        # Check directories
        if not self.backend_dir.exists() or not self.frontend_dir.exists():
            print_error("Error: frontend or backend directory not found!")
            print_info("Please run this script from the pharmabot_tech directory")
            return False
        
        # Setup backend
        if start_backend:
            # Check and install backend dependencies
            if not self.check_backend_deps():
                if not self.install_backend_deps():
                    return False
            else:
                print_success("Backend dependencies found")
            
            # Check database
            if not self.setup_database():
                return False
            
            # Check env file
            if not self.check_env_file():
                return False
        
        # Setup frontend
        if start_frontend:
            # Check and install frontend dependencies
            if not self.check_frontend_deps():
                if not self.install_frontend_deps():
                    return False
            else:
                print_success("Frontend dependencies found")
        
        # Kill any existing processes on ports
        if start_backend:
            self.kill_port(8000)
        if start_frontend:
            self.kill_port(3000)
        
        # Start servers
        if start_backend:
            if not self.start_backend():
                self.cleanup()
                return False
        
        if start_frontend:
            if not self.start_frontend():
                self.cleanup()
                return False
        
        # Show info and tail logs
        self.show_running_info(backend=start_backend, frontend=start_frontend)
        self.tail_logs(backend=start_backend, frontend=start_frontend)
        
        return True

def main():
    parser = argparse.ArgumentParser(
        description='PharmaBot Development Server Launcher',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 dev.py                    # Start both backend and frontend
  python3 dev.py --backend-only     # Start only backend
  python3 dev.py --frontend-only    # Start only frontend
  python3 dev.py -b                 # Short form for backend only
  python3 dev.py -f                 # Short form for frontend only
        """
    )
    
    group = parser.add_mutually_exclusive_group()
    group.add_argument(
        '--backend-only', '-b',
        action='store_true',
        help='Start only the backend server'
    )
    group.add_argument(
        '--frontend-only', '-f',
        action='store_true',
        help='Start only the frontend server'
    )
    
    args = parser.parse_args()
    
    # Determine what to start
    start_backend = not args.frontend_only
    start_frontend = not args.backend_only
    
    app = DevServer()
    try:
        success = app.run(start_backend=start_backend, start_frontend=start_frontend)
        if not success:
            sys.exit(1)
    except KeyboardInterrupt:
        app.cleanup()
    except Exception as e:
        print_error(f"Unexpected error: {e}")
        app.cleanup()
        sys.exit(1)

if __name__ == "__main__":
    main()
