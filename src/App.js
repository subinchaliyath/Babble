import { useEffect, useState } from "react";
import Home from "./Home";
import Login from "./Login";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { auth } from "./FirebaseConfig";
import SignUp from "./SignUp";
const App = () => {
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
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
