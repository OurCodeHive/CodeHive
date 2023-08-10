import { atom, useRecoilValue } from "recoil";
import { recoilPersist } from 'recoil-persist';
interface userType {
    email : string | null,
    userId : number | null,
    nickname : string | null,
    accessToken : string | null,
}

const { persistAtom } = recoilPersist({
    key: 'sessionStorage',
    storage: sessionStorage,
  });

function getRandomNumber() {
  return Math.floor(Math.random() * 16777215).toString(16);
}

export const userState = atom<userType>({
  key: "useState", // 전역적으로 고유한 값
  default: {
    email : "",
    userId : 15,
    nickname : "USER " + getRandomNumber(),
    accessToken : "",
  }, // 초깃값
  effects_UNSTABLE: [persistAtom],
});

export const changePasswordUserState = atom<string>({
    key : "changePasswordUserState",
    default : "",
})

export function CheckUserId(checkId: number): boolean{
  return checkId == useRecoilValue(userState).userId;
}
