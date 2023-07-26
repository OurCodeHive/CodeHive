import React, {useState} from "react";
import {getList} from "@/api/study";
import LnbFilter from "./item/Filter";
import LnbListItem from "./item/ListItem";
import { StudyType } from "@/type/StudyType";

const param = {nickName : ""};
const originStudyList:Array<StudyType> = await getList(param) as Array<StudyType>;
//const getStudyList:Array<StudyType> = [{'studyInfoId' : 1, 'title' : "첫 스터디", 'end' : 1 }, {'studyInfoId' : 2, 'title' : "두번째 스터디", 'end' : 0 }];

const List: React.FC = () => {
    const [studyList, setStudyList] = useState(originStudyList);
    const searchKeyWord = (data: string) => {
        console.log(param);
        //setStudyList([getStudyList]);
    }
    //리스트가 존재할 때
    if(studyList.length > 0){
        return (
            <ul className="col-12">
                <LnbFilter searchKeyWord={searchKeyWord}/>
                {studyList.map(item => <LnbListItem key={item.studyInfoId} item={item} />)}
            </ul>
        )    
    } else { //리스트가 존재하지 않을 때
        return (
            <div className="col-12">
                등록된 리스트가 없습니다.
            </div>
        )
    }
    
};

export default List;