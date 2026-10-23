# AlgoMind

AlgoMind is an AI-powered Data Structures and Algorithms learning assistant designed to help users understand DSA concepts, explore problem-solving approaches, and learn algorithms through clear explanations.

## Tech Stack

### Frontend
- React
- Vite
- JavaScript

### Backend
- Node.js
- Express.js
- dotenv

### Planned Technologies
- AI/LLM integration
- Embeddings and vector search
- ChromaDB
- MongoDB
- Server-Sent Events (SSE)

## Project Structure

```text
AlgoMind/
├── frontend/
├── backend/
│   ├── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## Setup

### 1. Clone or download the project

Open a terminal in the project directory.

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open the local address displayed by Vite.

### 3. Start the backend

Open a second terminal and navigate to the backend folder.

```bash
cd backend
npm install
npm run dev
```

### 4. Configure environment variables

Create `backend/.env` using `backend/.env.example` as a reference.

Example:

```env
PORT=5000
```

### 5. Test the backend

Send a GET request to:

`http://localhost:5000/api/health`

Expected response:

```json
{
  "status": "ok",
  "message": "backend is running"
}
```

## Development Status

Day 1: Initial frontend and backend setup, environment configuration, and health-check API.

AI integration, DSA knowledge retrieval, authentication, and database features are planned for subsequent development stages.