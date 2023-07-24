import React from "react";
import LnbStyle from "@/res/css/module/Lnb.module.css";
import LnbLogo from "@/res/img/CodeHiveLnbLogo.png";
import LnbList from "./list";

const Lnb: React.FC = () => {

    return (
        <div className={`col-12 ${LnbStyle.lnb_wrap}`}>
            <img src={LnbLogo} alt="사이드바 로고" />
            <div className={`col-12 ${LnbStyle.lnb_con}`}>
                <a href="/" className="col-12">Home</a>
                <LnbList/>
                <a href="/" className="col-12">New</a>
            </div>
        </div>
    )
};

export default Lnb;