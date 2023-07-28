import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import style from "@/res/css/module/FindPassword.module.css"
import logo from "@/res/img/codehive_logo.png"
import Http from '../../api/http';
import { useNavigate } from 'react-router-dom';

const FindPassword = () => {
    //pw 입력시 뜨게 하기.
    let[verify, setVerify] = useState(false); 
    let[emailOk, setEmailOk] = useState(false); 
    let [email, setEmail] = useState("");
    let [time, setTime] = useState("180");
    let[startTimer, setStartTimer] = useState(false);
    let navigate = useNavigate();

    //timer
    const getSeconds = (time:number) =>{
        const seconds = Number(time%60);
        if(seconds<10){
            return "0"+String(seconds);
        } else {
            return String(seconds);
        }
    }
    useEffect(()=>{
        const timer = setInterval(()=>{
            if(time ==="0"){
                setTime("0");
                clearInterval(timer);
                //여기서 인증번호 못받게 하기!
            } else {
                if(startTimer){
                    setTime((prev) => String(Number(prev)-1));
                }
            }
        }, 1000);
        return()=>clearInterval(timer);
    },[startTimer, time])


    return (
        <div className={style.signin_background}>
        <section className={style.login_form}>
        <img onClick={()=>{navigate("/")}}  className={style.logo} src={logo} alt="" />
        <h1 className={style.login_title}>CHANGE PASSWORD</h1>
            <div className={`${style.int_area}`}>
                <input
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}

                    type="text"
                    name="email"
                    id="email"
                    required
                />
                <label htmlFor='email'>이메일 입력 후 인증해주세요</label>
                <span onClick={()=>{sendVerification(email)}}>인증</span>
            </div>
                {
                    verify?
                    <>
                    <input type="text"className={style.verification_input} placeholder='Code'/>
                    <span className={style.timer}>{Math.floor(Number(time)/60)} : {getSeconds(Number(time))}</span>
                    </>
                    :
                    ""
                }
         
        <div className={style.btn_area}>
            <button onClick={()=>{turnToSetPwPage()}} style={{fontWeight:"bold"}} type="submit">새 비밀번호 등록</button>
        </div>

    </section>
    </div>
    );
    //인증버튼 누르면 
    //인증코드 전송 
    function sendVerification(email : string){
        setVerify(true);
        console.log(email);
        setStartTimer(true);
        // const tempNick = Http.get("/check/"+nickname);
        // const url = import.meta.env.VITE_APP_SERVER + "check/" + nickname;
        // axios.get(url)
        // .then((res) =>{
        //     console.log(res.data);
        // })
        
    }
    function turnToSetPwPage(){
        if(true){
            //인증이 맞으면
            navigate("/changepassword");

        } else {
            //인증이 틀리면
            alert("올바른 인증번호를 입력해주세요.")
        }
    }

};

export default FindPassword;