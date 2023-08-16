import { useState } from "react";
import { UserType } from "@/type/UserType";
import { useRecoilValue } from 'recoil';
import { userState, CheckUserId } from "@/atom/UserAtom";
import { updateMemberDrop, updateMemberMandate } from "@/api/study";
import { AlertPopup } from "@/utils/Popup";
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
    const [MandatePopupFlag, setMandatePopupFlag] = useState(false);
    const MandatePopupInfo = {
        PopupStatus : MandatePopupFlag,
        zIndex: 10000,
        maxWidth: 440,
        PopupTitle : "위임되었습니다",
        ClosePopupProp : () => MandatePopupClose()
    }

    function MandatePopupClose() {
        setMandatePopupFlag(() => false);
        window.location.reload();
    }

    type MandateResultProps = {
        isDelegated : boolean
    }

    async function MandateRequest(idx: number) {
        param.to = idx;
        await updateMemberMandate(param, ({data} : {data: MandateResultProps}) => {
            if(data.isDelegated) setMandatePopupFlag(() => true);
        }, (error) => console.log(error));
    }
    const [DropPopupFlag, setDropPopupFlag] = useState(false);
    const DropPopupInfo = {
        PopupStatus : DropPopupFlag,
        zIndex: 10000,
        maxWidth: 440,
        PopupTitle : "강퇴했습니다",
        ClosePopupProp : () => DropPopupClose()
    }

    function DropPopupClose() {
        setDropPopupFlag(() => false);
        refreshList();
    }

    type DropResultProps = {
        isForcedLeave : boolean
    }

    async function DropRequest(idx: number) {
        param.target = idx;
        await updateMemberDrop(param, ({data} : {data : DropResultProps}) => {
            if(data.isForcedLeave) setDropPopupFlag(() => true);
        }, (error) => console.log(error));
    }

    return (
        <li className={`${LeaderFlag ? Style.leader : ""}`}>
            <div className={Style.list_title}>{LeaderFlag ? <img src={MedalIcon} alt="방장 아이콘"/> : statusText}<span>{item.nickName} ({item.email})</span></div>
            {!LeaderFlag && !notUserFlag && item.status != "BAN" ?
                <div className={Style.list_btn_con}>
                    <button type="button" onClick={() => void MandateRequest(item.userId)} className={Style.mandate_btn}><img src={ManDateIcon} alt="위임하기" /></button>
                    <AlertPopup PopupInfo={MandatePopupInfo}/>
                    <button type="button" onClick={() => void DropRequest(item.userId)}><img src={DropIcon} alt="강퇴하기" /></button>
                    <AlertPopup PopupInfo={DropPopupInfo}/>
                </div>
                
                : null
            }
        </li>
    )
};

export default ListItem;