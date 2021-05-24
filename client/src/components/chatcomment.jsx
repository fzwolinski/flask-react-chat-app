import React from "react";

const ChatComment = ({ username, time, msg }) => {
  return (
    <li
      style={{
        listStyleType: "none",
        textAlign: "left",
        marginBottom: 10,
        overflowWrap: "break-word",
      }}
    >
      <span>{time}</span>
      <div style={{ marginLeft: 5, display: "inline-block" }}></div>
      <span style={{ fontWeight: "bold" }}>{username}</span>
      <span>:</span>
      <div style={{ marginLeft: 5, display: "inline-block" }}></div>
      <span>{msg}</span>
    </li>
  );
};

export default ChatComment;
