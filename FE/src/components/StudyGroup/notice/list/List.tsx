import {useEffect, useState, useRef} from 'react';
import { getNoticeList } from '@/api/study';
import { CheckUserId } from '@/atom/UserAtom';
import NoticeFilter from './item/Filter';
import NoticeListItem from './item/ListItem';
import Pagination, { PaginationType } from '@/utils/Pagination/PaginationGreen';
import {ContentsPopup} from "@/utils/Popup";
import NoticeView from '../view/View';
import TableList from '@/utils/List/Table/List';
import StudyStyle from '@/res/css/page/StudyView.module.css';
import NoticeInsert from '../insert/Insert';

const NoticeList = ({studyinfoId, studyLeaderId} : {studyinfoId:number, studyLeaderId: number}) => {
    const LeaderFlag = useRef(CheckUserId(studyLeaderId));
    const [StudyLeaderId, setStudyLeaderId] = useState(studyLeaderId);
    const param = {
        page : 0,
        size : 10
    }
    const [ListContents, setListContents] = useState<JSX.Element[]>([]);
    const [TotalCnt, setTotalCnt] = useState(0);

    const changePage = (idx: number) => {
        param.page = idx;
        void getList();
    }

    const PaginationInfo:PaginationType = {
        totalCnt : TotalCnt,
        perSize : param.size,
        range : 5,
        changeIdx : changePage
    };

    const getList = async () => {
        await getNoticeList(studyinfoId, param, ({data}) => {
            setTotalCnt(data.totalCnt);
            const tempList = data.studyNoticeList.map((item, index) => <NoticeListItem key={index} item={item} clickEvent={openViewPopup} />);
            setListContents(tempList);
        }, (error) => {console.log(error)})
    }

    useEffect(() => {
        void getList();
    }, []);

    useEffect(() => {
        setStudyLeaderId(() => studyLeaderId);
    }, [studyLeaderId]);

    const changePopup = () => {
        changePage(0);
        changePopupFlag(false);
    }

    const keywordInput:React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const WidGroup = ["auto", "100px", "150px"];
    const ListTitle = ["제목", "작성자", "작성일"];

    const [popupFlag, setPopupFlag] = useState(false);
    const [ViewStudyBoardId, setViewStudyBoardId] = useState(-1);
    const [PopupContents, setPopupContents] = useState(<NoticeView studyBoardId={ViewStudyBoardId} changePopup={changePopup} closePopup={() => changePopupFlag(false)} studyLeaderId={studyLeaderId} />);

    const PopupInfo = {
        PopupStatus : popupFlag,
        zIndex : 9999,
        maxWidth: 800,
        PopupTitle : "공지사항 상세",
        ClosePopupProp : () => changePopupFlag(false),
        PopupContents : PopupContents,
    }

    const changePopupFlag = (flag: boolean) => {
        setPopupFlag(() => flag);
    };

    //상세 팝업 열기
    function openViewPopup(idx: number){
        setViewStudyBoardId(() => idx);
        PopupInfo.PopupTitle = "공지사항 상세";
        setPopupContents(<NoticeView studyBoardId={idx} closePopup={() => changePopupFlag(false)} changePopup={changePopup} studyLeaderId={StudyLeaderId}
        //  leaderFlag={LeaderFlag} 
         />);
        changePopupFlag(true);
    }

    const openInsertPopup = () => {
        PopupInfo.PopupTitle = "공지사항 등록";
        setPopupContents(<NoticeInsert studyinfoId={studyinfoId} closePop={() => changePopupFlag(false)} completePop={changePopup} />);
        changePopupFlag(true);
    }

    return (
        <div className="col-12 pt50 pr20 pb20 pl20">
            <NoticeFilter />
            <div className="col-12 mb30">
                <TableList WidGroup={WidGroup} ListTitle={ListTitle} ListContents={ListContents} NoDataText='해당하는 공지사항이 없습니다.'/>
            </div>
            <div className="col-12">
                <Pagination PaginationInfo={PaginationInfo} />
                {LeaderFlag ? 
                <button type="button" style={{backgroundColor : "transparent"}} className={StudyStyle.study_plus_btn} onClick={openInsertPopup}>+</button>
                : null}
            </div>
            <ContentsPopup PopupInfo={PopupInfo}/>
        </div>
    )
}

export default NoticeList;