import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import { TextField, Divider, Button } from "@material-ui/core";
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
      msg: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
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
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        console.log(data["msg"]);
      }
    });
  }, []);

  let form_msg = React.createRef();
  const messagesEndRef = useRef(null);

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
    form_msg.current.value = "";
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
      {!username ? (
        <div></div>
      ) : (
        <h1>
          <span style={{ fontWeight: 400 }}>Hello</span>{" "}
          <span style={{ color: "#FF6200", fontWeight: 700 }}>{username}</span>
        </h1>
      )}

      <ul
        style={{
          maxWidth: 500,
          minHeight: 300,
          maxHeight: 500,
          overflowY: "scroll",
          maxWidth: 500,
          marginBlockStart: 0,
          margin: 0,
          padding: 0,
          paddingInlineStart: 0,
          marginBlockEnd: 0,
        }}
      >
        {response.map((item) => (
          <ChatComment
            key={item.time + item.username + item.msg}
            time={item.time}
            username={item.username}
            msg={item.msg}
          />
        ))}

        <div ref={messagesEndRef} />
      </ul>

      <Divider
        style={{
          marginBottom: 15,
          marginTop: 5,
          width: "100%",
          maxWidth: 500,
        }}
      />

      {username ? (
        <form
          style={{ width: "100%", maxWidth: 500 }}
          onSubmit={handleSendMsgSubmit}
        >
          <TextField
            id="standard-full-width"
            placeholder="Message..."
            fullWidth
            inputRef={form_msg}
            margin="none"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            style={{ width: "100%", maxWidth: 500, marginTop: 8 }}
            type="submit"
            variant="contained"
            color="primary"
          >
            Send!
          </Button>
        </form>
      ) : (
        <Button
          style={{ width: "100%", maxWidth: 500, marginTop: 8 }}
          type="submit"
          variant="contained"
          color="secondary"
          onClick={handleSetUsername}
        >
          First Set Username
        </Button>
      )}
    </div>
  );
};

export default ChatRoom;
