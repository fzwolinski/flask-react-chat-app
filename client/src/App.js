import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import logo from './logo.svg';
import './App.css';

const socket = io.connect("http://127.0.0.1:5000");

function App() {
  const [response, setResponse] = useState([""]);

  useEffect(() => {
    // socket.on("connect", () => {
    //   socket.send("User has connected");
    // });

    socket.on("message", (msg) => {
      console.log("New message: " + msg);

      setResponse(oldArr => [...oldArr, msg]);
    });

  }, []);

  let form_msg = React.createRef();
  
  const handleSendMsgSubmit = (e) => {
    e.preventDefault();
    socket.send(form_msg.current.value);
  };

  return (
      <div className="App">
        <ul>
          {response.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <form onSubmit={handleSendMsgSubmit}>
          <input ref={form_msg} id="chat-msg" type="text" />
          <button>Send</button>
        </form>
      </div>
  );
}

export default App;
