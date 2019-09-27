import os

from flask import Flask, render_template, url_for, jsonify, request
from flask_socketio import SocketIO, emit
import json
import time
from pprint import pprint

# temporary application data with more detail{

messages = {
    "users": ["Delabere", "Leng", "George"],
    "rooms": {
        "Welcome!": [{
            "user": "Delabere",
            "message": "Welcome to this chatroom!",
            "timestamp": "27/09/2019 11:35"
        },
            {
                "user": "Delabere",
                "message": "This is going to be a lot of fun...",
                "timestamp": "27/09/2019 11:36"
            }
        ],
        "Channel 2": [{
            "user": "Delabere",
            "message": "test message",
            "timestamp": "27/09/2019 11:35"
        }]
    }
}



app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


@app.route("/start")
def home():
    return render_template('start.html')

@app.route("/", methods=['GET', 'POST'])
@app.route("/chat", methods=['GET', 'POST'])
def index():
    with open('data.json', mode='r') as f:
        data = json.load(f)
    return render_template('chat.html', data=data)

@app.route("/get_history", methods=['POST'])
def get_history():
    chat_room = request.form.get("chat_room")
    return jsonify(messages['rooms'][chat_room])

@socketio.on("send message")
def vote(data):
    # message = data['message']
    # chat_room = data['chat_room']
    # messages.append(message)
    # messages['rooms'][chat_room]['user'] = user   # todo: add the user information
    pprint(messages['rooms'][data['chat_room']])
    record = {
        "user": "Delabere",  # todo: hardcoded user for now
        "message": data['message'],
        "timestamp": time.strftime('%d/%m/%Y %T')
    }
    messages['rooms'][data['chat_room']].append(record)
    record['chat_room'] = data['chat_room']
    emit("all messages", record, broadcast=True)


# if not run like this then SocketIO error is raised
if __name__ == "__main__":
    socketio.run(app)
