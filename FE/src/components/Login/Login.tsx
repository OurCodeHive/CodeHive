import React from 'react';
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import { userState } from '@/atom/UserAtom';
import { nonAuthHttp, authHttp } from '@/api/http';
import style from "@/res/css/module/Login.module.css"
import logo from "@/res/img/codehive_logo.png"
import google from "@/res/img/google_logo.png"
import { useNavigate } from 'react-router-dom';
import { PassThrough } from 'stream';
import moment from 'moment';
import axios, {AxiosError, AxiosResponse} from 'axios';


const Login = () => {
    let [email, setEmail] = useState("")
    let [pw, setPw] = useState("");
    let [userInfo, setUserInfo] = useRecoilState(userState);

    const navigate = useNavigate();

    function signUpPage(event: React.MouseEvent<HTMLAnchorElement> ) {
        event.preventDefault();
        navigate("/signup");
    }

    function findPassword(event: React.MouseEvent<HTMLAnchorElement> ) {
        event.preventDefault();
        navigate("/findpassword");
    }
    function enter(e:React.KeyboardEvent<HTMLInputElement>):void{
        if(e.key === 'Enter'){
            login();
        }
    }
    ////////////////////////////
    //로그인 클릭 시 실행되는 함수
    ////////////////////////////
    function login(){
        if(email === "" || pw === ""){
            alert("이메일과 비밀번호를 입력해주세요");
            return;
        }
        const user = {
            "email" : email,
            "password" : pw
        }
        interface userData {
            status : number,
            message : string,
            accessToken : string,
            refreshToken : string,
            userId : number,
            nickname : string,
        }
        async function doLogin(): Promise<userData | undefined> {
            try {
              ///
              const response: AxiosResponse<userData> = await nonAuthHttp.post("login/user", user);
              console.log(response.data);
              alert("로그인에 성공하였습니다");
              //recoil!
              setUserInfo({
                email : email,
                userId : response.data.userId,
                nickname : response.data.nickname,
                accessToken : response.data.accessToken,
                refreshToken: response.data.refreshToken});
               localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
               localStorage.setItem("expireAt", moment().add(3, "minute").format("yyyy-MM-DD HH:mm:ss"));
               navigate("/home");
              return response.data;
            } catch (error) {
                // const err = error as any
                console.log(error); //실패는 여기로
                // alert(error.response?.data.message);
                alert("로그인에 실패하였습니다.")
                return;
            }
          }
          doLogin()
          .then((res)=>{
            console.log(res);
            // alert("로그인 되었습니다");
          })
          .catch((err) => {console.log(err)})
    }
    function googleLogin(){
        const user = {
            "email" : email,
            "password" : pw
        }
        // const url = import.meta.env.VITE_APP_SERVER + "login/google";
        nonAuthHttp.post(``, user)
        .then((res) =>{
            console.log(res.data);
        }).catch(console.log)
    }

	return (
        <div className={style.signin_background}>
		<section className={style.login_form}>
        <img onClick={()=>{navigate("/")}} className={style.logo} src={logo} alt="" />
        <h1 className={style.login_title}>LOGIN</h1>
            <div className={`${style.int_area}`}>
                
                <input
                onChange={(e) => {
                    setEmail(e.target.value);
                }}
                    type="text"
                    name="id"
                    id="id"
                    required
                />
                <label htmlFor='id'>이메일을 입력해주세요</label>
            </div>
            <div className={`${style.int_area}`}>
                <input

                onChange={(e) => {
                    setPw(e.target.value);
                }}
                onKeyDown={(e)=>{enter(e)}}
                    type="password"
                    name="pw"
                    id="pw"
                    required
                />
                <label htmlFor='pw'>비밀번호를 입력해주세요</label>
            </div>
          
        <div className={style.caption}>
            <a onClick={(event)=>signUpPage(event)} href="">회원가입</a>
            <a onClick={(event)=>findPassword(event)} href="">비밀번호를 잊으셨나요?</a>
        </div>
        <div className={style.btn_area}>
            <button  onClick={login} style={{fontWeight:"bold"}} type="submit">로그인</button>
        </div>
        <div className={`${style.btn_area}`}>
            {/* <button onClick={googleLogin} className={style.google}  type="submit"><img src={google} alt="구글 아이콘" /><span style={{fontSize:"16px"}}>Google로 로그인</span></button> */}
            <a href='https://hiveapi.minsungblog.com/oauth2/authorize/google?redirect_uri=http://localhost:5173/study' className={style.google}  type="submit"><img src={google} alt="구글 아이콘" /><span style={{fontSize:"16px"}}>Google로 로그인</span></a>
        </div>
    </section>
    </div>
	);
};

export default Login;