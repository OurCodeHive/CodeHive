import {useState, useRef} from 'react';
import NoticeFilter from './item/Filter';
import TableListStyle from '@/utils/List/Table/css/ListTable.module.css';

const studyinfoId = Number(new URLSearchParams(location.search).get("studyinfoId"));

const NoticeList = () => {
    const [Page, setPage] = useState(1);
    const [Size, setSize] = useState(10);
    const [ListContents, setListContents] = useState();

    const keywordInput:React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
    const WidGroup = ["auto", "100px", "150px"];
    const ListTitle = ["제목", "작성자", "작성일"];

    return (
        <div className="col-12">
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
                        <tr>
                            <td>테스트</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default NoticeList;