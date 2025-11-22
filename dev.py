#!/usr/bin/env python3
"""
PharmaBot Development Server Launcher
This script starts both frontend and backend in development mode
"""

import os
import sys
import subprocess
import time
import signal
import platform
import shutil
from pathlib import Path
from typing import Optional, List

# Color codes for terminal output
class Colors:
    BLUE = '\033[0;34m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    RED = '\033[0;31m'
    NC = '\033[0m'  # No Color

class Logger:
    @staticmethod
    def info(message: str):
        print(f"{Colors.BLUE}ℹ️  {message}{Colors.NC}")
    
    @staticmethod
    def success(message: str):
        print(f"{Colors.GREEN}✅ {message}{Colors.NC}")
    
    @staticmethod
    def warning(message: str):
        print(f"{Colors.YELLOW}⚠️  {message}{Colors.NC}")
    
    @staticmethod
    def error(message: str):
        print(f"{Colors.RED}❌ {message}{Colors.NC}")

class ProcessManager:
    def __init__(self):
        self.processes: List[subprocess.Popen] = []
    
    def add_process(self, process: subprocess.Popen):
        self.processes.append(process)
    
    def cleanup(self):
        Logger.warning("Shutting down servers...")
        
        # Terminate all processes
        for process in self.processes:
            try:
                process.terminate()
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
            except Exception:
                pass
        
        # Kill processes on specific ports
        self._kill_port(8000)
        self._kill_port(3000)
        
        Logger.info("Cleanup complete")
    
    @staticmethod
    def _kill_port(port: int):
        """Kill process running on specified port"""
        try:
            if platform.system() == "Windows":
                subprocess.run(
                    f'netstat -ano | findstr :{port}',
                    shell=True,
                    capture_output=True
                )
            else:
                result = subprocess.run(
                    f'lsof -ti:{port}',
                    shell=True,
                    capture_output=True,
                    text=True
                )
                if result.stdout.strip():
                    pids = result.stdout.strip().split('\n')
                    for pid in pids:
                        try:
                            subprocess.run(f'kill -9 {pid}', shell=True)
                        except Exception:
                            pass
        except Exception:
            pass

class PharmaBot:
    def __init__(self):
        self.root_dir = Path.cwd()
        self.backend_dir = self.root_dir / "backend"
        self.frontend_dir = self.root_dir / "frontend"
        self.process_manager = ProcessManager()
        
        # Setup signal handlers
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
    
    def _signal_handler(self, signum, frame):
        """Handle Ctrl+C and SIGTERM"""
        print("\n")
        self.process_manager.cleanup()
        sys.exit(0)
    
    def check_directories(self) -> bool:
        """Check if required directories exist"""
        if not self.backend_dir.exists():
            Logger.error("Backend directory not found!")
            Logger.info("Please run this script from the pharmabot_tech directory")
            return False
        
        if not self.frontend_dir.exists():
            Logger.error("Frontend directory not found!")
            Logger.info("Please run this script from the pharmabot_tech directory")
            return False
        
        return True
    
    def check_python(self) -> bool:
        """Check if Python is installed"""
        if not shutil.which("python3") and not shutil.which("python"):
            Logger.error("Python 3 is not installed!")
            Logger.info("Please install Python 3.9 or higher")
            return False
        
        try:
            result = subprocess.run(
                [sys.executable, "--version"],
                capture_output=True,
                text=True
            )
            Logger.success(f"Python {result.stdout.strip().split()[1]} found")
            return True
        except Exception:
            return False
    
    def check_node(self) -> bool:
        """Check if Node.js is installed"""
        if not shutil.which("node"):
            Logger.error("Node.js is not installed!")
            Logger.info("Please install Node.js 18 or higher")
            return False
        
        try:
            result = subprocess.run(
                ["node", "--version"],
                capture_output=True,
                text=True
            )
            Logger.success(f"Node.js {result.stdout.strip()} found")
            return True
        except Exception:
            return False
    
    def setup_backend_venv(self) -> bool:
        """Setup Python virtual environment"""
        venv_dir = self.backend_dir / "venv"
        
        if not venv_dir.exists():
            Logger.warning("Backend virtual environment not found. Creating one...")
            try:
                subprocess.run(
                    [sys.executable, "-m", "venv", str(venv_dir)],
                    check=True
                )
                Logger.success("Virtual environment created")
            except Exception as e:
                Logger.error(f"Failed to create virtual environment: {e}")
                return False
        
        return True
    
    def get_pip_executable(self) -> str:
        """Get pip executable path"""
        if platform.system() == "Windows":
            return str(self.backend_dir / "venv" / "Scripts" / "pip.exe")
        else:
            return str(self.backend_dir / "venv" / "bin" / "pip")
    
    def get_python_executable(self) -> str:
        """Get Python executable path from venv"""
        if platform.system() == "Windows":
            return str(self.backend_dir / "venv" / "Scripts" / "python.exe")
        else:
            return str(self.backend_dir / "venv" / "bin" / "python")
    
    def install_backend_deps(self) -> bool:
        """Install backend dependencies"""
        uvicorn_path = self.backend_dir / "venv" / ("Scripts" if platform.system() == "Windows" else "bin") / "uvicorn"
        
        if not uvicorn_path.exists():
            Logger.warning("Backend dependencies not found. Installing...")
            Logger.info("This may take a few minutes...")
            
            try:
                pip_cmd = self.get_pip_executable()
                requirements = self.backend_dir / "requirements.txt"
                
                # Upgrade pip first
                Logger.info("Upgrading pip...")
                subprocess.run(
                    [pip_cmd, "install", "--upgrade", "pip"],
                    cwd=self.backend_dir,
                    check=True,
                    capture_output=True
                )
                
                # Install dependencies
                Logger.info("Installing dependencies...")
                subprocess.run(
                    [pip_cmd, "install", "-r", str(requirements)],
                    cwd=self.backend_dir,
                    check=True
                )
                Logger.success("Backend dependencies installed")
                return True
            except subprocess.CalledProcessError as e:
                Logger.error(f"Failed to install backend dependencies")
                Logger.error(f"Error: {e}")
                return False
        
        Logger.success("Backend dependencies found")
        return True
    
    def install_frontend_deps(self) -> bool:
        """Install frontend dependencies"""
        node_modules = self.frontend_dir / "node_modules"
        
        if not node_modules.exists():
            Logger.warning("Frontend dependencies not found. Installing...")
            Logger.info("This may take a few minutes...")
            
            try:
                subprocess.run(
                    ["npm", "install"],
                    cwd=self.frontend_dir,
                    check=True
                )
                Logger.success("Frontend dependencies installed")
                return True
            except subprocess.CalledProcessError:
                Logger.error("Failed to install frontend dependencies")
                return False
        
        Logger.success("Frontend dependencies found")
        return True
    
    def setup_database(self) -> bool:
        """Setup database with migrations"""
        db_file = self.backend_dir / "pharmabot.db"
        
        if not db_file.exists():
            Logger.warning("Database not found. Running migrations...")
            
            try:
                python_exe = self.get_python_executable()
                alembic_path = self.backend_dir / "venv" / ("Scripts" if platform.system() == "Windows" else "bin") / "alembic"
                
                subprocess.run(
                    [str(alembic_path), "upgrade", "head"],
                    cwd=self.backend_dir,
                    check=True
                )
                Logger.success("Database created and migrations applied")
                return True
            except subprocess.CalledProcessError:
                Logger.error("Failed to run database migrations")
                return False
        
        Logger.success("Database found")
        return True
    
    def check_env_file(self) -> bool:
        """Check and configure .env file"""
        env_file = self.backend_dir / ".env"
        
        if not env_file.exists():
            Logger.error("Backend .env file not found!")
            Logger.info("Please create backend/.env with required configuration")
            return False
        
        # Read .env content
        with open(env_file, 'r') as f:
            content = f.read()
        
        # Check SECRET_KEY
        if "your-secret-key-here" in content:
            Logger.warning("SECRET_KEY not configured. Generating...")
            
            try:
                import secrets
                secret_key = secrets.token_hex(32)
                content = content.replace(
                    "SECRET_KEY=your-secret-key-here-change-in-production-min-32-characters",
                    f"SECRET_KEY={secret_key}"
                )
                
                with open(env_file, 'w') as f:
                    f.write(content)
                
                Logger.success("SECRET_KEY generated and saved")
            except Exception as e:
                Logger.warning(f"Could not generate SECRET_KEY: {e}")
        
        # Check GEMINI_API_KEY
        if "your-gemini-api-key" in content:
            Logger.warning("GEMINI_API_KEY not configured")
            Logger.info("Please add your Gemini API key to backend/.env")
            Logger.info("Get it from: https://makersuite.google.com/app/apikey")
        
        return True
    
    def check_port(self, port: int) -> bool:
        """Check if port is available"""
        try:
            if platform.system() == "Windows":
                result = subprocess.run(
                    f'netstat -ano | findstr :{port}',
                    shell=True,
                    capture_output=True,
                    text=True
                )
                if result.stdout.strip():
                    return False
            else:
                result = subprocess.run(
                    f'lsof -ti:{port}',
                    shell=True,
                    capture_output=True,
                    text=True
                )
                if result.stdout.strip():
                    return False
            return True
        except Exception:
            return True
    
    def free_ports(self):
        """Free up ports 3000 and 8000"""
        for port in [8000, 3000]:
            if not self.check_port(port):
                Logger.info(f"Freeing port {port}...")
                self.process_manager._kill_port(port)
                time.sleep(1)
    
    def wait_for_service(self, url: str, timeout: int = 30) -> bool:
        """Wait for a service to be available"""
        import urllib.request
        
        for _ in range(timeout):
            try:
                urllib.request.urlopen(url, timeout=1)
                return True
            except Exception:
                time.sleep(1)
        return False
    
    def start_backend(self) -> bool:
        """Start backend server"""
        Logger.info("=" * 45)
        Logger.success("Starting Backend Server (FastAPI)...")
        Logger.info("=" * 45)
        
        try:
            python_exe = self.get_python_executable()
            uvicorn_path = self.backend_dir / "venv" / ("Scripts" if platform.system() == "Windows" else "bin") / "uvicorn"
            
            # Start backend process
            backend_log = open(self.root_dir / "backend.log", "w")
            
            process = subprocess.Popen(
                [str(uvicorn_path), "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"],
                cwd=self.backend_dir,
                stdout=backend_log,
                stderr=subprocess.STDOUT
            )
            
            self.process_manager.add_process(process)
            
            # Wait for backend to start
            Logger.info("Waiting for backend to start...")
            if self.wait_for_service("http://localhost:8000/health"):
                Logger.success("Backend is ready at http://localhost:8000")
                Logger.info("API Docs available at http://localhost:8000/docs")
                return True
            else:
                Logger.error("Backend failed to start. Check backend.log")
                return False
                
        except Exception as e:
            Logger.error(f"Failed to start backend: {e}")
            return False
    
    def start_frontend(self) -> bool:
        """Start frontend server"""
        Logger.info("")
        Logger.info("=" * 45)
        Logger.success("Starting Frontend Server (Next.js)...")
        Logger.info("=" * 45)
        
        try:
            # Start frontend process
            frontend_log = open(self.root_dir / "frontend.log", "w")
            
            process = subprocess.Popen(
                ["npm", "run", "dev"],
                cwd=self.frontend_dir,
                stdout=frontend_log,
                stderr=subprocess.STDOUT
            )
            
            self.process_manager.add_process(process)
            
            # Wait for frontend to start
            Logger.info("Waiting for frontend to start...")
            if self.wait_for_service("http://localhost:3000", timeout=45):
                Logger.success("Frontend is ready at http://localhost:3000")
                return True
            else:
                Logger.error("Frontend failed to start. Check frontend.log")
                return False
                
        except Exception as e:
            Logger.error(f"Failed to start frontend: {e}")
            return False
    
    def run(self):
        """Main execution flow"""
        Logger.info("🚀 Starting PharmaBot Development Servers...")
        print()
        
        # Check prerequisites
        if not self.check_directories():
            sys.exit(1)
        
        if not self.check_python():
            sys.exit(1)
        
        if not self.check_node():
            sys.exit(1)
        
        # Setup backend
        if not self.setup_backend_venv():
            sys.exit(1)
        
        if not self.install_backend_deps():
            sys.exit(1)
        
        # Setup frontend
        if not self.install_frontend_deps():
            sys.exit(1)
        
        # Setup database
        if not self.setup_database():
            sys.exit(1)
        
        # Check configuration
        if not self.check_env_file():
            sys.exit(1)
        
        # Free ports
        self.free_ports()
        
        # Start servers
        print()
        if not self.start_backend():
            self.process_manager.cleanup()
            sys.exit(1)
        
        if not self.start_frontend():
            self.process_manager.cleanup()
            sys.exit(1)
        
        # Success!
        print()
        Logger.info("=" * 45)
        Logger.success("🎉 Both servers are running!")
        Logger.info("=" * 45)
        print()
        Logger.info("Frontend: http://localhost:3000")
        Logger.info("Backend:  http://localhost:8000")
        Logger.info("API Docs: http://localhost:8000/docs")
        print()
        Logger.info("Logs:")
        Logger.info("  Backend:  tail -f backend.log")
        Logger.info("  Frontend: tail -f frontend.log")
        print()
        Logger.warning("Press Ctrl+C to stop both servers")
        print()
        
        # Keep running
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n")
            self.process_manager.cleanup()
            sys.exit(0)

if __name__ == "__main__":
    app = PharmaBot()
    app.run()
