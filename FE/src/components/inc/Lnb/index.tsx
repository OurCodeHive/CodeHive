import React, { useState } from "react";
import StudyList from "@/components/StudyGroup/list";
import {ContentsPopup} from "@/utils/Popup";
import StudyInsert from "@/components/StudyGroup/insert";
import LnbStyle from "@/res/css/module/Lnb.module.css";
import LnbLogo from "@/res/img/codehive_lnb_logo.png";
import HomeIcon from "@/res/img/30x30_00000_home_icon.png";
import PlusIcon from "@/res/img/new_btn_plus_icon.png";

const Lnb: React.FC = () => {
    const [popupFlag, setPopupFlag] = useState(false);
    const PopupInfo = {
        PopupStatus : popupFlag,
        zIndex : 9999,
        maxWidth: 800,
        PopupTitle : "스터디 만들기",
        ClosePopupProp : () => changePopupFlag(false),
        PopupContents : <StudyInsert refreshList={() => refreshList()} closePopup={() => changePopupFlag(false)} />
    }

    const changePopupFlag = (flag: boolean) => {setPopupFlag(() => flag);};

    const [RefreshFlag, setRefreshFlag] = useState(false);

    const refreshList = () => {
        const flag = !RefreshFlag;
        setRefreshFlag(() => flag);
    }

    return (
        <div className={`col-12 ${LnbStyle.lnb_wrap}`}>
            <img src={LnbLogo} alt="사이드바 로고" />
            <div className={`col-12 ${LnbStyle.lnb_con}`}>
                <a href="/" className={`col-12 tc ${LnbStyle.home_btn}`}><img src={HomeIcon} alt="홈 아이콘"/>Home</a>
                <StudyList refreshFlag={RefreshFlag}/>
                <button className={`col-12 mt50 ${LnbStyle.new_btn}`} onClick={() => changePopupFlag(true)}><img src={PlusIcon} alt="홈 아이콘"/>New</button>
                <ContentsPopup PopupInfo={PopupInfo} />
            </div>
        </div>
    )
};

export default Lnb;