import React from "react";
import LnbStyle from "@/res/css/module/Lnb.module.css";
import LnbLogo from "@/res/img/CodeHiveLnbLogo.png";
import HomeIcon from "@/res/img/30x30_00000_home_icon.png";
import PlusIcon from "@/res/img/new_btn_plus_icon.png";
import LnbList from "./list";

const Lnb: React.FC = () => {

    return (
        <div className={`col-12 pt50 pb50 ${LnbStyle.lnb_wrap}`}>
            <img src={LnbLogo} alt="사이드바 로고" />
            <div className={`col-12 ${LnbStyle.lnb_con}`}>
                <a href="/" className={`col-12 tc ${LnbStyle.home_btn}`}><img src={HomeIcon} alt="홈 아이콘"/>Home</a>
                <LnbList/>
                <button className={`col-12 mt50 ${LnbStyle.new_btn}`}><img src={PlusIcon} alt="홈 아이콘"/>New</button>
            </div>
        </div>
    )
};

export default Lnb;