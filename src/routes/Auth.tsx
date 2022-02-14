import AuthForm from "components/AuthForm";
import { authService, signPop } from "fbase";
import {
  AuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import React from "react";

const Auth = () => {
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
      <AuthForm />
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
