import { forwardRef } from 'react';
import { StudyType } from "@/type/StudyType";
import LnbStyle from "@/res/css/module/Lnb.module.css";

interface Props {
	item : StudyType,
    SelectedFlag : boolean
}

const ListItem = forwardRef({ item, SelectedFlag, ref }: { item: StudyType, SelectedFlag : boolean, ref : React.RefObject<HTMLLIElement>}) => {
    if(SelectedFlag){
        return (
            <li className={`col-12 ${item.end === 1 ? LnbStyle.end : ""} ${LnbStyle.selected}`} ref={ref}>
                <a href={`/study?studyinfoId=` + String(item.studyinfoId)}>
                    {item.title}
                </a>
            </li>
        )
    } else {
        return (
            <li className={`col-12 ${item.end === 1 ? LnbStyle.end : ""}`}>
                    <a href={`/study?studyinfoId=` + String(item.studyinfoId)}>
                        {item.title}
                    </a>
                </li>
        )
    }
};

export default ListItem;