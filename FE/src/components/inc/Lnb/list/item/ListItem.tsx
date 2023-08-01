import { StudyType } from "@/type/StudyType";
import LnbStyle from "@/res/css/module/Lnb.module.css";

const ListItem = ({ item }: { item: StudyType }) => {
    return (
        <li className={item.end === 1 ? `col-12 ${LnbStyle.end}` : `col-12`}>
            <a href={`/study?studyId=` + String(item.studyinfoId)}>
                {item.title}
            </a>
        </li>
    )
};

export default ListItem;