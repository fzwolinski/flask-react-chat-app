import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import io from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';

const socket = io.connect("http://127.0.0.1:5000");

const ChatRoom = ( {match} ) => {
  const [response, setResponse] = useState(["msg1", "msg2"]); // TODO Delete default msg's
  const [username, setUsername] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem("sess_id") != null) {
      socket.emit("CHECK_USERNAME_BY_SESS_ID", {"sess_id": localStorage.getItem("sess_id")});
      socket.emit("join", { 'room': match.params.roomName });
    }
    
    socket.on("CHECK_USERNAME", (data) => {
      if (data["ok"] === true) {
        setUsername(data["username"]);
      } else {
        console.log(data["msg"]);
      }
    });

    socket.on("message", (data) => {
      if (data["ok"] === true) {
        setResponse(oldArr => [...oldArr, data["username"] + ": " + data["msg"]]);
      } else {
        console.log(data["msg"]);
      }
    });
  }, []);

  let form_msg = React.createRef();

  const handleSetUsername = (e) => {
    e.preventDefault();
    history.push('/username', { from: "/room/some-room-name" } );
  };
  
  const handleSendMsgSubmit = (e) => {
    e.preventDefault();
    socket.send({"msg": form_msg.current.value, "sess_id": localStorage.getItem("sess_id"), 'room': match.params.roomName});
  };

  return (
    <div>
      { !username ? (
        <div></div>        
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
          <button onClick={handleSetUsername}>First Set Username</button>
        )}
      </div>
    </div>
  );
}

export default ChatRoom;
