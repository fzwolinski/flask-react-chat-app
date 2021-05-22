import { Route, Switch } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Home from './components/home';
import ChatRoom from './components/chatroom';

import './App.css';

function App() {
  return (
      <div>
        <Link to="/">Room List</Link>
        <Switch>
          <Route path="/room/:roomName" component={ChatRoom} />
          <Route path="/" component={Home} />
        </Switch>
      </div>
  );
}

export default App;
