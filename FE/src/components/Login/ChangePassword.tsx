import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { AlertPopup } from '@/utils/Popup';
import { useEffect, useState, useCallback } from 'react';
import style from "@/res/css/page/FindPassword.module.css"
import logo from "@/res/img/codehive_logo.png"
import {nonAuthHttp} from '../../api/http';
import { useNavigate } from 'react-router-dom';
import { changePasswordUserState } from '@/atom/UserAtom';
import { useRecoilState, useRecoilValue } from 'recoil';
const api = nonAuthHttp;


const ChangePassword = () => {
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
        PopupTitle : "비밀번호 변경이 완료되었습니다.<br/>로그인 화면으로 이동합니다.",
        ClosePopupProp : () => CompletePopup(false),
    }
    function CompletePopup(flag: boolean){
        setCompletePopupFlag(() => flag);
        navigate("/login")        
    }

    const email = useRecoilValue(changePasswordUserState);
    let [newPw, setNewPw] = useState<string>("");
    let [newPwCheck, setNewPwCheck] = useState<string>("");
    let [isInput, setIsInput] = useState<boolean>(false);
    let [verify, setVerify] = useState<boolean>(false); //비밀번호 일치 여부 
    let[inputPW, setInputPW] = useState(false); 
    let[passwordOK, setPasswordOk] = useState(false);  //8-12자 조건 맞췄는지 여부 

    const pwConfirm = useCallback((e : React.ChangeEvent<HTMLInputElement>)=>{
        const curr = e.target.value;
        if(newPw === curr) setVerify(true);
        else setVerify(false);
    }, [newPw, newPwCheck]);

    function changePassword(){
        if(!passwordOK){
            setAlertPopupTitle(() => "8-12자리의 영문자, 숫자, 특수문자를 입력해주세요");
            setAlertPopupFlag(() => true);
            return;
        }
        if(!verify){
            setAlertPopupTitle(() => "비밀번호 일치 여부를 확인해주세요");
            setAlertPopupFlag(() => true);
            return;
        }
        interface customI {
            status : number,
            message : string,
        }
        const data = {
            email : email,
            newPassword : newPw,
        }
  
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
        async function getData(): Promise<customI | undefined> {
            
            try {
                const response: AxiosResponse<customI> = await api.post(`/find/password`, data);
                //유효하다면
                setCompletePopupFlag(() => true);
                return response.data
            } catch (error) {
                const err = error as CustomError;
                const msg = err?.response?.data?.message as string
                console.log(err);
                alert(err);
            }
        }
        getData().then((res)=>{res})
        .catch((err) => {console.log(err);})
    }
    function checkPassword(input : string){
        const regex = /^.*(?=^.{8,12}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
          if (regex.test(input)) {
        //사용가능
            setPasswordOk(true);
        } else {
            setPasswordOk(false);
          }
    }

    return (
        <div className={style.signin_background}>
        <section className={style.login_form}>
        <img onClick={()=>{navigate("/")}}  className={style.logo} src={logo} alt="" />
        <h1 className={style.login_title}>CHANGE PASSWORD</h1>
            <div className={`${style.int_area}`}>
                <input onFocus={()=>(setInputPW(true))}
                    onChange={(e) => {
                        setNewPw(e.target.value);
                        checkPassword(e.target.value);
                    }}
                    type="password"
                    name="newpw"
                    id="newpw"
                    required
                />
                <label htmlFor='newpw'>새 비밀번호</label>
            </div>
            {
                inputPW?
                    (passwordOK?
                    <div className={style.verify_message} style={{color : "#b9ea16"}}> 사용 가능한 비밀번호입니다.</div>
                    :
                    <div className={style.verify_message}> 8 ~ 12자리의 영문자, 숫자, 특수문자를 입력해주세요.</div>
                    )
                : ""
            }   
            <div className={`${style.int_area}`}>
                <input
                    onFocus={()=>{setIsInput(true);console.log("true")}}
                    onChange={pwConfirm}
                    type="password"
                    name="newpwcheck"
                    id="newpwcheck"
                    required
                />
                <label htmlFor='newpwcheck'>비밀번호 확인</label>
            </div>
                {
                    isInput?
                    verify?
                    <div style={{color : "#bcd806e0"}} className={style.verify_message}>비밀번호가 일치합니다.</div>
                    :
                    <div className={style.verify_message}>비밀번호가 일치하지 않습니다.</div>
                    :
                    ""
                }
        <div className={style.btn_area}>
            <button onClick={changePassword} style={{fontWeight:"bold"}} type="submit">비밀번호 변경</button>
        </div>
        <AlertPopup PopupInfo={AlertPopupInfo} />
        <AlertPopup PopupInfo={CompletePopupInfo} />
    </section>
    </div>
    );
};

export default ChangePassword;