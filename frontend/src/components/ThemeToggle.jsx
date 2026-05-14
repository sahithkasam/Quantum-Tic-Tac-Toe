import React from "react";

const ThemeToggle = ({ darkMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="rounded-full border border-slate-600 px-4 py-2 text-xs uppercase tracking-wide hover:border-neon"
    >
      {darkMode ? "Dark" : "Light"} Mode
    </button>
  );
};

export default ThemeToggle;
