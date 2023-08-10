import { atom, useRecoilValue } from "recoil";
import { StudyDocumentDetailItemType } from '@/type/StudyDocumentType';

export const studyFileState = atom<StudyDocumentDetailItemType>({
  key: "studyFileState",
  default: {
    id : 0,
    uploadAt: "",
    title: "",
    content: "",
    userId : 0,
    nickname : "",
    fileList: [],
  },
});
