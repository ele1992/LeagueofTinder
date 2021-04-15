import Signup from "./components/Signup";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import LoLInfoPage from "./components/LoLInfoPage";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <PrivateRoute path="/lolinfo" component={LoLInfoPage} />
            <PrivateRoute path="/" component={Dashboard} exact />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
