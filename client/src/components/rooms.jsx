import { List, ListItem, ListItemText } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { rooms } from "../styles/rooms";

const Rooms = () => {
  return (
    <List component="nav" aria-label="secondary">
      <ListItem component={Link} to="/room/some-room-name" button>
        <ListItemText primary="Some Room" style={rooms.listItemText} />
      </ListItem>
    </List>
  );
};

export default Rooms;
