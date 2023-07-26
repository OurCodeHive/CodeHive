import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import style from "../../res/css/module/Signin.module.css"
import logo from "../../res/img/CodeHiveLogo.png"
import Http from '../../api/http';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    //pw 입력시 뜨게 하기.
    let[inputPW, setInputPW] = useState(false); 
    let[inputNick, setInputNick] = useState(false); 
    let[passwordOK, setPasswordOk] = useState(false); 
    let[emailOk, setEmailOk] = useState(false); 
    let[nicknameOk, setNicknameOk] = useState(false); 
    let [email] = useState("");
    let [password, setPassword] = useState("");
    let [nickname, setNickname] = useState("");
    
    let navigate = useNavigate();
    return (
        <div className={style.signin_background}>
        <section className={style.login_form}>
        <img onClick={()=>{navigate("/")}}  className={style.logo} src={logo} alt="" />
        <h1 className={style.login_title}>Sign Up</h1>
            <div className={`${style.int_area}`}>
                <input
                    type="text"
                    name="id"
                    id="id"
                    required
                />
                <label htmlFor='id'>이메일 E-mail</label>
                <span>인증</span>
            </div>
            <div className={`${style.int_area}`}>
                <input onFocus={()=>(setInputPW(true))}
                onChange={(e) => {
                    setPassword(e.target.value);
                    console.log(e.target.value);
                    checkPassword(e.target.value);
                }}
                
                    type="password"
                    name="pw"
                    id="pw"
                    required
                />
                <label  htmlFor='pw'>비밀번호 Password</label>
                <span style={{visibility:"hidden"}}></span> 
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
                    onChange={(e) => {
                        setNickname(e.target.value);
                    }}

                    type="nickname"
                    name="nick"
                    id="nick"
                    required
                />
                <label htmlFor='nick'>닉네임 Nickname</label>
                <span onClick={()=>{checkNickName(nickname)}}>중복체크</span>
            </div>
                {
                    inputNick?
                    nicknameOk?
                    <div className={style.verify_message}>사용 가능한 닉네임입니다.</div>
                    :
                    <div className={style.verify_message}>이미 사용중인 닉네임입니다.</div>
                    :
                    ""
                }
         
        <div className={style.btn_area}>
            <button style={{fontWeight:"bold"}} type="submit">회원가입</button>
        </div>

    </section>
    </div>
    );
    function checkPassword(input : string){
        const regex = /^.*(?=^.{8,12}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
          if (regex.test(input)) {
        //사용가능
            setPasswordOk(true);
        } else {
            setPasswordOk(false);
          }

    }
    function checkNickName(nickname : string){
        setInputNick(true);
        // const tempNick = Http.get("/check/"+nickname);
        const url = import.meta.env.VITE_APP_SERVER + "check/" + nickname;
        axios.get(url)
        .then((res) =>{
            console.log(res.data);
        })
        // console.log(tempNick);

        // .meta.REACT_APP_SERVER
    //     const url = process.env.REACT_APP_SERVER + "check/" + nickname;
    //     axios.get(url)
    //     .then((result) => {
    //         console.log(result.data)
    // })
    // .catch((err) => {
    //   console.log(err)
    // })
    }
};

export default Signup;