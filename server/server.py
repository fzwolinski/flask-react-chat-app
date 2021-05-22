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
  # Get user by sid
  for _, user in rooms.items():
    for u in user:
      if request.sid == user.get(u).get('sid'):
        send({"msg": msg, "username": u}, broadcast = True)
        return

  

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
  emit('SET_USERNAME_STATUS', {'ok': True, "username": usrname, "msg": "Username has been set!", "sid": sid}, room=sid)

@socket.on('GET_USERNAME_IF_SID')
def handle_get_username_if_sid(data):
  # Gets username by sid
  for room, user in rooms.items():
    for u in user:
      if data.get("sid") == user.get(u).get('sid') and data.get("room") == room:
        # Send username
        emit('GET_USERNAME', {'ok': True, "username": u}, room=request.sid)
        return


@socket.on('disconnect')
def handle_disconnect():
  # Remove user by sid
  for room, user in rooms.items():
    for u in user:
      if request.sid == user.get(u).get('sid'):
        del rooms[room][u]
        print(f"\n\nUSER {u} REMOVED from ROOM {room}\n\n")
        return
  
@socket.on('DDDD')
def handle_disconnect():
  print("\n\nDISCONNECT\n\n")

if __name__ == "__main__":
  socket.run(app, debug=True)