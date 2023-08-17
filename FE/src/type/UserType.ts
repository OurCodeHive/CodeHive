export type UserType = {
    userId: number;
    nickName : string;
    email : string;
    status : string;
}

export type UserListType = {
    userList : UserType[];
    totalCnt : number;
}