import { Button, Container, Divider } from "@material-ui/core";
import { Route, Switch, useHistory } from "react-router-dom";
import io from "socket.io-client";
import "./App.css";
import ChatRoom from "./components/chatroom";
import Home from "./components/home";
import SetUsername from "./components/setusername";
import { app } from "./styles/app";

const socket = io.connect("http://127.0.0.1:5000");

function App() {
  const history = useHistory();

  return (
    <Container style={app.container} maxWidth="md">
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          history.push("/");
        }}
        style={app.roomListBtn}
      >
        Room List
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => {
          history.push("/username");
        }}
        style={app.roomListBtn}
      >
        Change Username
      </Button>
      <Divider />
      <Container style={app.roomsContainer} maxWidth="md">
        <Switch>
          <Route
            path="/username"
            render={(props) => <SetUsername socket={socket} {...props} />}
          />
          <Route
            path="/room/:roomName"
            render={(props) => <ChatRoom socket={socket} {...props} />}
          />
          <Route path="/" component={Home} />
        </Switch>
      </Container>
    </Container>
  );
}

export default App;
