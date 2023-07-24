import { StudyType } from "@/type/StudyType";

const ListItem = ({ item }: { item: StudyType }) => {
    return (
        <li className={item.end === 1 ? `col-12 end` : `col-12`}>
            <a href={`/study?studyId=` + String(item.studyInfoId)}>
                {item.title}
            </a>
        </li>
    )
};

export default ListItem;