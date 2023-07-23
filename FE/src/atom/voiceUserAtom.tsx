import { atom } from "recoil";
// import { recoilPersist } from 'recoil-persist';

// session storage save
// const { persistAtom } = recoilPersist({
//   key: 'voiceJoinUser',
//   storage: sessionStorage,
// });


export const voiceJoinUserState = atom({
  key: 'voiceJoinUser',
  default:[
    { 
      name: "init",
      mike: true,
      sound: true,
    },
  ],
  // effects_UNSTABLE: [persistAtom],
})