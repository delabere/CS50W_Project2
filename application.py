import os

from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import json



app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


@app.route("/start")
def home():
    return render_template('start.html')

@app.route("/")
@app.route("/chat")
def index():
    with open('data.json', mode='r') as f:
        data = json.load(f)
    return render_template('chat.html', data=data)

# if not run like this then SocketIO error is raised
if __name__ == "__main__":
    socketio.run(app)
