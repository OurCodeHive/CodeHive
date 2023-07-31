import React, { useState, useEffect } from "react";
import { StudyType } from "@/type/StudyType";
import {getList} from "@/api/study";
import { useRecoilValue } from 'recoil';
import { userState } from '@/atom/UserAtom';
import LnbFilter from "./item/Filter";
import LnbListItem from "./item/ListItem";
import LnbStyle from "@/res/css/module/Lnb.module.css";

const List:React.FC = () => {
    const userId = useRecoilValue(userState).userId;
    const param = {user : 1};
    let originStudyList = [] as Array<StudyType>;
    useEffect(() => {
        async function fetchData() {
            await getList(param,
                ({data}) => {originStudyList = data?.study_list as Array<StudyType>;},
                (error) => {console.log(error);});
        }
        void fetchData();
    }, []);

    const [studyList, setStudyList] = useState<Array<StudyType>>(originStudyList);

    const searchKeyWord = (data: string) => {
        setStudyList(originStudyList.filter((item) => {if(item.title.indexOf(data) > -1) return item;}));
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
            <ul className="col-12">
                <LnbFilter searchKeyWord={searchKeyWord}/>
                <div className={`col-12 ${LnbStyle.no_data}`}>
                    해당하는 스터디가 없습니다.
                </div>
            </ul>
        )
    }
    
};

export default List;