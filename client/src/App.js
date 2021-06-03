import { Button, Container, Divider } from "@material-ui/core";

import { Route, Switch, useHistory } from "react-router-dom";
import io from "socket.io-client";
import "./App.css";
import ChatRoom from "./components/chatroom";
import Home from "./components/home";
import SetUsername from "./components/setusername";
import { AppStyle } from "./styles/app";
import { useState } from "react";
import InfoAlert from "./components/infoalert";

const socket = io.connect("http://127.0.0.1:5000");

function App() {
  const history = useHistory();
  const [alert, setAlert] = useState([]);

  const showAlert = (msg, type) => {
    setAlert([true, msg, type]);
  };

  return (
    <Container style={AppStyle.container} maxWidth="md">
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          history.push("/");
        }}
        style={AppStyle.roomListBtn}
      >
        Room List
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => {
          history.push("/username");
        }}
        style={AppStyle.roomListBtn}
      >
        Change Username
      </Button>
      <Divider />
      <Container style={AppStyle.roomsContainer} maxWidth="md">
        <Switch>
          <Route
            path="/username"
            render={(props) => (
              <SetUsername socket={socket} showAlert={showAlert} {...props} />
            )}
          />
          <Route
            path="/room/:roomName"
            render={(props) => (
              <ChatRoom socket={socket} showAlert={showAlert} {...props} />
            )}
          />
          <Route
            path="/"
            render={(props) => (
              <Home socket={socket} showAlert={showAlert} {...props} />
            )}
          />
        </Switch>
      </Container>

      {/* Info Snackbar */}
      <InfoAlert alert={alert} setAlert={setAlert} />
    </Container>
  );
}

export default App;
