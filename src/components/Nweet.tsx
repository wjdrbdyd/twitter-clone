import React, { FormEvent, useState } from "react";
import { INweetCollection } from "routes/Home";
import {
  doc,
  deleteDoc,
  storeService,
  updateDoc,
  storageService,
  ref,
  deleteObject,
} from "fbase";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Container, FormBtn, FormInput } from "GlobalStyle";

const SNweet = styled.div`
  margin-bottom: 20px;
  background-color: white;
  width: 100%;
  max-width: 320px;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  color: rgba(0, 0, 0, 0.8);
  h4 {
    font-size: 14px;
  }
  img {
    right: -10px;
    top: 20px;
    position: absolute;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    margin-top: 10px;
  }
`;
const NweetForm = styled(Container)`
  ${FormBtn} {
    cursor: pointer;
    margin-top: 15px;
    margin-bottom: 5px;
  }
`;
const CancelBtn = styled(FormBtn)`
  cursor: pointer;
  border: none;
  background-color: tomato;
`;
const ActionBtns = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
  span {
    cursor: pointer;
    &:first-child {
      margin-right: 10px;
    }
  }
`;
interface INweet {
  nweetObj: INweetCollection;
  isOwner: boolean;
}

const Nweet = ({ nweetObj, isOwner }: INweet) => {
  const nweetRef = doc(storeService, "nweets", nweetObj.id);
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.nweetText);
  const onDeleteClick = async () => {
    const ok = window.confirm("이 Nweet를 삭제 하시겠습니까?");
    if (ok) {
      await deleteDoc(nweetRef);
      // Create a reference to the file to delete
      const desertRef = ref(storageService, nweetObj.attachmentUrl);
      // Delete the file
      await deleteObject(desertRef);
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await updateDoc(nweetRef, { nweetText: newNweet });
    setEditing(false);
  };
  const onChange = (event: FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setNewNweet(value);
  };
  return (
    <SNweet>
      {editing ? (
        isOwner && (
          <>
            <NweetForm as="form" onSubmit={onSubmit}>
              <FormInput
                type="text"
                placeholder="Edit your nweet"
                value={newNweet}
                required
                onChange={onChange}
              />
              <FormBtn type="submit" value="확인" />
            </NweetForm>
            <CancelBtn as="button" onClick={toggleEditing}>
              Cancel
            </CancelBtn>
          </>
        )
      ) : (
        <>
          <h4>{nweetObj.nweetText}</h4>
          {nweetObj.attachmentUrl && (
            <img
              src={nweetObj.attachmentUrl}
              width="50px"
              height="50px"
              alt="attachImg"
            />
          )}
          {isOwner && (
            <ActionBtns>
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash as IconProp} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt as IconProp} />
              </span>
            </ActionBtns>
          )}
        </>
      )}
    </SNweet>
  );
};

export default Nweet;
