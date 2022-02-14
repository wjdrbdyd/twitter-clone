import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faGithub,
  faGoogle,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthForm from "components/AuthForm";
import { authService, signPop } from "fbase";
import {
  AuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import React from "react";
import styled from "styled-components";
const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh;
  justify-content: center;
  align-items: center;
`;
const AuthBtns = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 320px;
`;
const AuthBtn = styled.button`
  cursor: pointer;
  border-radius: 20px;
  border: none;
  padding: 10px 0px;
  font-size: 12px;
  text-align: center;
  width: 150px;
  background: white;
  cursor: pointer;
`;
const Auth = () => {
  const onSocialClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = event;

    let provider: AuthProvider = {} as AuthProvider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    await signPop(authService, provider);
  };
  return (
    <AuthContainer className="authContainer">
      <FontAwesomeIcon
        icon={faTwitter as IconProp}
        color={"#04AAFF"}
        size="3x"
        style={{ marginBottom: 30 }}
      />
      <AuthForm />
      <AuthBtns className="authBtns">
        <AuthBtn onClick={onSocialClick} name="google" className="authBtn">
          Continue with Google <FontAwesomeIcon icon={faGoogle as IconProp} />
        </AuthBtn>
        <AuthBtn onClick={onSocialClick} name="github" className="authBtn">
          Continue with Github <FontAwesomeIcon icon={faGithub as IconProp} />
        </AuthBtn>
      </AuthBtns>
    </AuthContainer>
  );
};

export default Auth;
