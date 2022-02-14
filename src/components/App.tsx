import Router from "components/Router";
import { authService, onAuthChanged, updateProfile } from "fbase";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";

interface IReUser {
  displayName?: string;
  photoURL?: string;
}
function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState<User>();
  const [reUserObj, setReUserObj] = useState<IReUser>();
  useEffect(() => {
    onAuthChanged(authService, (user) => {
      if (user) {
        setUserObj(user);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    if (user) {
      setUserObj(user);
      setReUserObj({ displayName: user.displayName || "" });
    }
  };

  return (
    <>
      {init ? (
        <Router
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
          refreshUser={refreshUser}
        />
      ) : (
        "Initializing..."
      )}
      <footer>&copy; {new Date().getFullYear()} Nwitter </footer>
    </>
  );
}

export default App;
