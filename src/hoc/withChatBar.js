import React from "react";

const withChatBar = (Component) => (props) => (
  <div
    style={{
      display: "flex",
      flex: "column",

      padding: "5px",
    }}
  >
    <div style={{ width: "250px", minWidth: "250px" }}>
      <h2>Chats All Chatss</h2>
    </div>
    <main>
      <Component {...props} />
    </main>
  </div>
);

export default withChatBar;
