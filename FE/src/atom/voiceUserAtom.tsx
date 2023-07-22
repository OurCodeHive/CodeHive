import { atom } from "recoil";


export const voiceJoinUserState = atom({
  key: 'voiceJoinUser',
  default:[
    { 
      name: "민성",
      mike: true,
      sound: true,
    },
    { 
      name : "다영",
      mike: true,
      sound: true,
    },
    { 
      name : "정민",
      mike: true,
      sound: true,
    },
    { 
      name : "하영", 
      mike: true,
      sound: true,
    },
    { 
      name: "강호",
      mike: true,
      sound: true,
    },
    { 
      name: "민식",
      mike: true,
      sound: true,
    },
  ],
})