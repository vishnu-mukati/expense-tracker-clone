import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AuthForm from "./components/Auth/AuthForm";
import Welcome from "./page/Welcome";
import CompleteProfile from "./page/CompleteProfile";
import ChangePassword from "./page/ChangePassword";
import Navbar from "./components/Layout/Navbar";
import { Provider, useSelector } from "react-redux";
import store from './store/index';
import { lightTheme, darkTheme } from "./theme/muiTheme";

function AppContent() {
  const isAuth = useSelector(state => state.auth.isAuthenticated);
  const isDarkTheme = useSelector(state => state.theme.isDarkTheme);
  const theme = isDarkTheme ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
    </ThemeProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
