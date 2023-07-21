import React from 'react';
import style from "../../res/css/module/Signin.module.css"
import logo from "../../res/img/CodeHive_Logo.png"
const Signin = () => {
    return (
        <section className={style.login_form}>
        <img className={style.logo} src={logo} alt="" />
        <h1 className={style.login_title}>SignIn</h1>
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
            <div className={`${style.int_area}`}>
                <input
                    type="nickname"
                    name="nick"
                    id="nick"
                    required
                />
                <label htmlFor='nick'>닉네임을 입력해주세요</label>
            </div>
          
        <div className={style.btn_area}>
            <button style={{fontWeight:"bold"}} type="submit">회원가입</button>
        </div>

    </section>
    );
};

export default Signin;