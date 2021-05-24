import React from "react";
import { Link } from "react-router-dom";

const Rooms = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/room/some-room-name">Some Room Name</Link>
        </li>
      </ul>
    </div>
  );
};

export default Rooms;
