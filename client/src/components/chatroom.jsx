import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';

const socket = io.connect("http://127.0.0.1:5000");

const ChatRoom = ( {match} ) => {
  const [response, setResponse] = useState(["msg1", "msg2"]); // TODO Delete default msg's
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (localStorage.getItem("sess_id") != null) {
      socket.emit("GET_USERNAME_IF_SESS_ID", {"sess_id": localStorage.getItem("sess_id"), "room": match.params.roomName});
    }
    
    socket.on("GET_USERNAME", (data) => {
      if (data["ok"] === true) {
        setUsername(data["username"]);
      } else {
        console.log("Invalid sess_id");
      }
    });

    socket.on("message", (data) => {
      setResponse(oldArr => [...oldArr, data["username"] + ": " + data["msg"]]);
    });

    socket.on("SET_USERNAME_STATUS", (data) => {
      if (data["ok"] === true) {
        setUsername(data["username"]);
        localStorage.setItem('sess_id', data["sess_id"]);
      }
      console.log(data["msg"])
    });
  }, []);

  let form_msg = React.createRef();
  let form_username = React.createRef();

  const handleSetUsername = (e) => {
    e.preventDefault();
    socket.emit("SET_USERNAME", {"username": form_username.current.value, "room": match.params.roomName, "sess_id": uuidv4()});
  };
  
  const handleSendMsgSubmit = (e) => {
    e.preventDefault();
    socket.send({"msg": form_msg.current.value, "sess_id": localStorage.getItem("sess_id")});
  };

  return (
    <div>
      { !username ? (
        <form onSubmit={handleSetUsername}>
          <input ref={form_username} type="text" />
          <button>Set Username</button>
        </form>
      ) : (<h1>Hello {username}</h1>)}
      
      <div className="ChatRoom">
        <ul>
          {response.map((item) => (
            <li key={item}>{item}</li> // TODO: change key to sth unique
          ))}
        </ul>
        { username ? ( 
          <form onSubmit={handleSendMsgSubmit}>
            <input ref={form_msg} id="chat-msg" type="text" />
            <button>Send</button>
          </form>
        ) : (
          <div>First Set Username</div>
        )}
      </div>
    </div>
  );
}

export default ChatRoom;
