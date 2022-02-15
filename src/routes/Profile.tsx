import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  addDoc,
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

  useEffect(() => {
    setNewPhotoURL(userObj.photoURL);
  }, []);

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
  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    let profileURL = "";

    if (newPhotoURL) {
      const newPhotoURLRef = ref(storageService, `${userObj?.uid}/${uuidv4()}`);
      const response = await uploadString(
        newPhotoURLRef,
        newPhotoURL,
        "data_url"
      );
      profileURL = await getDownloadURL(response.ref);
    }
    console.log("user:", userObj.photoURL);
    console.log("photo:", profileURL);

    if (
      userObj.photoURL !== newPhotoURL ||
      userObj.displayName !== newDisplayName
    ) {
      console.log("update");
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
