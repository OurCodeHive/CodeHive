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
    authorId : number;
    title: string;
    uploadAt: string;
    content: string;
    fileList: file[];
}

export type file = {
    etc: string;
    fileSize: number;
    id: number;
    originName: string;
    path: string;
    realName: string;
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