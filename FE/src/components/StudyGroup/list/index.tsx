import React, { useState, useEffect, useCallback } from "react";
import { StudyType } from "@/type/StudyType";
import {getList} from "@/api/study";
import { useRecoilValue } from 'recoil';
import { userState } from '@/atom/UserAtom';
import ListFilter from "./item/Filter";
import LnbListItem from "./item/ListItem";
import LnbStyle from "@/res/css/module/Lnb.module.css";

let originStudyList = [] as Array<StudyType>;
const List = ({refreshFlag} : {refreshFlag : boolean}) => {
    const [RefreshFlag, setRefreshFlag] = useState(refreshFlag);
    if(refreshFlag != RefreshFlag) setRefreshFlag(() => refreshFlag);
    const userId = useRecoilValue(userState).userId;
    const param = {user : userId};
    const [studyList, setStudyList] = useState<Array<StudyType>>(originStudyList);

    useEffect(() => {
        async function fetchData(){
            await getList(param, ({data}) => {
                originStudyList = data.studyList;
                setStudyList(originStudyList);
            },
            (error) => {console.log(error);});
        }

        void fetchData();    
    }, [RefreshFlag]);

    

    const searchKeyWord = (data: string) => {
        setStudyList(originStudyList.filter((item) => {if(item.title.indexOf(data) > -1) return item;}));
    }
    return (
        <div className="col-12">
            <ListFilter searchKeyWord={searchKeyWord}/>
            {studyList.length > 0
                ?
                <ul className="col-12">{studyList.map((item, index) => <LnbListItem key={index} item={item} />)}</ul>
                :
                <ul className="col-12"><div className={`col-12 ${LnbStyle.no_data}`}>해당하는 스터디가 없습니다.</div></ul>
            }
        </div>
    )
};

export default List;