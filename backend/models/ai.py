from typing import List, Optional

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

def find_best_move(board: List[Optional[str]], player: str) -> Optional[int]:
    opponent = "O" if player == "X" else "X"

    def winner_check(b):
        for a, b_idx, c in WIN_LINES:
            line = [b[a], b[b_idx], b[c]]
            if line[0] and line.count(line[0]) == 3:
                return line[0]
        return None

    def minimax(b, is_maximizing):
        winner = winner_check(b)
        if winner == player:
            return 1
        if winner == opponent:
            return -1
        if all(cell is not None for cell in b):
            return 0

        if is_maximizing:
            best = -2
            for idx in range(9):
                if b[idx] is None:
                    b[idx] = player
                    score = minimax(b, False)
                    b[idx] = None
                    best = max(best, score)
            return best

        best = 2
        for idx in range(9):
            if b[idx] is None:
                b[idx] = opponent
                score = minimax(b, True)
                b[idx] = None
                best = min(best, score)
        return best

    best_score = -2
    best_move = None
    for idx in range(9):
        if board[idx] is None:
            board[idx] = player
            score = minimax(board, False)
            board[idx] = None
            if score > best_score:
                best_score = score
                best_move = idx

    return best_move
