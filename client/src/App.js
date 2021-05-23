import { Route, Switch } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SetUsername from './components/setusername';
import Home from './components/home';
import ChatRoom from './components/chatroom';
import io from "socket.io-client";


import './App.css';

const socket = io.connect("http://127.0.0.1:5000");

function App() {
  return (
      <div>
        <Link to="/">Room List</Link>
        <Switch>
          <Route 
            path="/username" 
            render={(props) => <SetUsername socket={socket} {...props} />}  />
          <Route path="/room/:roomName" component={ChatRoom} />
          <Route path="/" component={Home} />
        </Switch>
      </div>
  );
}

export default App;
