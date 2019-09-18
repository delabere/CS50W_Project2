import os

from flask import Flask
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


@app.route("/")
def index():
    return "Project 2: TODO"

# if not run like this then SocketIO error is raised
if __name__ == "__main__":
    socketio.run(app)
