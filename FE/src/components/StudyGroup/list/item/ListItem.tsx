import { forwardRef } from 'react';
import { StudyType } from "@/type/StudyType";
import LnbStyle from "@/res/css/module/Lnb.module.css";

interface Props {
	item : StudyType,
    SelectedFlag : boolean
}

const ListItem = forwardRef((props : Props, ref) => {
    if(props.SelectedFlag){
        return (
            <li className={`col-12 ${props.item.end === 1 ? LnbStyle.end : ""} ${LnbStyle.selected}`} ref={ref as React.RefObject<HTMLLIElement>}>
                <a href={`/study?studyinfoId=` + String(props.item.studyinfoId)}>
                    {props.item.title}
                </a>
            </li>
        )
    } else {
        return (
            <li className={`col-12 ${props.item.end === 1 ? LnbStyle.end : ""}`}>
                    <a href={`/study?studyinfoId=` + String(props.item.studyinfoId)}>
                        {props.item.title}
                    </a>
                </li>
        )
    }
});

export default ListItem;