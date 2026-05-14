import React from "react";

const Sidebar = ({
  currentPlayer,
  mode,
  cycleDetected,
  gameOver,
  winner,
  draw,
  quantumMoves,
  lastMeasurement,
  onCollapse,
  onRestart,
  onToggleMode,
  onToggleTutorial,
  onToggleAI,
  aiEnabled,
  onAIMove,
  loading,
  error,
}) => {
  return (
    <aside className="panel-glass flex w-full flex-col gap-4 rounded-3xl p-5 text-sm shadow-xl">
      <div>
        <p className="text-slate-400">Current player</p>
        <p className="text-3xl font-display text-neon">{currentPlayer}</p>
      </div>
      <div>
        <p className="text-slate-400">Mode</p>
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => onToggleMode("classical")}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-wide ${mode === "classical" ? "bg-neon text-slate-950" : "bg-slate-800"}`}
          >
            Classical
          </button>
          <button
            onClick={() => onToggleMode("quantum")}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-wide ${mode === "quantum" ? "bg-quantum text-slate-950" : "bg-slate-800"}`}
          >
            Quantum
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={onCollapse}
          disabled={loading}
          className="rounded-full border border-quantum px-4 py-2 text-xs uppercase tracking-wide text-quantum hover:bg-quantum hover:text-slate-950"
        >
          Collapse Quantum State
        </button>
        <button
          onClick={onRestart}
          className="rounded-full border border-slate-500 px-4 py-2 text-xs uppercase tracking-wide hover:border-neon"
        >
          Reset Game
        </button>
        <button
          onClick={onToggleTutorial}
          className="rounded-full border border-slate-500 px-4 py-2 text-xs uppercase tracking-wide hover:border-neon"
        >
          Quantum Tutorial
        </button>
      </div>
      <div className="rounded-2xl bg-slate-900/60 p-3">
        <p className="text-slate-400">AI opponent</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            onClick={onToggleAI}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-wide ${aiEnabled ? "bg-pulse text-slate-950" : "bg-slate-800"}`}
          >
            {aiEnabled ? "Enabled" : "Disabled"}
          </button>
          <button
            onClick={onAIMove}
            disabled={!aiEnabled}
            className="rounded-full border border-pulse px-4 py-2 text-xs uppercase tracking-wide text-pulse hover:bg-pulse hover:text-slate-950 disabled:opacity-50"
          >
            AI Move
          </button>
        </div>
      </div>
      <div className="rounded-2xl bg-slate-900/60 p-3 text-xs">
        <p className="text-slate-400">Quantum state</p>
        <p className="mt-1">Active quantum moves: {quantumMoves?.length || 0}</p>
        {lastMeasurement?.raw && (
          <p className="mt-2 text-quantum">Last collapse: {lastMeasurement.raw}</p>
        )}
      </div>
      <div className="text-xs text-slate-400">
        {cycleDetected && <p className="text-quantum">Cycle detected: collapse is ready.</p>}
        {gameOver && <p className="text-pulse">Game over: {winner ? `${winner} wins` : "Draw"}</p>}
        {draw && !winner && gameOver && <p>Stalemate after collapse.</p>}
        {error && <p className="text-red-400">{error}</p>}
      </div>
    </aside>
  );
};

export default Sidebar;
