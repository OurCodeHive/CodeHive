import {useEffect, useState, useRef} from 'react';
import NoticeFilter from './item/Filter';
import NoticeListItem from './item/ListItem';
import TableListStyle from '@/utils/List/Table/css/ListTable.module.css';
import { StudyNoticeType } from '@/type/StudyNoticeType';
import { getNoticeList } from '@/api/study';
import Pagination, { PaginationType } from '@/utils/Pagination/Pagination';

const studyinfoId = Number(new URLSearchParams(location.search).get("studyinfoId"));

const NoticeList = () => {
    const [Page, setPage] = useState(1);
    const [Size, setSize] = useState(10);
    const [ListContents, setListContents] = useState<StudyNoticeType[]>([]);

    const changePage = (idx: number) => {
        setPage(() => idx);
        void getList();
    }

    const PaginationInfo:PaginationType = {
        totalCnt : 80,
        perSize : Size,
        range : 5,
        curIdx : Page,
        changeIdx : changePage
    };

    const getList = async () => {
        await getNoticeList(studyinfoId, {page : Page, size : Size}, ({data}) => {
            setListContents(data.studyNoticeBoard);
        }, (error) => {console.log(error)})
    }

    useEffect(() => {
        void getList();
    }, []);

    const keywordInput:React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const WidGroup = ["auto", "100px", "150px"];
    const ListTitle = ["제목", "작성자", "작성일"];

    return (
        <div className="col-12 pt50 pr20 pb20 pl20">
            <NoticeFilter/>
            <div className={`col-12 ${TableListStyle.table_style_0_con}`}>
                <table className={`col-12 ${TableListStyle.table_style_0}`}>
                    <colgroup>
                        {WidGroup.map((item, index) => <col key={index} width={item}/>)}
                    </colgroup>
                    <thead>
                        <tr>
                            {ListTitle.map((item, index) => <th key={index}>{item}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {ListContents.map((item, index) => <NoticeListItem key={index} item={item} />)}
                    </tbody>
                </table>
            </div>
            <div className="col-12">
                <Pagination PaginationInfo={PaginationInfo} />
            </div>
        </div>
    )
}

export default NoticeList;