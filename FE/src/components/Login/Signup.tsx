import React from 'react';
import { useEffect, useState } from 'react';
import style from "../../res/css/module/Signin.module.css"
import logo from "../../res/img/CodeHive_Logo.png"
const Signin = () => {
    let[inputPW, setInputPW] = useState(false); 
    

    return (
        <section className={style.login_form}>
        <img className={style.logo} src={logo} alt="" />
        <h1 className={style.login_title}>Sign Up</h1>
            <div className={`${style.int_area}`}>
                <input
                    type="text"
                    name="id"
                    id="id"
                    required
                />
                <label htmlFor='id'>이메일을 입력해주세요</label>
                <span>인증</span>
            </div>
            <div className={`${style.int_area}`}>
                <input onFocus={()=>(setInputPW(true))}
                    type="password"
                    name="pw"
                    id="pw"
                    required
                />
                <label  htmlFor='pw'>비밀번호를 입력해주세요</label>
                <span style={{visibility:"hidden"}}></span> 
            </div>
            {
                inputPW?
                    <div className={style.verify_message}> 8 ~ 12자리의 영문자, 숫자, 특수문자를 입력해주세요.</div>
                :
                ""
            }        
            
            <div className={`${style.int_area}`}>
                <input
                    type="nickname"
                    name="nick"
                    id="nick"
                    required
                />
                <label htmlFor='nick'>닉네임을 입력해주세요</label>
                <span>중복체크</span>
            </div>
                <div className={style.verify_message}>사용 가능한 닉네임입니다</div>
          
        <div className={style.btn_area}>
            <button style={{fontWeight:"bold"}} type="submit">회원가입</button>
        </div>

    </section>
    );
    function checkPassword(){
        const regex = /^(?=.[a-zA-z])(?=.[0-9])(?=.[$`~!@$!%#^?&\(\)-_=+]).{8,12}$/;
          if (regex.test("sdf")) {
        //사용가능
          } else {
        //사용불가능
          }

    }
};

export default Signin;