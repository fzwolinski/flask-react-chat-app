import { Button, Container, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { setUsername } from "../styles/setusername";

const SetUsername = ({ socket, history }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  let isLoggedIn = false;
  useEffect(() => {
    if (localStorage.getItem("sess_id") != null) {
      socket.emit("CHECK_USERNAME_BY_SESS_ID", {
        sess_id: localStorage.getItem("sess_id"),
      });
    }

    socket.on("CHECK_USERNAME", (data) => {
      if (data["ok"] === true) {
        // User is set, update possible
        setLoggedIn(true);
        isLoggedIn = true;
      } else {
        setLoggedIn(false);
        isLoggedIn = false;
      }
    });

    socket.on("SET_USERNAME_STATUS", (data) => {
      if (data["ok"] === true) {
        localStorage.setItem("sess_id", data["sess_id"]);
        // Redirect
        if (
          history.location !== undefined &&
          history.location.state !== undefined &&
          history.location.state.from !== undefined
        ) {
          history.push(history.location.state.from);
        } else {
          history.push("/");
        }
      }
      console.log(data["msg"]);
    });
  }, []);

  let form_username = React.createRef();

  const handleSetUsername = (e) => {
    e.preventDefault();
    if (isLoggedIn) {
      // Update
      socket.emit("SET_USERNAME", {
        username: form_username.current.value,
        sess_id: localStorage.getItem("sess_id"),
      });
    } else {
      socket.emit("SET_USERNAME", {
        username: form_username.current.value,
        sess_id: uuidv4(),
      });
    }
  };

  return (
    <Container style={setUsername.container} maxWidth="xs">
      <form noValidate autoComplete="off" onSubmit={handleSetUsername}>
        <TextField
          inputRef={form_username}
          id="standard-basic"
          label="Username"
          size="small"
        />
        <div style={setUsername.separateDiv}></div>

        {loggedIn ? (
          <Button type="submit" variant="contained" color="primary">
            Update Username
          </Button>
        ) : (
          <Button type="submit" variant="contained" color="primary">
            Set Username
          </Button>
        )}
      </form>
    </Container>
  );
};

export default SetUsername;
