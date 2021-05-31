import { Button, Divider, TextField } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { ChatRoomStyle } from "../styles/chatroom";
import ChatComment from "./chatcomment";

const ChatRoom = ({ match, socket }) => {
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
    <div style={ChatRoomStyle.wrapperDiv}>
      {!username ? (
        <div></div>
      ) : (
        <h1>
          <span style={ChatRoomStyle.helloHeader}>Hello</span>{" "}
          <span style={ChatRoomStyle.usernameHeader}>{username}</span>
        </h1>
      )}

      <ul style={ChatRoomStyle.msgUlList}>
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

      <Divider style={ChatRoomStyle.chatInputDivider} />

      {username ? (
        <form style={ChatRoomStyle.msgForm} onSubmit={handleSendMsgSubmit}>
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
            style={ChatRoomStyle.sendMsgBtn}
            type="submit"
            variant="contained"
            color="primary"
          >
            Send!
          </Button>
        </form>
      ) : (
        <Button
          style={ChatRoomStyle.setUsrBtn}
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
