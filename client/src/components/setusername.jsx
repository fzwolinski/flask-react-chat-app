import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
 
import { v4 as uuidv4 } from 'uuid';

const SetUsername = ({socket}) => {
  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem("sess_id") != null) {
      socket.emit("CHECK_USERNAME_BY_SESS_ID", {"sess_id": localStorage.getItem("sess_id")});
    }
    
    socket.on("CHECK_USERNAME", (data) => {
      if (data["ok"] === true) {
        history.push("/")
      } else {
        console.log("Invalid sess_id");
      }
    });

    socket.on("SET_USERNAME_STATUS", (data) => {
      if (data["ok"] === true) {
        localStorage.setItem('sess_id', data["sess_id"]);
        history.push("/");
      }
      console.log(data["msg"])
    });
  }, []);

  let form_username = React.createRef();

  const handleSetUsername = (e) => {
    e.preventDefault();
    socket.emit("SET_USERNAME", {"username": form_username.current.value, "sess_id": uuidv4()});
  };

  return (
    <form onSubmit={handleSetUsername}>
      <input ref={form_username} type="text" />
      <button>Set Username</button>
    </form>
  );
}

export default SetUsername;
