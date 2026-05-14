from flask import Blueprint, jsonify, request

from quantum.engine import engine
from models.ai import find_best_move

game_routes = Blueprint("game_routes", __name__)

@game_routes.get("/board")
def get_board():
    state = engine.get_state_payload()
    return jsonify(state)

@game_routes.post("/init")
def init_game():
    engine.reset_game()
    return jsonify(engine.get_state_payload())

@game_routes.post("/restart")
def restart_game():
    engine.reset_game()
    return jsonify(engine.get_state_payload())

@game_routes.post("/move/classical")
def make_classical_move():
    data = request.get_json(silent=True) or {}
    cell = data.get("cell")
    result = engine.make_classical_move(cell)
    if not result["ok"]:
        return jsonify(result), 400
    return jsonify(result)

@game_routes.post("/move/quantum")
def make_quantum_move():
    data = request.get_json(silent=True) or {}
    cell_a = data.get("cellA")
    cell_b = data.get("cellB")
    result = engine.make_quantum_move(cell_a, cell_b)
    if not result["ok"]:
        return jsonify(result), 400
    return jsonify(result)

@game_routes.post("/collapse")
def collapse_board():
    result = engine.collapse_board()
    if not result["ok"]:
        return jsonify(result), 400
    return jsonify(result)

@game_routes.get("/circuit")
def get_circuit():
    payload = engine.get_circuit_payload()
    return jsonify(payload)

@game_routes.post("/ai/move")
def ai_move():
    data = request.get_json(silent=True) or {}
    player = data.get("player")
    result = engine.make_ai_move(player, find_best_move)
    if not result["ok"]:
        return jsonify(result), 400
    return jsonify(result)
