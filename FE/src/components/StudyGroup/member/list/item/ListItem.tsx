import { UserType } from "@/type/UserType";
import { useRecoilValue } from 'recoil';
import { userState, CheckUserId } from "@/atom/UserAtom";
import { updateMemberDrop, updateMemberMandate } from "@/api/study";
import Style from '@/res/css/module/StudyGroupMember.module.css';
import MedalIcon from '@/res/img/medal_icon.png';
import ManDateIcon from '@/res/img/mandate_icon.png';
import DropIcon from '@/res/img/drop_icon.png';

const ListItem = ({ item, studyinfoId, refreshList }: { item: UserType, studyinfoId: number, refreshList : () => void }) => {
    let statusText = "대기";
    switch(item.status){
        case "ACCEPT" :
            statusText = "수락";
            break;
        case "BAN" :
            statusText = "강퇴";
            break;
    }
    const userId = useRecoilValue(userState).userId;
    const LeaderFlag = CheckUserId(item.userId);
    const notUserFlag = item.userId == -1;
    const param = {
        studyinfoId : studyinfoId,
        from : userId,
        to : -1,
        target : -1
    }

    async function manDateRequest(idx: number) {
        param.to = idx;
        await updateMemberMandate(param, ({data}) => {
            console.dir(data);
        }, (error) => console.log(error));
    }

    async function dropRequest(idx: number) {
        param.target = idx;
        await updateMemberDrop(param, ({data}) => {
            console.dir(data);
        }, (error) => console.log(error));
    }

    return (
        <li className={`${LeaderFlag ? Style.leader : ""}`}>
            <div className={Style.list_title}>{LeaderFlag ? <img src={MedalIcon} alt="방장 아이콘"/> : statusText}<span>{item.nickName} ({item.email})</span></div>
            {!LeaderFlag && !notUserFlag ?
                <div className={Style.list_btn_con}>
                    <button type="button" onClick={() => void manDateRequest(item.userId)} className={Style.mandate_btn}><img src={ManDateIcon} alt="위임하기" /></button>
                    <button type="button" onClick={() => void dropRequest(item.userId)}><img src={DropIcon} alt="강퇴하기" /></button>
                </div>
                : null
            }
        </li>
    )
};

export default ListItem;