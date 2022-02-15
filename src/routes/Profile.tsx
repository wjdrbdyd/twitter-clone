import { v4 as uuidv4 } from "uuid";
import {
  authService,
  storeService,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  updateProfile,
  storageService,
  ref,
  uploadString,
  getDownloadURL,
} from "fbase";

import { User } from "firebase/auth";
import { Container, FormBtn, FormInput } from "GlobalStyle";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Form = styled.form`
  border-bottom: 1px solid rgba(255, 255, 255, 0.9);
  padding-bottom: 30px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoutBtn = styled(FormBtn)`
  cursor: pointer;
  background-color: tomato;
  margin-top: 50px;
`;
const Label = styled.label`
  position: relative;
  color: #04aaff;
  display: flex;
  justify-content: center;
  cursor: pointer;
  span {
    margin-right: 10px;
    font-size: 12px;
  }
`;
const ResetButton = styled(FormBtn)`
  border: none;
  background-color: #04aaff;
  margin-top: 10px;
  color: white;
`;
interface IProfile {
  userObj: User;
  refreshUser: Function;
}
const Profile = ({ refreshUser, userObj }: IProfile) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [newPhotoURL, setNewPhotoURL] = useState(userObj.photoURL);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onLogoutClick = () => {
    authService.signOut();
  };

  const getMyNweets = async () => {
    await getDocs(
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

  const resetProfile = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (userObj !== null) {
      const resetPhotoUrl = userObj.providerData[0].photoURL;
      const resetDisplayName = userObj.providerData[0].displayName;
      if (
        resetPhotoUrl !== newPhotoURL ||
        resetDisplayName !== newDisplayName
      ) {
        setNewPhotoURL(resetPhotoUrl);
        setNewDisplayName(resetDisplayName);
      }
    }
  };
  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    let profileURL = "";
    const prevPhoto = userObj.photoURL;
    const prevDisplayName = userObj.displayName;
    const resetPhoto = userObj.providerData[0].photoURL;

    if (
      newPhotoURL &&
      newPhotoURL !== prevPhoto &&
      resetPhoto !== newPhotoURL
    ) {
      console.log("여기는 실행되면 안돼");
      const newPhotoURLRef = ref(storageService, `${userObj?.uid}/${uuidv4()}`);
      const response = await uploadString(
        newPhotoURLRef,
        newPhotoURL,
        "data_url"
      );
      profileURL = await getDownloadURL(response.ref);
    } else {
      if (resetPhoto) {
        profileURL = resetPhoto;
      }
    }
    if (prevPhoto !== newPhotoURL || prevDisplayName !== newDisplayName) {
      await updateProfile(userObj, {
        displayName: newDisplayName,
        photoURL: profileURL,
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

  const onFileChange = (event: FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { files },
    } = event;
    const theFile = files && files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent: any) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setNewPhotoURL(result);
    };
    if (theFile !== null) {
      reader.readAsDataURL(theFile);
    }
  };
  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <Label htmlFor="attach-profile">
          {newPhotoURL && (
            <img
              src={newPhotoURL}
              alt=""
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50px",
                objectFit: "contain",
              }}
            />
          )}
        </Label>
        <input
          id="attach-profile"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{
            opacity: 0,
          }}
        />
        <FormInput
          type="text"
          autoFocus
          onChange={onChange}
          value={newDisplayName || ""}
          placeholder="Display name"
        />
        <ResetButton as="button" type="button" onClick={resetProfile}>
          기본 프로필로 변경
        </ResetButton>
        <FormBtn
          type="submit"
          value="Update Profile"
          style={{
            marginTop: 10,
          }}
        />
      </Form>

      <LogoutBtn as="span" onClick={onLogoutClick}>
        Log Out
      </LogoutBtn>
    </Container>
  );
};

export default Profile;
