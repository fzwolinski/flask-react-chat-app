from flask import Flask, request
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)

app.config['SECRET_KEY'] = "somesecret"

socket = SocketIO(app, cors_allowed_origins="*")

# Default values for testing
rooms = {
    "some-room-name": {
        "some-username": {
          "sid": "some-session-id",
        },
    },
}

@socket.on('message')
def handle_message(msg):
  print(f"[Message]: {msg}")
  send(msg, broadcast = True)

@socket.on('SET_USERNAME')
def handle_set_username(data):
  global rooms

  usrname = data.get("username")
  room = data.get("room")
  sid = request.sid

  if usrname is None or room is None:
    # Some Error
    emit('SET_USERNAME_STATUS', {'ok': False, "username": "", "msg": "Something went wrong!"}, room=sid)
    return

  # check if such room exists
  if rooms.get(room) is None:
    # No such room
    emit('SET_USERNAME_STATUS', {'ok': False, "username": "", "msg": "Room doesn't exist!"}, room=sid)
    return
  
  # check if username in that room is not taken
  if rooms.get(room).get(usrname) is not None:
    # Username is taken
    emit('SET_USERNAME_STATUS', {'ok': False, "username": "", "msg": "Username is taken!"}, room=sid)
    return
  
  # Add user to room
  rooms[room][usrname] = {
    "sid": sid
  }
  emit('SET_USERNAME_STATUS', {'ok': True, "username": usrname, "msg": "Username has been set!"}, room=sid)


if __name__ == "__main__":
  socket.run(app, debug=True)