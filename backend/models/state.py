from dataclasses import dataclass, field
from typing import Dict, List, Optional

@dataclass
class QuantumMove:
    id: int
    player: str
    cells: List[int]
    resolved: Optional[int] = None

@dataclass
class GameState:
    board: List[Optional[str]] = field(default_factory=lambda: [None] * 9)
    quantum_moves: List[QuantumMove] = field(default_factory=list)
    move_history: List[Dict] = field(default_factory=list)
    current_player: str = "X"
    next_move_id: int = 1
    cycle_detected: bool = False
    last_measurement: Optional[Dict] = None
    probabilities: Dict = field(default_factory=dict)
    game_over: bool = False
    winner: Optional[str] = None
    draw: bool = False

    @classmethod
    def new(cls) -> "GameState":
        return cls()

    def to_payload(self) -> Dict:
        board_payload = []
        for idx, value in enumerate(self.board):
            quantum_marks = []
            for move in self.quantum_moves:
                if idx in move.cells:
                    quantum_marks.append({
                        "player": move.player,
                        "moveId": move.id,
                        "cells": move.cells,
                    })
            board_payload.append({
                "index": idx,
                "classical": value,
                "quantum": quantum_marks,
            })

        return {
            "board": board_payload,
            "currentPlayer": self.current_player,
            "quantumMoves": [self._move_to_dict(move) for move in self.quantum_moves],
            "moveHistory": self.move_history,
            "cycleDetected": self.cycle_detected,
            "lastMeasurement": self.last_measurement,
            "probabilities": self.probabilities,
            "gameOver": self.game_over,
            "winner": self.winner,
            "draw": self.draw,
        }

    def _move_to_dict(self, move: QuantumMove) -> Dict:
        return {
            "id": move.id,
            "player": move.player,
            "cells": move.cells,
            "resolved": move.resolved,
        }
