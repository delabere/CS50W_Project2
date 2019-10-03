import os
from flask import Flask, render_template, url_for, jsonify, request
from flask_socketio import SocketIO, emit
import json
import time


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


@app.route("/start")
def home():
    return render_template('start.html')


@app.route("/", methods=['GET', 'POST'])  # todo: move the default index root up to start
@app.route("/chat", methods=['GET', 'POST'])
def index():
    return render_template('chat.html')


@app.route("/get_rooms", methods=['POST'])
def get_rooms():
    with open('data.json', mode='r+') as f:
        data = json.load(f)
    return jsonify(data['chat_rooms'])


@app.route("/get_history", methods=['POST'])
def get_history():
    chat_room = request.form.get("chat_room")
    with open('data.json', mode='r+') as f:
        data = json.load(f)
    return jsonify(data['rooms'][chat_room])


@socketio.on("send message")
def vote(data):
    print(data)
    record = {"user": data['user'], "message": data['message'], "timestamp": time.strftime('%d/%m/%Y %T'),
              'chat_room': data['chat_room']}
    # messages['rooms'][data['chat_room']].append(record)
    emit("all messages", record, broadcast=True)
    # write chat data to json object
    with open('data.json', mode='r+') as f:
        chat_data = json.load(f)
        chat_data['rooms'][data['chat_room']].append(record)
    with open('data.json', mode='w+') as f:
        json.dump(chat_data, f)


# if not run like this then SocketIO error is raised
if __name__ == "__main__":
    socketio.run(app)
