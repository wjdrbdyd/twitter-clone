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
    <div key={nweetObj.id}>
      {editing ? (
        isOwner && (
          <>
            <form onSubmit={onSubmit}>
              <input
                type="text"
                placeholder="Edit your nweet"
                value={newNweet}
                required
                onChange={onChange}
              />
              <input type="submit" value="확인" />
            </form>
            <button onClick={toggleEditing}>Cancel</button>
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
            <>
              <button onClick={onDeleteClick}>삭제</button>
              <button onClick={toggleEditing}>수정</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
