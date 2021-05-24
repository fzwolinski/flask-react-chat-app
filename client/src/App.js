import { Button, Container, Divider } from "@material-ui/core";
import { Route, Switch, useHistory } from "react-router-dom";
import io from "socket.io-client";
import "./App.css";
import ChatRoom from "./components/chatroom";
import Home from "./components/home";
import SetUsername from "./components/setusername";

const socket = io.connect("http://127.0.0.1:5000");

function App() {
  const history = useHistory();

  return (
    <Container style={{ textAlign: "center" }} maxWidth="md">
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          history.push("/");
        }}
        style={{ marginBottom: 10, marginTop: 20 }}
      >
        Room List
      </Button>
      <Divider />
      <Container style={{ paddingTop: 100 }} maxWidth="md">
        <Switch>
          <Route
            path="/username"
            render={(props) => <SetUsername socket={socket} {...props} />}
          />
          <Route path="/room/:roomName" component={ChatRoom} />
          <Route path="/" component={Home} />
        </Switch>
      </Container>
    </Container>
  );
}

export default App;
