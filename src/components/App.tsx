import Router from "components/Router";
import { authService, onAuthChanged } from "fbase";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState<User>();
  useEffect(() => {
    onAuthChanged(authService, (user) => {
      if (user) {
        setUserObj(user);
      } else {
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? (
        <Router isLoggedIn={Boolean(userObj)} userObj={userObj} />
      ) : (
        "Initializing..."
      )}
      <footer>&copy; {new Date().getFullYear()} Nwitter </footer>
    </>
  );
}

export default App;
