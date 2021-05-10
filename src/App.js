import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import LoLInfoPage from "./components/LoLInfoPage/LoLInfoPage";
import Chatroom from "./components/Chatroom/Chatroom";
import withChatBar from "./hoc/withChatBar";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./components/Homepage/HomePage";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <UserProvider>
            <Navbar />
            <Switch>
              <Route path="/" exact component={HomePage} />

              {/* <PrivateRoute
                path="/players/:uid"
                component={withChatBar(PlayerPage)}
              /> */}
              <PrivateRoute
                path="/chat/:room"
                component={withChatBar(Chatroom)}
                exact
              />
              <PrivateRoute path="/lolinfo" component={LoLInfoPage} />
              <PrivateRoute
                path="/dash"
                component={withChatBar(Dashboard)}
                exact
              />
            </Switch>
          </UserProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
