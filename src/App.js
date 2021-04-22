import Signup from "./components/Signup";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import LoLInfoPage from "./components/LoLInfoPage";
import PlayerPage from "./components/PlayerPage";
import Chatroom from "./components/Chatroom";
import withChatBar from "./hoc/withChatBar";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <UserProvider>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <PrivateRoute
                path="/players/:uid"
                component={withChatBar(PlayerPage)}
              />
              <PrivateRoute
                path="/chat/:room"
                component={withChatBar(Chatroom)}
                exact
              />
              <PrivateRoute path="/lolinfo" component={LoLInfoPage} />
              <PrivateRoute path="/" component={withChatBar(Dashboard)} exact />
            </Switch>
          </UserProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
