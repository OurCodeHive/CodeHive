import { atom, useRecoilValue } from "recoil";

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

export const SidebarContentAtom = atom<Array<StudyType>>({
  key: "SidebarContentAtom",
  default: []
});
