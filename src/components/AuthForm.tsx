import React, { useState } from "react";
import { authService, createUser, signInUser } from "fbase";
const AuthForm = () => {
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
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);
  return (
    <>
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
    </>
  );
};

export default AuthForm;
