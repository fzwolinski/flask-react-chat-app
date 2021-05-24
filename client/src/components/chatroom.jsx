import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import ChatComment from "./chatcomment";

const socket = io.connect("http://127.0.0.1:5000");

const ChatRoom = ({ match }) => {
  const [response, setResponse] = useState([
    {
      time: "07:23:02",
      username: "User1",
      msg: "This is an example comment",
    },
    {
      time: "07:24:22",
      username: "Mariusz",
      msg: "Hello Thereadjasuidhasudhasdhasuhdiauhdiahdahsdahdhadohasdhausdhasuidhasudhasuidhuasidhsauhd",
    },
  ]); // TODO Delete default msg's
  const [username, setUsername] = useState("");
  const history = useHistory();

  useEffect(() => {
    socket.emit("join", { room: match.params.roomName });

    if (localStorage.getItem("sess_id") != null) {
      socket.emit("CHECK_USERNAME_BY_SESS_ID", {
        sess_id: localStorage.getItem("sess_id"),
      });
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
        setResponse((oldArr) => [
          ...oldArr,
          {
            time: data["time"],
            username: data["username"],
            msg: data["msg"],
          },
        ]);
      } else {
        console.log(data["msg"]);
      }
    });
  }, []);

  let form_msg = React.createRef();

  const handleSetUsername = (e) => {
    e.preventDefault();
    history.push("/username", { from: "/room/some-room-name" });
  };

  const handleSendMsgSubmit = (e) => {
    e.preventDefault();
    socket.send({
      msg: form_msg.current.value,
      sess_id: localStorage.getItem("sess_id"),
      room: match.params.roomName,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {!username ? <div></div> : <h1>Hello {username}</h1>}

      <ul style={{ maxWidth: 500 }}>
        {response.map((item) => (
          <ChatComment
            key={item.time + item.username + item.msg}
            time={item.time}
            username={item.username}
            msg={item.msg}
          />
        ))}
      </ul>

      {username ? (
        <form onSubmit={handleSendMsgSubmit}>
          <input ref={form_msg} id="chat-msg" type="text" />
          <button>Send</button>
        </form>
      ) : (
        <button onClick={handleSetUsername}>First Set Username</button>
      )}
    </div>
  );
};

export default ChatRoom;
