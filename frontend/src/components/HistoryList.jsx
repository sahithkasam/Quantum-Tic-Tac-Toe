import React from "react";

const HistoryList = ({ history }) => {
  return (
    <div className="panel-glass rounded-3xl p-4 text-xs shadow-xl">
      <h3 className="text-sm font-display text-neon">Move History</h3>
      <ul className="mt-3 space-y-2 text-slate-300">
        {history.length === 0 && <li className="text-slate-500">No moves yet.</li>}
        {history.map((entry, idx) => (
          <li key={`${entry.type}-${idx}`} className="rounded-xl bg-slate-900/60 p-2">
            <span className="uppercase text-slate-500">{entry.type}</span> {" "}
            {entry.player && <span className="text-slate-200">{entry.player}</span>}
            {entry.cells && <span> [{entry.cells.join(", ")}]</span>}
            {entry.result?.raw && <span> | collapse: {entry.result.raw}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryList;
