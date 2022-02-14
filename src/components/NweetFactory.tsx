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
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={nweetText}
          onChange={onChange}
          name="nweetText"
          type="text"
          placeholder="What's on your mind?"
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus as IconProp} />
      </label>
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
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
            alt=""
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes as IconProp} />
          </div>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
