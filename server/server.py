from flask import Flask, request
from flask_socketio import SocketIO, send, emit, join_room
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SECRET_KEY'] = "somesecret"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

socket = SocketIO(app, cors_allowed_origins="*")

class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(40), unique=True, nullable=False)
  sid = db.Column(db.String(40), unique=True, nullable=True)
  sess_id = db.Column(db.String(36), unique=True, nullable=False)

  def __init__(self, username, sid, sess_id):
    self.username = username
    self.sid = sid
    self.sess_id = sess_id

@socket.on('message')
def handle_message(data):
  print(f"[Message]: {data.get('msg')}")
  user = User.query.filter_by(sess_id=data.get("sess_id")).first()
  if user:
    # Everything correct
    send({"ok": True, "msg": data.get("msg"), "username": user.username}, room = data.get("room"))
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
  
# TODO
@socket.on('disconnect')
def handle_disconnect():
  # Remove user by sid
  print("\n\nDISCONNECTED\n\n")

if __name__ == "__main__":
  db.create_all()
  socket.run(app, debug=True)
