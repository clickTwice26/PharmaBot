# Get Gemini API Key

To use the prescription scanning feature, you need a Google Gemini API key.

## Steps to Get API Key

1. Go to Google AI Studio: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key
5. Add it to the backend `.env` file:
   ```
   GEMINI_API_KEY=your-api-key-here
   ```

## Generate SECRET_KEY

Generate a secure secret key for JWT tokens:

```bash
# On macOS/Linux
openssl rand -hex 32

# Or use Python
python -c "import secrets; print(secrets.token_hex(32))"
```

Add it to the backend `.env` file:
```
SECRET_KEY=your-generated-secret-key-here
```

## Important Notes

- Keep your API keys secure and never commit them to version control
- The `.env` file is already in `.gitignore`
- For production, use environment variables or a secrets manager
