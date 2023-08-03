import { StudyNoticeType } from '@/type/StudyNoticeType';
import TableListStyle from '@/utils/List/Table/css/ListTable.module.css';

const NoticeListItem = ({item} : {item : StudyNoticeType}) => {

    return (
        <tr>
            <td className={`tl ${TableListStyle.title_link}`}>
                <a href="javascript:void(0)">{NoticeContent.noticeTitle}</a>
            </td>
            <td>{NoticeContent.nickName}</td>
            <td>{NoticeContent.uploadAt}</td>
        </tr>
    )
}

export default NoticeListItem;