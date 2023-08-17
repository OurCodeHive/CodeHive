import React from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { AlertPopup } from '@/utils/Popup';
import { useEffect, useState } from 'react';
import style from "@/res/css/page/FindPassword.module.css"
import logo from "@/res/img/codehive_logo.png"
import {nonAuthHttp} from '../../api/http';
import { useNavigate } from 'react-router-dom';
import { changePasswordUserState } from '@/atom/UserAtom';
import { useRecoilState } from 'recoil';
import { EmailCheck } from '@/utils/valid/Valid';

const api = nonAuthHttp;
const FindPassword = () => {
    const navigate = useNavigate();
    const [AlertPopupFlag, setAlertPopupFlag] = useState(false);
    const [AlertPopupTitle, setAlertPopupTitle] = useState<string>("");
    const AlertPopupInfo = {
        PopupStatus : AlertPopupFlag,
        zIndex : 10000,
        maxWidth: 500,
        PopupTitle : AlertPopupTitle,
        ClosePopupProp : () => setAlertPopupFlag(() => false),
    }
    const [CompletePopupFlag, setCompletePopupFlag] = useState(false);
    const CompletePopupInfo = {
        PopupStatus : CompletePopupFlag,
        zIndex : 10000,
        maxWidth: 500,
        PopupTitle : "인증을 완료했습니다.",
        ClosePopupProp : () => CompletePopup(false),
    }
    function CompletePopup(flag: boolean){
        setCompletePopupFlag(() => flag);
        navigate("/changepassword");
    }

    let [verifiedEmail, setverifiedEmail] = useRecoilState(changePasswordUserState);
    //pw 입력시 뜨게 하기.
    let[verify, setVerify] = useState(false);
    let [email, setEmail] = useState("");
    let [time, setTime] = useState("180");
    let[startTimer, setStartTimer] = useState(false);
    let [code, setCode] = useState<string>("");
    let [isCodeValid, setIsCodeValid] = useState(false);
    let [showCodeMsg, setShowCodeMsg] = useState(false);
    let [codeMsg, setCodeMsg] = useState("");
    let [sending, setSending] = useState<boolean>(false);

    function turnToSetPwPage(){
        if(isCodeValid==false || email === ""){
            setAlertPopupTitle(() => "이메일 인증을 완료해주세요");
            setAlertPopupFlag(() => true);
            return;
        }
        setCompletePopupFlag(() => true);

    }
    ///////////////////////
    //이메일 인증코드 보내기
    ///////////////////////
    function verifyEmail(email:string){
        if(EmailCheck(email)){
            sendVerificationCode()
                .then((res)=> {
                    setSending(false);
                if(res){
                    setAlertPopupTitle(() => "성공적으로 비밀번호 찾기<br/>인증메일을 전송하였습니다.");
                    setAlertPopupFlag(() => true);
                    setStartTimer(true);
                    setVerify(true);
                }
            // startCodeTimer();
            })
            .catch((err)=>{
                console.log(err);
            });
        } else {
            setAlertPopupTitle(() => "올바른 이메일을 입력해주세요");
            setAlertPopupFlag(() => true);
        }
    
        interface userData {
            status : number,
            authCode : string,
            message : string,
        }
        interface ErrorResponse {
            response?: {
              data?: {
                message?: string;
              };
            };
          }
        // const url = import.meta.env.VITE_APP_SERVER + `email/auth?email=${email}`;
        async function sendVerificationCode(): Promise<userData | undefined> {
            try {
                setSending(true);
                const response: AxiosResponse<userData> = await api.get(`/email/find?email=${email}`);
                return response.data;
            } catch (error) {
                setSending(false);
                const err = error as ErrorResponse;
                console.log(err);
                alert(err.response?.data?.message);
            }
        }
    }
    function verifyCode(){
        interface CustomError extends Error {
            // name: string; 
            // message: string;
            // stack?: string; - Error 인터페이스 프로퍼티들을 직접 쓰거나 아니면 상속해준다.
            response?: {
               data?: {
                message:string
               };
               status: number;
               headers: string;
            };
         }
        interface customI {
            status : number,
            message : string,
        }
        const data = {
            email : email,
            authCode : code
        }
        // const url = import.meta.env.VITE_APP_SERVER + `email/auth?email=${email}`;
        async function checkVerificationCode(): Promise<customI | undefined> {
            if(time === "0"){
                setCodeMsg("인증시간이 만료되었습니다");
                setIsCodeValid(false);
                return;
            }
            if(code === ""){
                setCodeMsg("코드를 입력해주세요");
                setIsCodeValid(false);
                return;
            }
            try {
                const response: AxiosResponse<customI> = await api.post(`/email/auth?email=${email}`, data);
                setIsCodeValid(true); //코드가 유효한지 확인
                setverifiedEmail(email);
                setCodeMsg(response.data.message);
                return response.data
            } catch (error) {
                const err = error as CustomError;
                const msg = err?.response?.data?.message;
                setIsCodeValid(false); //코드가 유효한지 확인
                setCodeMsg(msg as string);
            }
        }
        checkVerificationCode().then((res)=>{
            res
        })
        .catch((err) => {
            console.log(err);
        })
    }

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
                <span onClick={()=>{
                    verifyEmail(email); 
                    }}
                    style= {
                        sending?
                        {display : "none"}
                         :
                        {}
                    }
                    >인증</span>
                <span style={sending? {} : {display : "none"}}>전송중</span>
            </div>
                {
                    verify?
                    <>
                    <input onChange={(e) => {setCode(e.target.value)}} type="text"className={style.verification_input} placeholder='Code'/>
                    <span className={style.timer}>{Math.floor(Number(time)/60)} : {getSeconds(Number(time))}</span>
                    <span onClick={()=>{verifyCode(); setShowCodeMsg(true)}} className={style.emailCheck}>확인</span>
                    </>
                    :
                    ""
                }
                {
                    showCodeMsg?
                    (isCodeValid? //default = false
                    <div className={style.verify_message} style={{marginTop : "10px", color : "#b9ea16"}}>{codeMsg}</div>
                    :
                    <div style={{marginTop : "10px"}} className={style.verify_message}>{codeMsg}</div>
                    )
                    :""
                }
         
        <div className={style.btn_area}>
            <button onClick={()=>{turnToSetPwPage()}} style={{fontWeight:"bold"}} type="submit">새 비밀번호 등록</button>
        </div>
        <AlertPopup PopupInfo={AlertPopupInfo} />
        <AlertPopup PopupInfo={CompletePopupInfo} />
    </section>
    </div>
    );

};

export default FindPassword;