import React from 'react';
import style from '../res/css/module/AppLogin.module.css'
function AppLogin() {
    return (
        <>
    <div className={style.signin_background}>
        <section className={style.signin_form}>
        <h1>LOGIN</h1>
        {/* <!-- <form class="signup-form" method = "post" action="/process/adduser"> --> */}
        <div className={style.signup_form}>
            <div className={style.int_area}>
            <input
                type="text"
                name="id"
                id="id"
                required
            />
            <label>USER NAME</label>
            </div>
            <div className={style.int_area}>
            <input
                type="password"
                name="pw"
                id="pw"
                required
            />
          <label>PASSWORD</label>
        </div>

        <div className={style.button_area}>
          <button  type="submit">LOGIN</button>
        </div>
        {/* <!-- <div class="caption">
            <a href="">Forgot Password?</a>
        </div> --> */}
      </div>
    </section>
    </div>
        
        </>
    );
}

export default AppLogin;