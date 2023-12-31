import { type } from "os";

export type StudyType = {
    studyinfoId : number;
    title : string;
    end? : 1 | 0;
    profileImage? : string;
    createdAt? : string;
    startAt? : string;
    endAt? : string;
    users_id? : number;
    enterName? : string;
    description? : string;
}

export type StudyListType = {
    studyList : StudyType[];
    status? : number;
}

export type StudyUpdateType = {
    studyinfoId : number;
    title : string;
    profile : string;
    startAt : string;
    endAt : string;
    description : string;
}