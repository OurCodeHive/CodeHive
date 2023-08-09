export type ChatMessage = {
  userId: number;
  studyRoomId: string;
  message: string;
  dateTime: string;
}

export type studyUser= {
  email: string;
  userId: number;
  status: string;
  nickName: string;
}

export type studyUserList = {
  studyUserList: studyUser[];
  status? : number;
}
