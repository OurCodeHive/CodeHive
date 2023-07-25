import React from 'react';
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import style from "../../res/css/module/FindPassword.module.css"
import logo from "../../res/img/CodeHiveLogo.png"
import Http from '../../api/http';
import { useNavigate } from 'react-router-dom';
const ChangePassword = () => {
    let [newPw, setNewPw] = useState<string>("");
    let [newPwCheck, setNewPwCheck] = useState<string>("");
    let [isInput, setIsInput] = useState<boolean>(false);
    let [verify, setVerify] = useState<boolean>(false);
    let navigate = useNavigate();

    const pwConfirm = useCallback((e : React.ChangeEvent<HTMLInputElement>)=>{
        const curr = e.target.value;
        console.log(newPw);
        if(newPw === curr){
            setVerify(true);
        } else {
            setVerify(false);
        }
    }, [newPw, newPwCheck])

    return (
        <div className={style.signin_background}>
        <section className={style.login_form}>
        <img onClick={()=>{navigate("/")}}  className={style.logo} src={logo} alt="" />
        <h1 className={style.login_title}>CHANGE PASSWORD</h1>
            <div className={`${style.int_area}`}>
                <input
                    onChange={(e) => {
                        setNewPw(e.target.value);
                    }}
                    type="text"
                    name="newpw"
                    id="newpw"
                    required
                />
                <label htmlFor='newpw'>새 비밀번호</label>
            </div>
            <div className={`${style.int_area}`}>
                <input
                    onFocus={()=>{setIsInput(true);console.log("true")}}
                    onChange={pwConfirm}
                    type="text"
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
            <button onClick={NewPw} style={{fontWeight:"bold"}} type="submit">비밀번호 변경</button>
        </div>

    </section>
    </div>
    );
      
    //비밀번호 변경하는 함수
    function NewPw(){
        const user = {
            // "email" : email,
            "newPassword" : newPw,
            // "authCode" : authCode; 
        }
        const url = import.meta.env.VITE_APP_SERVER + "login/user";
        axios.post(url, user)
        .then((res) =>{
            console.log(res.data);
        })
        if(true){
            //인증이 맞으면
            navigate("/changePassword");

        } else {
            //인증이 틀리면
            alert("올바른 인증번호를 입력해주세요.")
        }
    }

};

export default ChangePassword;