import {useEffect, useState, useRef} from 'react';
import { getNoticeList } from '@/api/study';
import NoticeFilter from './item/Filter';
import NoticeListItem from './item/ListItem';
import Pagination, { PaginationType } from '@/utils/Pagination/Pagination';
import {ContentsPopup} from "@/utils/Popup";
import NoticeView from '../view/View';
import TableList from '@/utils/List/Table/List';

const NoticeList = ({studyinfoId, LeaderFlag} : {studyinfoId:number, LeaderFlag: boolean}) => {
    const param = {
        page : 1,
        size : 10
    }
    const [ListContents, setListContents] = useState<JSX.Element[]>([]);

    const changePage = (idx: number) => {
        param.page = idx;
        void getList();
    }

    const PaginationInfo:PaginationType = {
        totalCnt : 80,
        perSize : param.size,
        range : 5,
        changeIdx : changePage
    };

    const getList = async () => {
        const tempList = [{studyboardId : 1, authorId : 1, nickName : "테스트", noticeTitle : "테스트제목", "uploadAt" : "2023-08-04", "content" : "테스트내용"}]
        const tempList2 = tempList.map((item, index) => <NoticeListItem key={index} item={item} clickEvent={openViewPopup} />);
        setListContents(tempList2);
        await getNoticeList(studyinfoId, param, ({data}) => {
            //setListContents(data.studyNoticeBoard);
        }, (error) => {console.log(error)})
    }

    useEffect(() => {
        void getList();
    }, []);

    const keywordInput:React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const WidGroup = ["auto", "100px", "150px"];
    const ListTitle = ["제목", "작성자", "작성일"];

    const [popupFlag, setPopupFlag] = useState(false);
    const [ViewStudyBoardId, setViewStudyBoardId] = useState(-1);

    const PopupInfo = {
        PopupStatus : popupFlag,
        zIndex : 9999,
        maxWidth: 800,
        PopupTitle : "공지사항 상세",
        ClosePopupProp : () => changePopupFlag(false),
        PopupContents : <NoticeView studyBoardId={ViewStudyBoardId} closePopup={() => changePopupFlag(false)}/>,
    }

    const changePopupFlag = (flag: boolean) => {
        setPopupFlag(() => flag);
    };

    const openViewPopup = (idx: number) => {
        setViewStudyBoardId(() => idx);
        setPopupFlag(() => true);
    }

    return (
        <div className="col-12 pt50 pr20 pb20 pl20">
            <NoticeFilter />
            <TableList WidGroup={WidGroup} ListTitle={ListTitle} ListContents={ListContents}/>
            <div className="col-12">
                <Pagination PaginationInfo={PaginationInfo} />
                {LeaderFlag ? <button type="button" className={`plus_btn`}>공지사항 추가 버튼</button> : null}
            </div>
            <ContentsPopup PopupInfo={PopupInfo}/>
        </div>
    )
}

export default NoticeList;