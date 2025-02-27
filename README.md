# Flask + Next.js Authentication Demo

A simple application with Flask backend and Next.js frontend with login functionality.

## Features

- Flask backend with JWT authentication
- Next.js frontend with protected routes
- SQLite database for user storage
- Docker containerization for the backend

## Project Structure

```
.
├── backend/                # Flask backend
│   ├── app.py              # Main Flask application
│   ├── models.py           # Database models
│   ├── Dockerfile          # Docker configuration for backend
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js frontend
│   ├── src/                # Source code
│   │   ├── app/            # Next.js app directory
│   │   │   ├── login/      # Login page
│   │   │   ├── register/   # Register page
│   │   │   └── dashboard/  # Protected dashboard page
│   │   ├── context/        # React context providers
│   │   └── services/       # API services
│   └── ...                 # Next.js configuration files
└── docker-compose.yml      # Docker Compose configuration
```

## Prerequisites

- Docker and Docker Compose
- Node.js (v16 or later)
- npm (v7 or later)

## Getting Started

### 1. Start the Flask Backend

```bash
docker-compose up -d
```

This will start the Flask backend on http://localhost:5001.

### 2. Start the Next.js Frontend

```bash
cd frontend
npm install
npm run dev
```

This will start the Next.js frontend on http://localhost:3000.

### 3. Access the Application

Open your browser and navigate to http://localhost:3000.

## Default User

A default user is created when the application starts:

- Username: admin
- Password: password

## API Endpoints

### Authentication

- `POST /api/register` - Register a new user
- `POST /api/login` - Login and get JWT token
- `GET /api/user` - Get current user information (protected)
- `GET /api/protected` - Test protected endpoint

## Development

### Backend Development

The Flask backend is containerized with Docker. Any changes to the backend code will be reflected immediately due to the volume mount in the docker-compose.yml file.

### Frontend Development

The Next.js frontend uses the standard Next.js development server. Any changes to the frontend code will be reflected immediately thanks to Next.js's hot module replacement.
