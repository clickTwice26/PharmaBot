# Development Guide

## Quick Start

### Automated Setup
Run the setup script to automatically configure both frontend and backend:
```bash
./setup.sh
```

### Manual Setup

#### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Common Development Tasks

### Adding a New API Endpoint

1. Create or modify a router in `backend/app/routers/`
2. Define request/response schemas in `backend/app/schemas.py`
3. Implement the endpoint logic
4. Add authentication if needed using `Depends(get_current_user)`

Example:
```python
@router.get("/example")
async def example_endpoint(current_user: User = Depends(get_current_user)):
    return {"message": "Hello"}
```

### Creating a Database Migration

1. Modify models in `backend/app/models.py`
2. Generate migration:
```bash
cd backend
alembic revision --autogenerate -m "Description"
```
3. Review the generated migration in `alembic/versions/`
4. Apply migration:
```bash
alembic upgrade head
```

### Adding a New Frontend Page

1. Create a new directory in `frontend/src/app/`
2. Add `page.tsx` file
3. Implement the component
4. Add navigation links if needed

Example:
```typescript
// frontend/src/app/example/page.tsx
export default function ExamplePage() {
  return <div>Example Page</div>
}
```

## Testing

### Backend Testing
```bash
cd backend
pytest
```

### Frontend Testing
```bash
cd frontend
npm test
```

## API Testing

### Using FastAPI Docs
Visit http://localhost:8000/docs for interactive API documentation.

### Using cURL

Register:
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}'
```

Login:
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=testpass123"
```

Upload Prescription:
```bash
curl -X POST http://localhost:8000/prescriptions/analyze \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@/path/to/prescription.jpg"
```

## Debugging

### Backend Debugging
1. Add breakpoints in your IDE
2. Or use `import pdb; pdb.set_trace()`
3. Run with debugger attached

### Frontend Debugging
1. Use browser DevTools
2. Add `console.log()` statements
3. Use React Developer Tools extension

### Database Inspection
```bash
cd backend
sqlite3 pharmabot.db
.tables
SELECT * FROM users;
.exit
```

## Environment Variables

### Development
All environment variables are already set in `.env` and `.env.local` files.

### Production
Set the following environment variables:
- `SECRET_KEY` - Generate securely
- `GEMINI_API_KEY` - Your actual API key
- `DATABASE_URL` - Production database URL
- `FRONTEND_URL` - Your frontend domain
- `NEXT_PUBLIC_API_URL` - Your backend API URL

## Code Style

### Backend (Python)
- Follow PEP 8
- Use type hints
- Format with black (optional): `black app/`

### Frontend (TypeScript)
- Use TypeScript strictly
- Follow Next.js conventions
- Format with prettier (optional): `npm run format`

## Git Workflow

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make changes and commit:
```bash
git add .
git commit -m "Description of changes"
```

3. Push and create pull request:
```bash
git push origin feature/your-feature-name
```

## Common Issues & Solutions

### Issue: "Module not found" in backend
**Solution**: Ensure virtual environment is activated and dependencies installed
```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: Database locked
**Solution**: Close all connections to the database
```bash
rm pharmabot.db
alembic upgrade head
```

### Issue: Frontend can't connect to backend
**Solution**: Check CORS settings and ensure backend is running on correct port

### Issue: JWT token invalid
**Solution**: Check SECRET_KEY matches between requests, token might be expired

### Issue: Gemini API errors
**Solution**: Verify API key is correct and you have API access enabled

## Performance Optimization

### Backend
- Add database indexes for frequently queried fields
- Implement caching for repeated AI requests
- Use async operations where possible

### Frontend
- Implement image compression before upload
- Add loading states and error boundaries
- Use Next.js Image component for optimization

## Security Checklist

- [ ] Change default SECRET_KEY
- [ ] Use HTTPS in production
- [ ] Validate all user inputs
- [ ] Implement rate limiting
- [ ] Regular dependency updates
- [ ] Secure API key storage
- [ ] Database backups configured

## Useful Commands

### Reset Everything
```bash
# Backend
rm backend/pharmabot.db
cd backend && alembic upgrade head

# Frontend
rm -rf frontend/.next
cd frontend && npm run build
```

### Update Dependencies
```bash
# Backend
pip install --upgrade -r requirements.txt

# Frontend
npm update
```

### Check Logs
```bash
# Backend logs (if using systemd)
journalctl -u pharmabot-api -f

# Frontend logs
npm run dev | tee frontend.log
```

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## Getting Help

1. Check the documentation
2. Review the ARCHITECTURE.md file
3. Look at the API documentation at `/docs`
4. Create an issue on GitHub
