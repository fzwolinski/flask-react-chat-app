from flask import Flask
from flask_socketio import SocketIO, send

app = Flask(__name__)

app.config['SECRET_KEY'] = "somesecret"

socket = SocketIO(app, cors_allowed_origins="*")

@socket.on('message')
def handle_message(msg):
  print(f"[Message]: {msg}")
  send(msg, broadcast = True)


if __name__ == "__main__":
  socket.run(app, debug=True)