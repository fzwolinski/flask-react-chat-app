import React from "react";
import Rooms from "./rooms";
import AddRoom from "./addroom";

const Home = ({ socket }) => {
  return (
    <div>
      <AddRoom socket={socket} />
      <Rooms />
    </div>
  );
};

export default Home;
