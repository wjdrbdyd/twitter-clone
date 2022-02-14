import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Navigation from "components/Navigation";
import Profile from "routes/Profile";
import { User } from "firebase/auth";
interface IRouter {
  refreshUser: Function;
  isLoggedIn: boolean;
  userObj?: User;
}
const Router = ({ refreshUser, isLoggedIn, userObj }: IRouter) => {
  return (
    <HashRouter>
      {isLoggedIn && <Navigation userObj={userObj as User} />}
      <div
        style={{
          maxWidth: 890,
          width: "100%",
          margin: "0 auto",
          marginTop: 80,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Routes>
          {isLoggedIn ? (
            <>
              <Route
                path="/"
                element={<Home userObj={userObj as User} />}
              ></Route>
              <Route
                path="/profile"
                element={
                  <Profile
                    refreshUser={refreshUser}
                    userObj={userObj as User}
                  ></Profile>
                }
              ></Route>
            </>
          ) : (
            <Route path="/" element={<Auth />}></Route>
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default Router;
