import React, { useEffect, useState } from "react";
import { storeService, collection, addDoc, getDocs } from "fbase";

interface INweet {
  id: string;
  nweet: string;
  createdAt: number;
}
const Home = () => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState<INweet[]>([]);
  const getNweets = async () => {
    const querySnapshot = await getDocs(collection(storeService, "nweets"));
    querySnapshot.forEach((doc) => {
      const nweetObject = {
        ...doc.data(),
        id: doc.id,
      } as INweet;

      setNweets((prev) => [nweetObject, ...prev]);
    });
  };
  useEffect(() => {
    getNweets();
  }, []);
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(storeService, "nweets"), {
        nweet,
        createdAt: Date.now(),
      });
      setNweet("");
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setNweet(value);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          name="nweet"
          type="text"
          placeholder="What's on your mind?"
        />
        <input type="submit" value="Nweet" />
      </form>
      <div>
        {nweets.map((nweet) => (
          <div key={nweet.id}>
            <h4>{nweet.nweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
