import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { User } from "firebase/auth";
import React from "react";
import { Link } from "react-router-dom";
interface INavigation {
  userObj: User;
}
const Navigation = ({ userObj }: INavigation) => {
  return (
    <nav>
      <ul style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <li>
          <Link style={{ marginRight: 10 }} to="/">
            <FontAwesomeIcon
              icon={faTwitter as IconProp}
              color={"#04AAFF"}
              size="2x"
            />
          </Link>
        </li>
        <li>
          <Link
            style={{
              marginLeft: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 12,
            }}
            to="/profile"
          >
            <FontAwesomeIcon
              icon={faUser as IconProp}
              color={"#04AAFF"}
              size="2x"
            />
            {userObj.displayName
              ? `${userObj.displayName}의 Profile`
              : "Profile"}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
