import React from "react";
import ChatroomNavigation from "../components/ChatroomNavigation/ChatroomNavigation";

const withChatBar = (Component) => (props) => (
  <div
    style={{
      display: "flex",
      flex: "column",

      padding: "5px",
    }}
  >
    <div
      style={{
        width: "250px",
        minWidth: "250px",
      }}
    >
      <ChatroomNavigation />
    </div>
    <main>
      <Component {...props} />
    </main>
  </div>
);

export default withChatBar;
