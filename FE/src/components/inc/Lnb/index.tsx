import React, { useState } from "react";
import StudyList from "@/components/StudyGroup/list";
import {ContentsPopup} from "@/utils/Popup";
import StudyInsert from "@/components/StudyGroup/insert";
import StudyJoin from "@/components/StudyGroup/invite/Input";
import LnbStyle from "@/res/css/module/Lnb.module.css";
import LnbLogo from "@/res/img/codehive_lnb_logo.png";
import HomeIcon from "@/res/img/30x30_00000_home_icon.png";
import PlusIcon from "@/res/img/new_btn_plus_icon.png";
import { useNavigate } from "react-router-dom";

const Lnb: React.FC = () => {
    const navigate = useNavigate();
    const [popupFlag, setPopupFlag] = useState(false);
    const [PopupContents, setPopupContents] = useState(<StudyInsert refreshList={() => refreshList()} closePopup={() => changePopupFlag(false)} />);
    const PopupInfo = {
        PopupStatus : popupFlag,
        zIndex : 9999,
        maxWidth: 800,
        PopupTitle : "스터디 만들기",
        ClosePopupProp : () => changePopupFlag(false),
        PopupContents : PopupContents
    }

    const changePopupFlag = (flag: boolean) => {setPopupFlag(() => flag);};

    const [RefreshFlag, setRefreshFlag] = useState(false);

    const refreshList = () => {
        const flag = !RefreshFlag;
        setRefreshFlag(() => flag);
    }

    function openInsert() {
        setPopupContents(<StudyInsert refreshList={() => refreshList()} closePopup={() => changePopupFlag(false)} />);
        changePopupFlag(true);
    }

    function openJoin() {
        setPopupContents(<StudyJoin refreshList={() => refreshList()} closePopup={() => changePopupFlag(false)} />);
        changePopupFlag(true);
    }

    return (
        <div className={`col-12 ${LnbStyle.lnb_wrap}`}>
            <div className={`col-12 ${LnbStyle.lnb_con}`}>
            <div className="col-12 ml7"><img onClick={()=>{navigate("/home")}} src={LnbLogo} alt="사이드바 로고" /></div>
                {/* <a href="/home" className={`col-12 tc ${LnbStyle.home_btn}`}><img src={HomeIcon} alt="홈 아이콘"/>Home</a> */}
                <StudyList refreshFlag={RefreshFlag}/>
                <button className={`col-12 mt50 ${LnbStyle.new_btn}`} onClick={() => openInsert()}>New</button>
                <button className={`col-12 mt10 ${LnbStyle.new_btn}`} onClick={() => openJoin()}>Join</button>
                <ContentsPopup PopupInfo={PopupInfo} />
            </div>
        </div>
    )
};

export default Lnb;