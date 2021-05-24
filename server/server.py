from flask import Flask, request
from flask_socketio import SocketIO, send, emit, join_room

app = Flask(__name__)

app.config['SECRET_KEY'] = "somesecret"

socket = SocketIO(app, cors_allowed_origins="*")

# Default values for testing
users = {
  "some-username": {
    "sid": "some-sid",
    "sess_id": "sadasda",
  },
}

@socket.on('message')
def handle_message(data):
  print(f"[Message]: {data.get('msg')}")
  for user in users:
    if users.get(user).get("sess_id") == data.get("sess_id"):
      send({"ok": True, "msg": data.get("msg"), "username": user}, room = data.get("room"))
      return
  send({"ok": False, "msg": "No user with such sess_id", "username": ""}, room = data.get("room"))


@socket.on('join')
def on_join(data):
  room = data.get("room")
  join_room(room)

@socket.on('SET_USERNAME')
def handle_set_username(data):
  global users

  username = data.get("username")
  sess_id = data.get("sess_id")
  sid = request.sid

  if username is None:
    # Some Error
    emit('SET_USERNAME_STATUS', {'ok': False, "username": "", "msg": "Something went wrong!"}, room=sid)
    return

  # check if username in that room is not taken
  if users.get(username) is not None:
    # Username is taken
    emit('SET_USERNAME_STATUS', {'ok': False, "username": "", "msg": "Username is taken!"}, room=sid)
    return
  
  # Add user to room
  users[username] = {
    "sid": sid,
    "sess_id": sess_id
  }
  
  emit('SET_USERNAME_STATUS', {'ok': True, "username": username, "msg": "Username has been set!", "sess_id": sess_id}, room=sid)

@socket.on('CHECK_USERNAME_BY_SESS_ID')
def handle_check_username_by_sess_id(data):
  for user in users:
    if users.get(user).get("sess_id") == data.get("sess_id"):
      # User with given sess_id exists
      emit('CHECK_USERNAME', {'ok': True, "username": user}, room=request.sid)
      return
  emit('CHECK_USERNAME', {'ok': False, "username": "", "msg": "Invalid sess_id."}, room=request.sid)

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