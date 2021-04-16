import React from "react";

const withChatBar = (Component) => (props) => (
  <div style={{ display: "flex" }}>
    <aside>Chat bar</aside>
    <main>
      <Component {...props} />
    </main>
  </div>
);

export default withChatBar;
