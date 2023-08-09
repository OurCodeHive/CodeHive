export type StudyDocumentType = {
    id? : number;
    authorId : number;
    author? : string;
    title : string;
    uploadAt? : string;
    content? : string;
}

export type StudyDocumentListType = {
    studyArchives : StudyDocumentType[];
    totalCnt : number;
    status? : number;
}