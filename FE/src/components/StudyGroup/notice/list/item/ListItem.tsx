import { StudyNoticeType } from '@/type/StudyNoticeType';
import TableListStyle from '@/utils/List/Table/res/css/ListTable.module.css';

const NoticeListItem = ({item, clickEvent} : {item : StudyNoticeType, clickEvent: (idx: number) => void}) => {

    return (
        <tr>
            <td className={`tl ${TableListStyle.table_link}`}>
                <span onClick={() => clickEvent(item.studyboardId!)}>{item.noticeTitle}</span>
            </td>
            <td>{item.nickName}</td>
            <td>{item.uploadAt}</td>
        </tr>
    )
}

export default NoticeListItem;