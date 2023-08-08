import { atom } from "recoil";
import { recoilPersist } from 'recoil-persist';
function getAccessToken(){
    //유효하지 않으면
    //api로 보내기 
    // return accessToken
}
interface userType {
    email : string | null,
    userId : number,
    nickname : string | null,
    accessToken : string | null,
}

const { persistAtom } = recoilPersist({
    key: 'sessionStorage',
    storage: sessionStorage,
  });

export const userState = atom<userType>({
  key: "useState", // 전역적으로 고유한 값
  default: {
    email : "jiminsung@naver.com",
    userId : 15,
    nickname : "Minsung",
    accessToken : "",
  }, // 초깃값
  effects_UNSTABLE: [persistAtom],
});

export const changePasswordUserState = atom<string>({
    key : "changePasswordUserState",
    default : "",
})

