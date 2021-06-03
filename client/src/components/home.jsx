import React from "react";
import Rooms from "./rooms";
import AddRoom from "./addroom";

const Home = ({ socket, showAlert }) => {
  return (
    <div>
      <AddRoom socket={socket} showAlert={showAlert} />
      <Rooms />
    </div>
  );
};

export default Home;
