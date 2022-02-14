import React, { useEffect, useState } from "react";
import { storeService, collection, onSnapshot, query, orderBy } from "fbase";
import { User } from "firebase/auth";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
export interface INweetCollection {
  id: string;
  nweetText: string;
  createdAt: number;
  creatorId: string;
  attachmentUrl?: string;
}
export interface IUser {
  userObj: User;
}
const Home = ({ userObj }: IUser) => {
  const [nweets, setNweets] = useState<INweetCollection[]>([]);

  useEffect(() => {
    const q = query(
      collection(storeService, "nweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (querySnapshot) => {
      const nweetArray = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as INweetCollection[];
      setNweets(nweetArray);
    });
  }, []);

  return (
    <div>
      <NweetFactory userObj={userObj} />
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj?.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
