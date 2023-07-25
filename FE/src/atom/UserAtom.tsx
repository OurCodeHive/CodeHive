import { atom } from "recoil";

export const userState = atom({
  key: "countState", // 전역적으로 고유한 값
  default: {
    nickname : "",
    email : "",
    password : "",
    emailAuthCode : "",
    accessToken : "",
    refreshToken:""
  } // 초깃값
});