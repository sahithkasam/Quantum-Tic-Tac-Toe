import React from "react";

const QuantumModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
      <div className="panel-glass max-w-xl rounded-3xl p-6 text-sm">
        <h2 className="text-xl font-display text-neon">Quantum Concepts</h2>
        <p className="mt-3 text-slate-300">
          Quantum Tic-Tac-Toe lets each player place moves in superposition. A quantum move links two cells
          at once until a measurement collapses the board.
        </p>
        <ul className="mt-4 space-y-2 text-slate-300">
          <li>Superposition: one move occupies two squares simultaneously.</li>
          <li>Entanglement: linked moves share fate when the board collapses.</li>
          <li>Measurement: collapsing resolves every quantum move into a classical mark.</li>
        </ul>
        <button
          onClick={onClose}
          className="mt-6 rounded-full bg-neon px-4 py-2 text-xs uppercase tracking-wide text-slate-950"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default QuantumModal;
