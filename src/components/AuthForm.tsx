import React, { useState } from "react";
import { authService, createUser, signInUser } from "fbase";
import styled from "styled-components";
import { Container } from "GlobalStyle";

const AuthInput = styled.input`
  max-width: 320px;
  width: 100%;
  padding: 10px;
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 1);
  margin-bottom: 10px;
  font-size: 12px;
  color: black;
`;

const AuthSubmmit = styled(AuthInput)`
  text-align: center;
  background: #04aaff;
  color: white;
  margin-top: 10;
  cursor: pointer;
`;
const AuthError = styled.span`
  color: tomato;
  text-align: center;
  font-weight: 500;
  font-size: 12px;
`;
const AuthSwitch = styled.span`
  color: #04aaff;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 50px;
  display: block;
  font-size: 12px;
  text-decoration: underline;
`;
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
      <Container onSubmit={onSubmit}>
        <AuthInput
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <AuthInput
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <AuthSubmmit
          type="submit"
          value={newAccount ? "Create Account" : "Sign In"}
        />
        {error && <AuthError>{error}</AuthError>}
      </Container>

      <AuthSwitch onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create Account"}{" "}
      </AuthSwitch>
    </>
  );
};

export default AuthForm;
