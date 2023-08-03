import React, { useEffect, useState } from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { userState } from '@/atom/UserAtom';
import style from "@/res/css/module/Home.module.css";
import {Cookies} from 'react-cookie';
import { authHttp, nonAuthHttp } from '@/api/http';
import logout from "@/res/img/logout.png";
import mypage from "@/res/img/30X30_mypage.png";
import { useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';
interface ICookies {
    get(e:string):string,
}
interface IResponse extends AxiosResponse{
    data : {
        accessToken : string,
    }
}

const cookies:ICookies = new Cookies();

const Intro = () => {
    let [day, setDay] = useState<string>("");
    let loginUser = useRecoilValue(userState);
    const navigate = useNavigate();

    useEffect(()=>{
        let hours = new Date().getHours();
    
        if (hours < 12 && hours >= 0) {
           setDay("아침이에요");
        } else if (hours >= 12 && hours <= 18) {
            setDay("오후에요");
        } else if (19 <= hours && hours < 24) {
            setDay("저녁이에요");
        }

        
    },[])
    function doLogout(){
        alert("로그아웃 하시겠습니까?");
        const aT = localStorage.getItem("accessToken");
        console.log(aT);
        const data = {
            accessToken : aT,
        }
        console.log(data);
        authHttp.post('/logout',data).then(()=>{
            localStorage.removeItem("accessToken");
            localStorage.removeItem("expireAt");
            sessionStorage.removeItem("useState");
            alert("로그아웃 되었습니다");
            navigate("/login");
        }).catch((err)=>{
            console.log(err);
            // navigate("/login");
        })
    }

    return (
        
        <div>
            <div className={style.header_bar}>
                <div className={style.header_block}>
                    <img src={mypage} alt="마이페이지" />
                    <div>마이페이지</div>
                </div>
                <div onClick={doLogout} className={style.header_block}>
                    <img src={logout} alt="로그아웃" />
                    <div>로그아웃</div>
                </div>
            </div>
            <div className={style.greeting}>좋은 {day}, {loginUser.nickname}님 </div>
        </div>
    );

    // function getDay(){
        
    // }
};

export default Intro;