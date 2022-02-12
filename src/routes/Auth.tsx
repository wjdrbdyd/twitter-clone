import { async } from "@firebase/util";
import { authService, createUser, signInUser, signPop } from "fbase";
import {
  AuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import React, { EventHandler, useState } from "react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        // create account
        data = await createUser(authService, email, password);
      } else {
        // login
        data = await signInUser(authService, email, password);
      }
      console.log(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);

  const onSocialClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = event;

    let provider: AuthProvider = {} as AuthProvider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
      console.log(provider);
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    const data = await signPop(authService, provider);
    console.log(data);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="text"
          placeholder="Email"
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={onChange}
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Sign In"}
        />
      </form>
      <p>{error}</p>
      <span onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create Account"}{" "}
      </span>
      <div>
        <button name="google" onClick={onSocialClick}>
          Continue with Google
        </button>
        <button name="github" onClick={onSocialClick}>
          Continue with Github
        </button>
      </div>
    </div>
  );
};

export default Auth;
