from server import app
from server.models import Room

@app.route("/rooms")
def get_rooms():
  rooms = Room.query.all()
  response = {
    "rooms": []
  }

  for room in rooms:
    response["rooms"].append(
      {
        "room_name": room.name,
        "url": (room.name).replace(" ", "-").lower()
      }
    )

  return (response)