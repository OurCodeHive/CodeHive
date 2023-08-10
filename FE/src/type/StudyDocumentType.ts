import { type } from "os";

export type StudyDocumentType = {
    id? : number;
    authorId : number;
    author? : string;
    title : string;
    uploadAt? : string;
    content? : string;
}

export type StudyDocumentDetailItemType = {
    id : number;
    uploadAt: string;
    title: string;
    content: string;
    userId : number;
    nickname : string;
    fileList: file[];
}

export type file = {
    id: number;
    fileSize: number;
    originName: string;
    realName: string;
    path: string;
    etc: string;
}


export type StudyDocumentDetailType = {
    studyDocument: StudyDocumentDetailItemType;
    status? : number;
}

export type StudyDocumentListType = {
    studyArchives : StudyDocumentType[];
    totalCnt : number;
    status? : number;
}