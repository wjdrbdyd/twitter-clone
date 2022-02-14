import React, { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  storeService,
  collection,
  addDoc,
  storageService,
  ref,
  uploadString,
  getDownloadURL,
} from "fbase";
import { IUser } from "routes/Home";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Icon, IconProp } from "@fortawesome/fontawesome-svg-core";
import styled from "styled-components";
const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
  margin-bottom: 20px;
  width: 100%;
`;
const Input = styled.input`
  flex-grow: 1;
  height: 40px;
  padding: 0px 20px;
  color: white;
  border: 1px solid #04aaff;
  border-radius: 20px;
  font-weight: 500;
  font-size: 12px;
`;
const ArrowInput = styled.input`
  position: absolute;
  right: 0;
  background-color: #04aaff;
  height: 40px;
  width: 40px;
  padding: 10px 0px;
  text-align: center;
  border-radius: 20px;
  color: white;
`;
const Label = styled.label`
  color: #04aaff;
  cursor: pointer;
  span {
    margin-right: 10px;
    font-size: 12px;
  }
`;
const Attachment = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  img {
    height: 80px;
    width: 80px;
    border-radius: 40px;
  }
`;
const FormClear = styled.div`
  color: #04aaff;
  cursor: pointer;
  text-align: center;
  span {
    margin-right: 10px;
    font-size: 12px;
  }
`;

const NweetFactory = ({ userObj }: IUser) => {
  const [nweetText, setNweetText] = useState("");
  const [attachment, setAttachment] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj?.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);
    }
    const nweetObj = {
      nweetText: nweetText,
      createdAt: Date.now(),
      creatorId: userObj?.uid as string,
      attachmentUrl,
    };

    try {
      await addDoc(collection(storeService, "nweets"), nweetObj);
      setNweetText("");
      setAttachment("");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setNweetText(value);
  };
  const onFileChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { files },
    } = event;
    const theFile = files && files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent: any) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    if (theFile !== null) {
      reader.readAsDataURL(theFile);
    }
  };
  const onClearAttachment = () => {
    setAttachment("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <InputContainer>
        <Input
          value={nweetText}
          onChange={onChange}
          name="nweetText"
          type="text"
          placeholder="What's on your mind?"
        />
        <ArrowInput type="submit" value="&rarr;" />
      </InputContainer>
      <Label htmlFor="attach-file">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus as IconProp} />
      </Label>
      <input
        id="attach-file"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />

      {attachment && (
        <Attachment>
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
            alt=""
          />
          <FormClear onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes as IconProp} />
          </FormClear>
        </Attachment>
      )}
    </Form>
  );
};

export default NweetFactory;
