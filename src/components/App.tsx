import Router from "components/Router";
import { authService, onAuthChanged, updateProfile } from "fbase";
import { User } from "firebase/auth";
import { relative } from "path/posix";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Footer = styled.footer`
  position: absolute;
  bottom: 0;
  padding-bottom: 50px;
  width: 100%;
  text-align: center;
  height: 3.5rem;
`;
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
      } else {
        setUserObj({} as User);
        setReUserObj({} as IReUser);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;

    if (user) {
      console.log(user.photoURL);
      setUserObj(user);
      setReUserObj({ displayName: user.displayName || "" });
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "90vh" }}>
      <div style={{ paddingBottom: "5rem" }}>
        {init ? (
          <Router
            isLoggedIn={Object.keys({ ...userObj }).length > 0}
            userObj={userObj}
            refreshUser={refreshUser}
          />
        ) : (
          "Initializing..."
        )}
      </div>
      <Footer>&copy; {new Date().getFullYear()} Nwitter </Footer>
    </div>
  );
}

export default App;
