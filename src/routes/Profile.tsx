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
import styled from "styled-components";
const Form = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.9);
  padding-bottom: 30px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
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
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          type="text"
          autoFocus
          onChange={onChange}
          value={newDisplayName || ""}
          placeholder="Display name"
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogoutClick}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;
