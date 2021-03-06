from flask import request
from flask_socketio import send, emit, join_room
from server import socket, db
from server.models import User, Room
from datetime import datetime
import pytz

@socket.on('message')
def handle_message(data):
  print(f"[Message]: {data.get('msg')}")
  user = User.query.filter_by(sess_id=data.get("sess_id")).first()
  time_now = datetime.now(pytz.timezone('Poland')).strftime("%H:%M:%S")

  if user:
    # Everything correct
    send({"ok": True, "msg": data.get("msg"), "username": user.username, "time": time_now}, room = data.get("room"))
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

  # check if username is not taken
  if User.query.filter_by(username=username).first():
    # Username is taken
    emit('SET_USERNAME_STATUS', {'ok': False, "username": "", "msg": "Username is taken!"}, room=sid)
    return 
 
  User.query.filter_by(sid=sid).delete()
  User.query.filter_by(sess_id=sess_id).delete()

  # Add user to database
  usr = User(username, sid, sess_id)
  db.session.add(usr)
  db.session.commit()
  
  emit('SET_USERNAME_STATUS', {'ok': True, "username": username, "msg": "Username has been set!", "sess_id": sess_id}, room=sid)

@socket.on('CHECK_USERNAME_BY_SESS_ID')
def handle_check_username_by_sess_id(data):
  user = User.query.filter_by(sess_id=data.get("sess_id")).first()
  if user:
    # User with given sess_id exists
    emit('CHECK_USERNAME', {'ok': True, "username": user.username}, room=request.sid)
    return
  emit('CHECK_USERNAME', {'ok': False, "username": "", "msg": "Invalid sess_id."}, room=request.sid)

@socket.on('ADD_ROOM')
def handle_add_room(data):
  room_name = data.get("room_name").title()

  # Check if room with that name already exists
  if Room.query.filter_by(name=room_name).first():
    # Room exists, can not create room with the same name
    emit('ADD_ROOM_STATUS', {'ok': False, "room_name": "", "msg": "A room with that name already exists"}, room=request.sid)
    return

  # Add new room
  room = Room(room_name)
  db.session.add(room)
  db.session.commit()
  print("\n\nROOM HAS BEEN ADDED\n\n");

  emit('ADD_ROOM_STATUS', {'ok': True, "room_name": room_name, "msg": "Room has been created"}, room=request.sid)


# TODO
@socket.on('disconnect')
def handle_disconnect():
  # Remove user by sid
  print("\n\nDISCONNECTED\n\n")