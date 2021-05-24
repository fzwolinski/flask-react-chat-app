from server import db

class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(40), unique=True, nullable=False)
  sid = db.Column(db.String(40), unique=True, nullable=True)
  sess_id = db.Column(db.String(36), unique=True, nullable=False)

  def __init__(self, username, sid, sess_id):
    self.username = username
    self.sid = sid
    self.sess_id = sess_id