from flask import Flask
from lucy.core import Lucy

from .speech_recognition import SpeechRecognizer


def create_app():
    app = Flask(__name__)
    app.chatbot = Lucy()
    app.recognizer = SpeechRecognizer()

    from app.routes import bp as routes_bp
    app.register_blueprint(routes_bp)

    return app
