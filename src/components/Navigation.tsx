import { User } from "firebase/auth";
import React from "react";
import { Link } from "react-router-dom";
interface INavigation {
  userObj: User;
}
const Navigation = ({ userObj }: INavigation) => {
  console.log("Navigation 렌더링.");
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">{userObj.displayName}님의 Profile</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
