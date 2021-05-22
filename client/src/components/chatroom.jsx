import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io.connect("http://127.0.0.1:5000");

const ChatRoom = ( {match} ) => {
  const [response, setResponse] = useState(["msg1", "msg2"]); // TODO Delete default msg's
  const [username, setUsername] = useState("");
  let usr = "";

  useEffect(() => {
    // socket.on("connect", () => {
    //   socket.send("User has connected");
    // });

    socket.on("message", (msg) => {
      setResponse(oldArr => [...oldArr, usr + ": " + msg]);
    });

    socket.on("SET_USERNAME_STATUS", (data) => {
      if (data["ok"] === true) {
        setUsername(data["username"]);
        usr = data["username"];
        // TODO: Add to localstorage
      }
    });

  }, []);

  let form_msg = React.createRef();
  let form_username = React.createRef();

  const handleSetUsername = (e) => {
    e.preventDefault();
    socket.emit("SET_USERNAME", {"username": form_username.current.value, "room": match.params.roomName});
  };
  
  const handleSendMsgSubmit = (e) => {
    e.preventDefault();
    socket.send(form_msg.current.value);
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
