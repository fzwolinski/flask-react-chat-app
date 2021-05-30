import React from "react";
import { chatComment } from "../styles/chatcomment";

const ChatComment = ({ username, time, msg }) => {
  return (
    <li style={chatComment.listElement}>
      <span>{time}</span>
      <div style={chatComment.separateDiv}></div>
      <span style={chatComment.usernameSpan}>{username}</span>
      <span>:</span>
      <div style={chatComment.separateDiv}></div>
      <span>{msg}</span>
    </li>
  );
};

export default ChatComment;
