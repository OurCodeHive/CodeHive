export type StudyType = {
    studyinfoId : number;
    title : string;
    end? : 1 | 0;
    profile? : string;
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