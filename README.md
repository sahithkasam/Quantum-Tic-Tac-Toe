# Quantum Tic-Tac-Toe

A full-stack Quantum Tic-Tac-Toe game that blends classic play with quantum superposition and measurement. The frontend uses React with Tailwind CSS, and the backend runs Flask with Qiskit Aer for simulation.

## Features
- 3x3 board with classical and quantum moves
- Two-player gameplay with superposition and entanglement cues
- Cycle detection and quantum collapse
- Quantum circuit visualization with outcome probabilities
- AI opponent for classical mode (minimax)
- Sound effects, dark mode, and responsive layout
- Move history and exportable game log
- Quantum tutorial modal

## Project Structure
- frontend/ React + Tailwind UI
- backend/ Flask + Qiskit API
- backend/quantum/ quantum simulation and logic
- backend/routes/ API endpoints
- backend/models/ game state and AI

## Major Files Explained
- backend/app.py: Flask app setup and API registration
- backend/routes/game_routes.py: REST API routes
- backend/quantum/engine.py: Core game logic and Qiskit simulation
- backend/models/state.py: Game state data model
- backend/models/ai.py: Minimax AI for classical mode
- frontend/src/App.jsx: UI composition and game flow
- frontend/src/components: Board, sidebar, circuit panel, and modals
- frontend/src/hooks/useGameApi.js: Axios API client
- frontend/src/hooks/useSound.js: Web Audio sound effects
- frontend/src/styles/index.css: Global styles and background

## Setup Instructions

### Backend
1. Create a virtual environment and install dependencies:
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
2. Start the Flask API (port 5001 by default):
   ```bash
   python app.py
   ```

### Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```

## Run Commands Summary
- Backend: `cd backend && source .venv/bin/activate && python app.py`
- Frontend: `cd frontend && npm install && npm run dev`

## Port Configuration
- Backend uses `FLASK_PORT` (defaults to 5001).
- Frontend reads `VITE_API_BASE` from [frontend/.env](frontend/.env).

## API Documentation
Base URL: `http://localhost:5000/api`

- `POST /init` Initialize game state
- `GET /board` Get current board and game data
- `POST /move/classical` Body: `{ "cell": 0 }`
- `POST /move/quantum` Body: `{ "cellA": 0, "cellB": 4 }`
- `POST /collapse` Collapse all quantum moves
- `POST /restart` Reset the game
- `GET /circuit` Get SVG circuit + probabilities
- `POST /ai/move` Body: `{ "player": "X" }`

## Example Gameplay Walkthrough
1. Player X makes a quantum move between cells 0 and 4.
2. Player O responds with a classical move in cell 1.
3. After more quantum moves, a cycle is detected.
4. Collapse the board to resolve all quantum moves.
5. Continue with classical play until a winner appears.

## Notes
- AI opponent only plays after quantum moves are collapsed.
- Quantum probabilities are simulated with Qiskit Aer.
