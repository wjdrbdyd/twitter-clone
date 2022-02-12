import { authService } from "fbase";
import React from "react";

const Profile = () => {
  const onLogoutClick = () => authService.signOut();
  return (
    <div>
      <button onClick={onLogoutClick}>Logout</button>
    </div>
  );
};

export default Profile;
