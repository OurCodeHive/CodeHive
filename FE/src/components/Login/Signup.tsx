import React from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useEffect, useState, useCallback} from 'react';
import style from "@/res/css/module/Signin.module.css"
import logo from "@/res/img/codehive_logo.png"
import http from '../../api/http';
import { useNavigate } from 'react-router-dom';
// import {verifyEmail} from '@/api/onboard';
const api = http;
const Signup = () => {
    //조건 확인 변수
    let [isCodeValid, setIsCodeValid] = useState(false); //이메일 인증여부 확인
    let[passwordOK, setPasswordOk] = useState(false); //비밀번호 8-12자리 조건 확인
    let [verify, setVerify] = useState<boolean>(false); //비밀번호 일치 여부 확인
    let[nicknameOk, setNicknameOk] = useState(false); //닉네임이 중복인지 확인
    
    let[inputPW, setInputPW] = useState(false); 
    let[inputNick, setInputNick] = useState(false); 
    let[emailOk, setEmailOk] = useState(false); 
    let [email, setEmail] = useState("");
    let [code, setCode] = useState<string>("");
    let [verifiedCode, setVerifiedCode] = useState<string>("0");
    let [showCodeMsg, setShowCodeMsg] = useState(false);
    let [codeMsg, setCodeMsg] = useState("");
    let [password, setPassword] = useState("");
    let [checkPw, setCheckPw] = useState("");
    let [nickname, setNickname] = useState("");
    let[nickMsg, setNickMsg] = useState<string>("");
    let [isInput, setIsInput] = useState<boolean>(false);
    //timer values
    let [time, setTime] = useState("180");
    let[startTimer, setStartTimer] = useState(false);
    let [inputCode, setInputCode] = useState<boolean>(false);

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

    useEffect(()=>{

    })

    let navigate = useNavigate();
    const pwConfirm = useCallback((e : React.ChangeEvent<HTMLInputElement>)=>{
        const curr = e.target.value;
        console.log(password);
        if(password === curr){
            setVerify(true);
        } else {
            setVerify(false);
        }
    }, [password, checkPw])
    ///////////////////////
    //이메일 인증코드 보내기
    ///////////////////////
    function verifyEmail(email:string){
        //유효 이메일 형식 인증 로직
        const regex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        if(email === "") {
            alert("이메일을 입력해주세요")
        } else  if (regex.test(email)) {
            sendVerificationCode()
                .then((res)=> {
                if(res){
                    alert(`${res.message}`)
                }
            startCodeTimer();
            })
            .catch(console.log);
        } else {
            alert("올바른 이메일을 입력해주세요")
        }
    
        interface userData {
            status : number,
            authCode : string,
            message : string,
        }
        // const url = import.meta.env.VITE_APP_SERVER + `email/auth?email=${email}`;
        async function sendVerificationCode(): Promise<userData | undefined> {
            try {
                const response: AxiosResponse<userData> = await api.get(`/email/auth?email=${email}`);
                return response.data;
            } catch (error) {
                const err = error as AxiosError
                console.log(err);
            }
            }
            
    }
    ///////////////////////
    //이메일 인증코드 확인 //
    ///////////////////////
    function verifyCode(){
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
                setVerifiedCode(code);
                setCodeMsg(response.data.message)
                console.log(response.data.message);
                return response.data as customI;
            } catch (error:any) {
                const err = error.response.data.message as string
                setIsCodeValid(false); //코드가 유효한지 확인
                setCodeMsg(err);
                console.log(codeMsg);
                console.log(err); 
                // return err;
            }
        }
        checkVerificationCode().then((res)=>{
            res;
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

    ///////////////////////
    //닉네임 중복 체크 API//
    ///////////////////////
    function nicknameDuplicateCheck(){
        if(nickname === ""){
            setNicknameOk(false);
            setNickMsg("닉네임을 입력해주세요");
        }
        interface returnData {
            message : string,
            status : number,
        }
        // const url = import.meta.env.VITE_APP_SERVER + `check/${nickname}`;
        async function getData(): Promise<returnData | undefined> {
            try {
                const response: AxiosResponse<returnData> = await api.get(`/check/${nickname}`);
                const data = response.data as returnData
                console.log(data.message);
                setNicknameOk(true);
                setNickMsg(data.message);
                return data;
            } catch (error) {
                const err = error as any
                console.log(err.response?.data.message);
                setNickMsg(err.response.data.message);
                setNicknameOk(false);
            }
        }
        getData().then((res)=>{
            res
            // console.log(res)
        })
    }
    ////////////////////
    //회원가입 API     //
    ////////////////////
    function SignUp(){
        if(email === "" || password === "" || checkPw === "" || nickname === ""){
            alert("모든 필드를 입력해주세요");
            return;
        }
        if(verifiedCode === "0"){
            alert("이메일 인증을 완료해주세요")
            return;
        }
        if(!passwordOK){
            alert("8-12자리의 영문자, 숫자, 특수문자를 입력해주세요")
            return;
        }
        if(!verify){
            alert("비밀번호 일치 여부를 확인해주세요")
            return;
        }
        if(!nicknameOk){
            alert("닉네임 중복체크를 해주세요")
            return;
        }
        interface returnData {
            status: number,
            message: string,
            accessToken: string,
            refreshToken: string
        }
        const signUpUser = {
            email : email,
            password : password,
            authCode : verifiedCode,
            nickname : nickname,
        }
        // const url = import.meta.env.VITE_APP_SERVER + `check/${nickname}`;
        async function getData(): Promise<returnData | undefined> {
            try {
                const response: AxiosResponse<returnData> = await api.post(`/signup`, signUpUser);
                const data = response.data as returnData
                console.log(data);
                return data;
            } catch (error) {
                const err = error as any
                console.log(err);
            }
        }
        getData().then((res)=>{
            res
            // console.log(res)
        })
    }
    function startCodeTimer(){
        setInputCode(true);
        setStartTimer(true);
    }
    return (
        <div className={style.signin_background}>
        <section className={style.login_form}>
        <img onClick={()=>{navigate("/")}} className={style.logo} src={logo} alt="" />
        <h1 className={style.login_title}>Sign Up</h1>
            <div className={`${style.int_area}`}>
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    name="id"
                    id="id"
                    required
                />
                <label htmlFor='id'>이메일 E-mail</label>
                <span onClick={()=>{
                    console.log(email)
                    verifyEmail(email); 
                    }}>인증</span>
            </div>
                {
                    inputCode?
                    <>
                    <input onChange={(e) =>setCode(e.target.value)} type="text"className={style.verification_input} placeholder='Code'/>
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
                    onFocus={()=>{setIsInput(true);console.log("true")}}
                    onChange={(e)=>{
                        pwConfirm(e);
                        setCheckPw(e.target.value)
                    }}
                    
                    type="password"
                    name="newpwcheck"
                    id="newpwcheck"
                    required
                />
                <label htmlFor='newpwcheck'>비밀번호 확인</label>
                <span style={{visibility:"hidden"}}></span> 
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
            <div className={`${style.int_area}`}>
                <input onFocus={()=>setInputNick(true)}
                    onChange={(e) => {
                        setNickname(e.target.value);
                    }}
                    type="nickname"
                    name="nick"
                    id="nick"
                    required
                />
                <label htmlFor='nick'>닉네임 Nickname</label>
                <span onClick={()=>{
                    nicknameDuplicateCheck()
                    }}>중복체크</span>
            </div>
                {
                    inputNick?
                    nicknameOk?
                    <div style={{color : "#bcd806e0"}} className={style.verify_message}>{nickMsg}</div>
                    :
                    <div className={style.verify_message}>{nickMsg}</div>
                    :
                    ""
                }
        <div className={style.btn_area}>
            <button onClick={()=>{SignUp()}} style={{fontWeight:"bold"}} type="submit">회원가입</button>
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
    
};

export default Signup;