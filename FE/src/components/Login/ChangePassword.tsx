import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState, useCallback } from 'react';
import style from "@/res/css/module/FindPassword.module.css"
import logo from "@/res/img/codehive_logo.png"
import Http from '../../api/http';
import { useNavigate } from 'react-router-dom';
import { changePasswordUserState } from '@/atom/UserAtom';
import { useRecoilState, useRecoilValue } from 'recoil';
const api = http;
const ChangePassword = () => {
    const email = useRecoilValue(changePasswordUserState);
    let [newPw, setNewPw] = useState<string>("");
    let [newPwCheck, setNewPwCheck] = useState<string>("");
    let [isInput, setIsInput] = useState<boolean>(false);
    let [verify, setVerify] = useState<boolean>(false); //비밀번호 일치 여부 
    let[inputPW, setInputPW] = useState(false); 
    let[passwordOK, setPasswordOk] = useState(false);  //8-12자 조건 맞췄는지 여부 
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

    function changePassword(){
        if(!passwordOK){
            alert("8-12자리의 영문자, 숫자, 특수문자를 입력해주세요");
            return;
        }
        if(!verify){
            alert("비밀번호 일치 여부를 확인해주세요");
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
        console.log(data);
        // const url = import.meta.env.VITE_APP_SERVER + `email/auth?email=${email}`;
        async function getData(): Promise<customI | undefined> {
            
            try {
                const response: AxiosResponse<customI> = await api.post(`/find/password`, data);
                //유효하다면
                alert(response.data.message + " 로그인 화면으로 이동합니다.");
                navigate("/login")
                return response.data as customI;
            } catch (error:any) {
                const err = error.response.data.message as string
                console.log(err);
                alert(err);
            }
        }
        getData().then((res)=>{
            res
            // if(res){
            //     setIsCodeValid(true); //코드가 유효한지 확인
            //     setCodeMsg(res.message)
            //     console.log(res);
            // }
        })
        .catch((err) => {
            console.log(err);
        })
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

    </section>
    </div>
    );
      
    // //비밀번호 변경하는 함수
    // function NewPw(){
    //     const user = {
    //         // "email" : email,
    //         "newPassword" : newPw,
    //         // "authCode" : authCode; 
    //     }
    //     const url = import.meta.env.VITE_APP_SERVER + "login/user";
    //     axios.post(url, user)
    //     .then((res) =>{
    //         console.log(res.data);
    //     })
    //     if(true){
    //         //인증이 맞으면
    //         navigate("/changePassword");

    //     } else {
    //         //인증이 틀리면
    //         alert("올바른 인증번호를 입력해주세요.")
    //     }
    // }

};

export default ChangePassword;