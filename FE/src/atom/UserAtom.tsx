import { atom } from "recoil";
import { recoilPersist } from 'recoil-persist';
function getAccessToken(){
    //유효하지 않으면
    //api로 보내기 
    // return accessToken
}
interface userType {
    email : string,
    userId : number,
    nickname : string,
    accessToken : string,
    refreshToken:string
}

const { persistAtom } = recoilPersist({
    key: 'sessionStorage',
    storage: sessionStorage,
  });

export const userState = atom<userType>({
  key: "useState", // 전역적으로 고유한 값
  default: {
    email : "",
    userId : 0,
    nickname : "",
    accessToken : "",
    refreshToken:"",
  }, // 초깃값
  effects_UNSTABLE: [persistAtom],
});

