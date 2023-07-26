import { atom } from "recoil";
function getAccessToken(){
    //유효하지 않으면
    //api로 보내기 
    // return accessToken
}

export const userState = atom({
  key: "countState", // 전역적으로 고유한 값
  default: {
    userIdx : "",
    nickname : "",
    email : "",
    password : "",//
    accessToken : "",
    refreshToken:""
  } // 초깃값
});

