import React from "react";
import { ChatCommentStyle } from "../styles/chatcomment";

const ChatComment = ({ username, time, msg }) => {
  return (
    <li style={ChatCommentStyle.listElement}>
      <span>{time}</span>
      <div style={ChatCommentStyle.separateDiv}></div>
      <span style={ChatCommentStyle.usernameSpan}>{username}</span>
      <span>:</span>
      <div style={ChatCommentStyle.separateDiv}></div>
      <span>{msg}</span>
    </li>
  );
};

export default ChatComment;
