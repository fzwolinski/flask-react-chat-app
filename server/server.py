from flask import Flask, request
from flask_socketio import SocketIO, send, emit, join_room

app = Flask(__name__)

app.config['SECRET_KEY'] = "somesecret"

socket = SocketIO(app, cors_allowed_origins="*")

# Default values for testing
rooms = {
    "some-room-name": {
        "some-username": {
          "sid": "some-sid",
          "sess_id": "sadasda",
        },
    },
}

@socket.on('message')
def handle_message(data):
  print(f"[Message]: {data.get('msg')}")
  # Get user by sess_id
  for _, user in rooms.items():
    for u in user:
      if data.get("sess_id") == user.get(u).get('sess_id'):
        send({"msg": data.get("msg"), "username": u}, room = data.get("room"))
        return

@socket.on('join')
def on_join(data):
    room = data.get("room")
    join_room(room)

@socket.on('SET_USERNAME')
def handle_set_username(data):
  global rooms

  usrname = data.get("username")
  room = data.get("room")
  sess_id = data.get("sess_id")
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
    "sid": sid,
    "sess_id": sess_id
  }
  emit('SET_USERNAME_STATUS', {'ok': True, "username": usrname, "msg": "Username has been set!", "sess_id": sess_id}, room=sid)

@socket.on('GET_USERNAME_IF_SESS_ID')
def handle_get_username_if_sess_id(data):
  # Gets username by sess_id
  for room, user in rooms.items():
    for u in user:
      if data.get("sess_id") == user.get(u).get('sess_id') and data.get("room") == room:
        # Send username
        emit('GET_USERNAME', {'ok': True, "username": u}, room=request.sid)
        return
  emit('GET_USERNAME', {'ok': False, "username": ""}, room=request.sid)


# TODO
@socket.on('disconnect')
def handle_disconnect():
  # Remove user by sid
  print("\n\nDISCONNECTED\n\n")
"""
  for room, user in rooms.items():
    for u in user:
      if request.sid == user.get(u).get('sid'):
        del rooms[room][u]
        print(f"\n\nUSER {u} REMOVED from ROOM {room}\n\n")
        return
"""

if __name__ == "__main__":
  socket.run(app, debug=True)