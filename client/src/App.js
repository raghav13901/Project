import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Routing
import PrivateRoute from "./components/routing/PrivateRoute";

// Screens
import PrivateScreen from "./components/screens/PrivateScreen";
import LoginScreen from "./components/screens/LoginScreen";
import RegisterScreen from "./components/screens/RegisterScreen";
import Home from "./components/pages/home";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Switch>
          <PrivateRoute exact path="/" component={PrivateScreen} />
          <Route exact path="/login" component={LoginScreen} />
          <Route path="/home/:id/:query" component={Home} />
          <Route path="/home/:id/" component={Home} />
          <Route exact path="/register" component={RegisterScreen} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
