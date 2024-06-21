from flask import Flask, request, render_template
from flask_socketio import SocketIO, send

server = Flask(__name__)
socketio = SocketIO(server)

@server.route("/")
def main():
    return render_template("chat.html")

@server.route("/overlay")
def overlay():
    return render_template("overlay.html")

@socketio.on('message')
def handle_message(message):
    print(f'Received message: {message}')
    send(message, broadcast=True)

if __name__ == "__main__":
    socketio.run(server, debug=True)