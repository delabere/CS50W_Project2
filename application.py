import os
from flask import Flask, render_template, url_for, jsonify, request
from flask_socketio import SocketIO, emit
import json
import time
import requests
import random


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# create data store if it doesn't exist
if os.path.exists('data.json'):
    pass
else:
    with open('data.json', mode='w+') as f:
        json.dump({"chat_rooms": [], "rooms": {}}, f)


def search_gif(text):
    """get a GIF that is similar to text sent"""
    payload = {'s': text, 'api_key': 'Z3paH5u96rp5UNFGIRLKp6uWIu8bSp8Z'}
    r = requests.get('http://api.giphy.com/v1/gifs/translate', params=payload)
    r = r.json()
    url = r['data']['images']['original']['url']

    return url


@app.route("/")
@app.route("/start")
def home():
    return render_template('start.html')


# todo: create something in first login view so not empty
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
    words = data['message'].split()
    x = random.randint(0, len(words) - 1)  # randomly grabs a word from the sentence
    keyword = words[x]
    print(keyword)
    if random.random() <= 0.4:
        gif_url = search_gif(keyword)
    else:
        gif_url = None
    record = {"user": data['user'], "message": data['message'], "timestamp": time.strftime('%d/%m - %H:%S'),
              'chat_room': data['chat_room'], 'gif_url': gif_url}
    emit("all messages", record, broadcast=True)
    # write chat data to json object
    with open('data.json', mode='r+') as f:
        chat_data = json.load(f)
        chat_data['rooms'][data['chat_room']].append(record)
    with open('data.json', mode='w+') as f:
        json.dump(chat_data, f)


@socketio.on("send room")
def create_room(data):
    new_room = data['new_room']

    # write chat data to json object
    with open('data.json', mode='r+') as f:
        chat_data = json.load(f)
        if data['new_room'] in chat_data['chat_rooms']:
            return False
        chat_data['chat_rooms'].append(new_room)
        chat_data['rooms'][new_room] = []
    with open('data.json', mode='w+') as f:
        json.dump(chat_data, f)

    emit("all rooms", data, broadcast=True)


# # if not run like this then SocketIO error is raised
# if __name__ == "__main__":
#     socketio.run(app)
