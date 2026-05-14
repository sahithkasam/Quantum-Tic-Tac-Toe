import os

from flask import Flask
from flask_cors import CORS

from routes.game_routes import game_routes

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(game_routes, url_prefix="/api")
    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("FLASK_PORT", "5001"))
    app.run(host="0.0.0.0", port=port, debug=True)
