import { useEffect, useState } from "react";
import Home from "./Home";
import Login from "./Login";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { auth } from "./FirebaseConfig";
import SignUp from "./SignUp";
import Profile from "./Profile";
import Header from "./Header";
import BottomNav from "./BottomNav";
function App() {
  const [username, setUsername] = useState();
  const [user, setUser] = useState();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) =>
      authUser ? setUser(authUser) : setUser()
    );
    return () => unsubscribe();
  }, [username]);
  const isUser = (disName) => {
    setUsername(disName);
  };
  return (
    <div className="App">
      <BrowserRouter>
        <Header user={user} />
        <Switch>
          <Route exact path="/">
            <Home user={user} />
          </Route>
          <Route exact path="/login">
            <Login isUser={isUser} />
          </Route>
          <Route exact path="/signup">
            <SignUp isUser={isUser} />
          </Route>
          <Route exact path="/profile">
            <Profile user={user} />
          </Route>
        </Switch>
        {user ? (
          window.location.pathname === "/login" ||
          window.location.pathname === "/signup" ? null : (
            <BottomNav user={user} />
          )
        ) : null}
      </BrowserRouter>
    </div>
  );
}

export default App;
