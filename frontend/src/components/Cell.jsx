import React from "react";

const QuantumBadge = ({ mark }) => {
  return (
    <div className={`text-xs px-2 py-1 rounded-full border ${mark.player === "X" ? "border-neon text-neon" : "border-pulse text-pulse"}`}>
      {mark.player}{mark.moveId}
    </div>
  );
};

const Cell = ({ cell, onClick, isSelected }) => {
  const classical = cell.classical;
  const classicalClass = classical === "X" ? "text-neon" : classical === "O" ? "text-pulse" : "text-slate-600";

  return (
    <button
      onClick={() => onClick(cell.index)}
      className={`relative flex flex-col items-center justify-center rounded-2xl border border-slate-700/60 bg-slate-900/60 p-2 text-4xl font-display transition duration-200 hover:border-neon hover:shadow-glow ${isSelected ? "ring-2 ring-quantum" : ""}`}
    >
      <span className={`animate-pop ${classicalClass} ${classical ? "opacity-100" : "opacity-30"}`}>
        {classical || ""}
      </span>
      <div className="mt-1 flex flex-wrap gap-1">
        {cell.quantum.map((mark) => (
          <QuantumBadge key={`${mark.moveId}-${cell.index}`} mark={mark} />
        ))}
      </div>
    </button>
  );
};

export default Cell;
