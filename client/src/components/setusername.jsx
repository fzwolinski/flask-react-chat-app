import { Button, Container, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { SetUsernameStyle } from "../styles/setusername";
import { setUsernameFormValidated } from "../utils/formValidator";

const SetUsername = ({ socket, history }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [formErr, setFormErr] = useState([]);

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
    setFormErr([]);

    var formCorrect, err;
    var vResponse = setUsernameFormValidated(
      form_username.current.value.trim()
    );
    [formCorrect, err] = vResponse;

    setFormErr(err);

    if (formCorrect === false) {
      return;
    }

    if (isLoggedIn) {
      // Update username
      socket.emit("SET_USERNAME", {
        username: form_username.current.value.trim(),
        sess_id: localStorage.getItem("sess_id"),
      });
    } else {
      // Set username
      socket.emit("SET_USERNAME", {
        username: form_username.current.value.trim(),
        sess_id: uuidv4(),
      });
    }
  };

  return (
    <Container style={SetUsernameStyle.container} maxWidth="xs">
      <form noValidate autoComplete="off" onSubmit={handleSetUsername}>
        <TextField
          inputRef={form_username}
          id="standard-basic"
          label="Username"
          size="small"
        />
        <div style={SetUsernameStyle.separateDiv}></div>

        {loggedIn ? (
          <Button type="submit" variant="contained" color="primary">
            Update Username
          </Button>
        ) : (
          <Button type="submit" variant="contained" color="primary">
            Set Username
          </Button>
        )}

        <ul style={SetUsernameStyle.formErrMsgUl}>
          {formErr.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      </form>
    </Container>
  );
};

export default SetUsername;
