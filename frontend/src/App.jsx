import React, { useEffect, useMemo, useState } from "react";
import Board from "./components/Board.jsx";
import Sidebar from "./components/Sidebar.jsx";
import QuantumModal from "./components/QuantumModal.jsx";
import HistoryList from "./components/HistoryList.jsx";
import CircuitPanel from "./components/CircuitPanel.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import { useGameApi } from "./hooks/useGameApi.js";
import { useSound } from "./hooks/useSound.js";

const App = () => {
  const api = useGameApi();
  const { playMove, playQuantum, playCollapse } = useSound();

  const [gameState, setGameState] = useState(null);
  const [mode, setMode] = useState("classical");
  const [selectedCells, setSelectedCells] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [circuitSvg, setCircuitSvg] = useState(null);
  const [probabilities, setProbabilities] = useState({});

  const board = useMemo(() => gameState?.board || [], [gameState]);

  const refreshBoard = async () => {
    setLoading(true);
    const { data, error: err } = await api.getBoard();
    if (err) {
      setError(err);
    } else {
      setGameState(data);
      setError("");
    }
    setLoading(false);
  };

  const refreshCircuit = async () => {
    const { data } = await api.getCircuit();
    if (data) {
      setCircuitSvg(data.svg);
      setProbabilities(data.probabilities || {});
    }
  };

  useEffect(() => {
    api.init().then(({ data, error: err }) => {
      if (err) {
        setError(err);
      } else {
        setGameState(data);
      }
    });
  }, []);

  useEffect(() => {
    refreshCircuit();
  }, [gameState?.quantumMoves?.length]);

  const handleCellClick = async (cellIndex) => {
    if (!gameState || gameState.gameOver) return;

    if (mode === "classical") {
      const { data, error: err } = await api.classicalMove(cellIndex);
      if (err) {
        setError(err);
        return;
      }
      setGameState(data.state);
      playMove();
      setSelectedCells([]);
      return;
    }

    const updatedSelection = selectedCells.includes(cellIndex)
      ? selectedCells.filter((cell) => cell !== cellIndex)
      : [...selectedCells, cellIndex].slice(-2);

    setSelectedCells(updatedSelection);

    if (updatedSelection.length === 2) {
      const { data, error: err } = await api.quantumMove(updatedSelection[0], updatedSelection[1]);
      if (err) {
        setError(err);
        return;
      }
      setGameState(data.state);
      playQuantum();
      setSelectedCells([]);
    }
  };

  const handleCollapse = async () => {
    const { data, error: err } = await api.collapse();
    if (err) {
      setError(err);
      return;
    }
    setGameState(data.state);
    playCollapse();
    refreshCircuit();
  };

  const handleRestart = async () => {
    const { data, error: err } = await api.restart();
    if (err) {
      setError(err);
      return;
    }
    setGameState(data);
    setSelectedCells([]);
  };

  const handleAIMove = async () => {
    if (!aiEnabled || !gameState) return;
    const { data, error: err } = await api.aiMove(gameState.currentPlayer);
    if (err) {
      setError(err);
      return;
    }
    setGameState(data.state);
  };

  const exportHistory = () => {
    if (!gameState) return;
    const blob = new Blob([JSON.stringify(gameState.moveHistory, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "quantum-tic-tac-toe-history.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "app-bg" : "bg-slate-100 text-slate-950"}`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 lg:flex-row">
        <div className="flex flex-1 flex-col gap-6">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Quantum Tic-Tac-Toe</p>
              <h1 className="text-3xl font-display text-neon">Superposition Arena</h1>
            </div>
            <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode((prev) => !prev)} />
          </header>

          {gameState && (
            <Board board={board} onCellClick={handleCellClick} selectedCells={selectedCells} />
          )}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="rounded-full border border-neon px-4 py-2 text-xs uppercase tracking-wide text-neon hover:bg-neon hover:text-slate-950"
            >
              What is quantum play?
            </button>
            <button
              onClick={exportHistory}
              className="rounded-full border border-slate-500 px-4 py-2 text-xs uppercase tracking-wide hover:border-neon"
            >
              Save game history
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <HistoryList history={gameState?.moveHistory || []} />
            <CircuitPanel svg={circuitSvg} probabilities={probabilities} />
          </div>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-6">
          {gameState && (
            <Sidebar
              currentPlayer={gameState.currentPlayer}
              mode={mode}
              cycleDetected={gameState.cycleDetected}
              gameOver={gameState.gameOver}
              winner={gameState.winner}
              draw={gameState.draw}
              quantumMoves={gameState.quantumMoves}
              lastMeasurement={gameState.lastMeasurement}
              onCollapse={handleCollapse}
              onRestart={handleRestart}
              onToggleMode={setMode}
              onToggleTutorial={() => setShowModal(true)}
              onToggleAI={() => setAiEnabled((prev) => !prev)}
              aiEnabled={aiEnabled}
              onAIMove={handleAIMove}
              loading={loading}
              error={error}
            />
          )}
        </div>
      </div>
      <QuantumModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default App;
