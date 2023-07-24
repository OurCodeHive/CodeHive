import React, {useState} from "react";
import {getList} from "@/api/study";
import LnbFilter from "./item/Filter";
import LnbListItem from "./item/ListItem";
import { StudyType } from "@/type/StudyType";

const param = {userIdx : 1, keyWord : ""};

let studyList: StudyType[] = [
    {studyInfoId : 1, title : "테스트", end : 1}
];
/*await getList(param,({data}) => {
    studyList = data.list;
}, (error: any) => {
    console.log(error);
    alert('에러로 실패했습니다. 관리자에 문의해주세요.');
});*/

const List: React.FC = () => {
    const searchKeyWord = (data: string) => {
        console.log(data);
    }
    //리스트가 존재할 때
    if(studyList.length > 0){
        return (
            <ul className="col-12">
                <LnbFilter searchKeyWord={searchKeyWord}/>
                {studyList.map((item) => <LnbListItem key={item.studyInfoId} item={item} />)}
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