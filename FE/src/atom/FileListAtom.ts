import { atom, useRecoilValue } from "recoil";
import { file } from '@/type/StudyDocumentType';

export const fileListState = atom<file[]>({
  key: "fileListState",
  default: [{
    id: 0,
    fileSize: 0,
    originName: "",
    realName: "",
    path: "",
    etc: ""
  }],
});
