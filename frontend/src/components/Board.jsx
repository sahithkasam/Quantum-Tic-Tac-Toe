import React from "react";
import Cell from "./Cell.jsx";

const Board = ({ board, onCellClick, selectedCells }) => {
  return (
    <div className="board-grid grid grid-cols-3 gap-3 rounded-3xl p-4 shadow-glow">
      {board.map((cell) => (
        <Cell
          key={cell.index}
          cell={cell}
          onClick={onCellClick}
          isSelected={selectedCells.includes(cell.index)}
        />
      ))}
    </div>
  );
};

export default Board;
