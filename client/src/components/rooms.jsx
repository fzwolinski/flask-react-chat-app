import { List, ListItem, ListItemText } from "@material-ui/core";
import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RoomsStyle } from "../styles/rooms";

export default class Rooms extends Component {
  state = {
    rooms: [],
  };

  componentDidMount() {
    const roomListApiUrl = "http://127.0.0.1:5000/rooms";
    fetch(roomListApiUrl)
      .then((response) => response.json())
      .then((data) => this.setState({ rooms: data["rooms"] }));
  }

  render() {
    return (
      <div>
        <List component="nav" aria-label="secondary">
          <ListItem component={Link} to="/room/some-room-name" button>
            <ListItemText primary="Some Room" style={RoomsStyle.listItemText} />
          </ListItem>
        </List>

        {this.state.rooms.map((room) => (
          <List component="nav" aria-label="secondary">
            <ListItem component={Link} to={"/room/" + room.url} button>
              <ListItemText
                primary={room.room_name}
                style={RoomsStyle.listItemText}
              />
            </ListItem>
          </List>
        ))}
      </div>
    );
  }
}
