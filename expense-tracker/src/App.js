import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import AuthForm from "./components/Auth/AuthForm";
import Welcome from "./page/Welcome";
import CompleteProfile from "./page/CompleteProfile";
import ChangePassword from "./page/ChangePassword";
import Navbar from "./components/Layout/Navbar";
import { Provider, useSelector } from "react-redux";
import store from './store/index';


function App() {

  const isAuth = useSelector(state =>state.auth.isAuthenticated);
  return (
    <Provider store = {store}>
      <BrowserRouter>
        <Navbar />
        <Switch>
          {!isAuth && <Route path="/auth" exact component={AuthForm} />}
          <Route path="/changepassword" component={ChangePassword} />

          {isAuth && (
            <Route path="/welcome" exact component={Welcome} />
          )}
          {isAuth && (
            <Route path="/completeprofile" component={CompleteProfile} />

          )}
          <Route path="*">
            <Redirect to="/auth" />
          </Route>
        </Switch>
      </BrowserRouter>
    </Provider>
  );
}


export default App;
