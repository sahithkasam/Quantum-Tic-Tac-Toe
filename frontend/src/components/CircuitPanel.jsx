import React from "react";

const CircuitPanel = ({ svg, probabilities }) => {
  return (
    <div className="panel-glass rounded-3xl p-4 text-xs shadow-xl">
      <h3 className="text-sm font-display text-neon">Quantum Circuit</h3>
      {svg ? (
        <div className="mt-3 overflow-auto rounded-xl bg-white/5 p-2" dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <p className="mt-3 text-slate-500">No quantum moves yet.</p>
      )}
      <div className="mt-3">
        <h4 className="text-slate-400">Outcome probabilities</h4>
        <div className="mt-2 grid gap-2">
          {Object.keys(probabilities).length === 0 && (
            <p className="text-slate-500">Awaiting quantum state.</p>
          )}
          {Object.entries(probabilities).map(([state, value]) => (
            <div key={state} className="flex items-center justify-between rounded-xl bg-slate-900/60 px-3 py-2">
              <span>{state}</span>
              <span>{(value * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CircuitPanel;
