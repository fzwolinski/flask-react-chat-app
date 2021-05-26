from server import app, socket, db

if __name__ == "__main__":
  db.create_all()
  socket.run(app, debug=True)
