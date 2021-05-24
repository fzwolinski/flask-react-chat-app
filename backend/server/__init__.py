from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SECRET_KEY'] = "somesecret"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

socket = SocketIO(app, cors_allowed_origins="*")

from server import models
from server import sockets

