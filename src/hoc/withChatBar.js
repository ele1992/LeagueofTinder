import React from "react";
// import ChatBarPlayerInfo from "../components/ChatBarPlayerInfo";
import ChatroomNavigation from "../components/ChatroomNavigation";

const withChatBar = (Component) => (props) => (
  <div
    style={{
      display: "flex",
      flex: "column",

      padding: "5px",
    }}
  >
    <div style={{ width: "250px", minWidth: "250px" }}>
      {/* <ChatBarPlayerInfo /> */}
      <ChatroomNavigation />
    </div>
    <main>
      <Component {...props} />
    </main>
  </div>
);

export default withChatBar;
