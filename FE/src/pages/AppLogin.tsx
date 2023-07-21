// import React from 'react';
import style from '../res/css/module/AppLogin.module.css'
import logo from "../res/img/CodeHive_Logo.png"
import google from "../res/img/google_logo.png"

function AppLogin() {
    return (
    <>
    <div className={style.signin_background}>
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
                <label htmlFor='id'>EMAIL</label>
            </div>
            <div className={`${style.int_area}`}>
                <input
                    type="password"
                    name="pw"
                    id="pw"
                    required
                />
                <label htmlFor='pw'>PASSWORD</label>
            </div>
          
        <div className={style.caption}>
            <a href="">SignUp</a>
            <a href="">Forgot Password?</a>
        </div>
        <div className={style.btn_area}>
            <button type="submit">LOGIN</button>
        </div>
        <div className={`${style.btn_area}`}>
            <button className={style.google}  type="submit"><img src={google} alt="구글 아이콘" /><span>Log in with Google</span></button>
        </div>
    </section>
    </div>
        
        </>
    );
}

export default AppLogin;