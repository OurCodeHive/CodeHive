import React from 'react';
import style from "../../res/css/module/Login.module.css"
import logo from "../../res/img/CodeHive_Logo.png"
import google from "../../res/img/google_logo.png"
const Login = () => {
	return (
		<section className={style.login_form}>
        <img className={style.logo} src={logo} alt="" />
        <h1 className={style.login_title}>LOGIN</h1>
            <div className={`${style.int_area}`}>
                <input
                    type="text"
                    name="id"
                    id="id"
                    required
                />
                <label htmlFor='id'>이메일을 입력해주세요</label>
            </div>
            <div className={`${style.int_area}`}>
                <input
                    type="password"
                    name="pw"
                    id="pw"
                    required
                />
                <label htmlFor='pw'>비밀번호를 입력해주세요</label>
            </div>
          
        <div className={style.caption}>
            <a href="">회원가입</a>
            <a href="">비밀번호를 잊으셨나요?</a>
        </div>
        <div className={style.btn_area}>
            <button style={{fontWeight:"bold"}} type="submit">로그인</button>
        </div>
        <div className={`${style.btn_area}`}>
            <button className={style.google}  type="submit"><img src={google} alt="구글 아이콘" /><span style={{fontSize:"16px"}}>Google로 로그인</span></button>
        </div>
    </section>
	);
};

export default Login;