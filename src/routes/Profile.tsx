import {
  authService,
  storeService,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  updateProfile,
} from "fbase";
import { User } from "firebase/auth";
import React, { FormEvent, useEffect, useState } from "react";

interface IProfile {
  userObj: User;
  refreshUser: Function;
}
const Profile = ({ refreshUser, userObj }: IProfile) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onLogoutClick = () => {
    authService.signOut();
  };
  const getMyNweets = async () => {
    const nweets = await getDocs(
      query(
        collection(storeService, "nweets"),
        where("creatorId", "==", userObj.uid),
        orderBy("createdAt", "desc")
      )
    );
  };
  useEffect(() => {
    getMyNweets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // 유저 displayN name 변경시에만 업데이트
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(userObj, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };

  const onChange = (event: FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setNewDisplayName(value);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          onChange={onChange}
          value={newDisplayName || ""}
          placeholder="Display name"
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogoutClick}>Logout</button>
    </div>
  );
};

export default Profile;
