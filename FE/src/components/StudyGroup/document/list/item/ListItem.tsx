import { StudyDocumentType } from '@/type/StudyDocumentType';
import TableListStyle from '@/utils/List/Table/css/ListTable.module.css';

const DocumentListItem = ({item, clickEvent} : {item : StudyDocumentType, clickEvent: (idx: number) => void}) => {

    return (
        <tr>
            <td className={`tl ${TableListStyle.title_link}`}>
                <span onClick={() => clickEvent(item.id!)}>{item.title}</span>
            </td>
            <td>{item.author}</td>
            <td>{item.uploadAt}</td>
        </tr>
    )
}

export default DocumentListItem;