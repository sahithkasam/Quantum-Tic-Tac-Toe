from dataclasses import asdict
from typing import Dict, List, Optional, Tuple

from qiskit import QuantumCircuit, transpile

try:
    from qiskit_aer import Aer
    AER_AVAILABLE = True
except Exception:
    from qiskit.providers.basic_provider import BasicProvider

    Aer = None
    AER_AVAILABLE = False
from qiskit.visualization import circuit_drawer

from models.state import GameState, QuantumMove

WIN_LINES = [
    (0, 1, 2),
    (3, 4, 5),
    (6, 7, 8),
    (0, 3, 6),
    (1, 4, 7),
    (2, 5, 8),
    (0, 4, 8),
    (2, 4, 6),
]

class QuantumGameEngine:
    def __init__(self):
        self.state = GameState.new()

    def reset_game(self):
        self.state = GameState.new()

    def get_state_payload(self) -> Dict:
        return self.state.to_payload()

    def make_classical_move(self, cell: Optional[int]) -> Dict:
        if self.state.game_over:
            return {"ok": False, "error": "Game is over."}
        if not isinstance(cell, int) or cell < 0 or cell > 8:
            return {"ok": False, "error": "Invalid cell."}
        if self.state.board[cell] is not None:
            return {"ok": False, "error": "Cell is already occupied."}
        if self._has_pending_quantum():
            return {"ok": False, "error": "Collapse quantum moves before classical play."}

        player = self.state.current_player
        self.state.board[cell] = player
        self.state.move_history.append({
            "type": "classical",
            "player": player,
            "cells": [cell],
        })
        self._update_outcome()
        self._toggle_player()
        return {"ok": True, "state": self.state.to_payload()}

    def make_quantum_move(self, cell_a: Optional[int], cell_b: Optional[int]) -> Dict:
        if self.state.game_over:
            return {"ok": False, "error": "Game is over."}
        if not self._valid_quantum_cells(cell_a, cell_b):
            return {"ok": False, "error": "Quantum move requires two different empty cells."}
        if self.state.board[cell_a] is not None or self.state.board[cell_b] is not None:
            return {"ok": False, "error": "One of the cells is already occupied."}

        move_id = self.state.next_move_id
        self.state.next_move_id += 1
        move = QuantumMove(id=move_id, player=self.state.current_player, cells=[cell_a, cell_b])
        self.state.quantum_moves.append(move)
        self.state.move_history.append({
            "type": "quantum",
            "player": move.player,
            "cells": move.cells,
            "moveId": move.id,
        })

        self.state.cycle_detected = self._detect_cycle()
        self._toggle_player()
        return {"ok": True, "state": self.state.to_payload()}

    def collapse_board(self) -> Dict:
        if not self._has_pending_quantum():
            return {"ok": False, "error": "No quantum moves to collapse."}

        measurement, probabilities = self._measure_quantum_moves()
        self.state.last_measurement = measurement
        self.state.probabilities = probabilities

        for bit, move in zip(measurement["bits"], self.state.quantum_moves):
            chosen_cell = move.cells[0] if bit == 0 else move.cells[1]
            alternate_cell = move.cells[1] if bit == 0 else move.cells[0]
            if self.state.board[chosen_cell] is None:
                self.state.board[chosen_cell] = move.player
                move.resolved = chosen_cell
            elif self.state.board[alternate_cell] is None:
                self.state.board[alternate_cell] = move.player
                move.resolved = alternate_cell
            else:
                move.resolved = None

        self.state.quantum_moves = []
        self.state.cycle_detected = False
        self.state.move_history.append({
            "type": "collapse",
            "result": measurement,
        })
        self._update_outcome()
        return {"ok": True, "state": self.state.to_payload()}

    def make_ai_move(self, player: Optional[str], ai_fn) -> Dict:
        if self.state.game_over:
            return {"ok": False, "error": "Game is over."}
        if self._has_pending_quantum():
            return {"ok": False, "error": "AI only plays after collapse."}
        if player not in ("X", "O"):
            return {"ok": False, "error": "Invalid player."}

        board = self.state.board[:]
        move = ai_fn(board, player)
        if move is None:
            return {"ok": False, "error": "No valid moves."}

        self.state.current_player = player
        return self.make_classical_move(move)

    def get_circuit_payload(self) -> Dict:
        circuit = self._build_quantum_circuit()
        if circuit is None:
            return {"svg": None, "probabilities": {}}
        svg = str(circuit_drawer(circuit, output="svg"))
        probs = self._estimate_probabilities(circuit)
        return {"svg": svg, "probabilities": probs}

    def _build_quantum_circuit(self) -> Optional[QuantumCircuit]:
        if not self.state.quantum_moves:
            return None

        num_qubits = len(self.state.quantum_moves)
        circuit = QuantumCircuit(num_qubits, num_qubits)
        for idx in range(num_qubits):
            circuit.h(idx)

        for i in range(num_qubits):
            for j in range(i + 1, num_qubits):
                if self._moves_share_cell(self.state.quantum_moves[i], self.state.quantum_moves[j]):
                    circuit.cx(i, j)

        circuit.barrier()
        circuit.measure(range(num_qubits), range(num_qubits))
        return circuit

    def _measure_quantum_moves(self) -> Tuple[Dict, Dict]:
        circuit = self._build_quantum_circuit()
        if circuit is None:
            return {"bits": []}, {}

        backend = self._get_backend()
        compiled = transpile(circuit, backend)
        job = backend.run(compiled, shots=1)
        counts = job.result().get_counts()
        bitstring = list(counts.keys())[0]
        bits = [int(bit) for bit in bitstring[::-1]]
        probabilities = self._estimate_probabilities(circuit)
        return {"bits": bits, "raw": bitstring}, probabilities

    def _estimate_probabilities(self, circuit: QuantumCircuit) -> Dict:
        backend = self._get_backend()
        compiled = transpile(circuit, backend)
        job = backend.run(compiled, shots=1024)
        counts = job.result().get_counts()
        total = sum(counts.values())
        return {state: count / total for state, count in counts.items()}

    def _get_backend(self):
        if AER_AVAILABLE:
            return Aer.get_backend("qasm_simulator")
        return BasicProvider().get_backend("basic_simulator")

    def _moves_share_cell(self, move_a: QuantumMove, move_b: QuantumMove) -> bool:
        return bool(set(move_a.cells) & set(move_b.cells))

    def _valid_quantum_cells(self, cell_a: Optional[int], cell_b: Optional[int]) -> bool:
        if not isinstance(cell_a, int) or not isinstance(cell_b, int):
            return False
        if cell_a == cell_b:
            return False
        return 0 <= cell_a <= 8 and 0 <= cell_b <= 8

    def _toggle_player(self):
        self.state.current_player = "O" if self.state.current_player == "X" else "X"

    def _has_pending_quantum(self) -> bool:
        return len(self.state.quantum_moves) > 0

    def _detect_cycle(self) -> bool:
        graph = {i: [] for i in range(9)}
        for move in self.state.quantum_moves:
            a, b = move.cells
            graph[a].append(b)
            graph[b].append(a)

        visited = set()

        def dfs(node, parent):
            visited.add(node)
            for neighbor in graph[node]:
                if neighbor not in visited:
                    if dfs(neighbor, node):
                        return True
                elif neighbor != parent:
                    return True
            return False

        for node in range(9):
            if graph[node] and node not in visited:
                if dfs(node, -1):
                    return True
        return False

    def _update_outcome(self):
        winner = self._check_winner()
        if winner:
            self.state.winner = winner
            self.state.game_over = True
            return
        if all(cell is not None for cell in self.state.board):
            self.state.game_over = True
            self.state.draw = True

    def _check_winner(self) -> Optional[str]:
        for a, b, c in WIN_LINES:
            line = [self.state.board[a], self.state.board[b], self.state.board[c]]
            if line[0] and line.count(line[0]) == 3:
                return line[0]
        return None

engine = QuantumGameEngine()
