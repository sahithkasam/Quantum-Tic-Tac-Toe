import React from "react";

const ModeToggle = ({ mode, onToggle }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onToggle("classical")}
        className={`rounded-full px-4 py-2 text-xs uppercase tracking-wide ${mode === "classical" ? "bg-neon text-slate-950" : "bg-slate-800"}`}
      >
        Classical
      </button>
      <button
        onClick={() => onToggle("quantum")}
        className={`rounded-full px-4 py-2 text-xs uppercase tracking-wide ${mode === "quantum" ? "bg-quantum text-slate-950" : "bg-slate-800"}`}
      >
        Quantum
      </button>
    </div>
  );
};

export default ModeToggle;
