export type StudyNoticeType = {
    studyboardId? : number;
    authorId : number;
    nickName? : string;
    noticeTitle : string;
    uploadAt? : string;
    content? : string;
}

export type StudyNoticeListType = {
    studyNoticeList : StudyNoticeType[];
    totalCnt : number;
    status? : number;
}