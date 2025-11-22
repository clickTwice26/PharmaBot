# PharmaBot Frontend

Next.js 14 frontend with TypeScript and Tailwind CSS.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open http://localhost:3000

## Features

- User authentication (login/register)
- Prescription image upload
- AI-powered analysis results
- Responsive design with Tailwind CSS

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── login/        # Login page
│   │   ├── register/     # Registration page
│   │   ├── dashboard/    # Main dashboard
│   │   └── ...
│   └── lib/
│       └── api.ts        # API client with axios
├── package.json
└── .env.local            # Environment variables
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
