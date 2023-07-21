// import React from 'react';
import style from '../res/css/module/AppLogin.module.css'

import Login from '../components/Login/Login';
import Signup from '../components/Login/Signup';
function AppLogin() {
    return (
    <>
    <div className={style.signin_background}>
        {/* <Login></Login> */}
        <Signup></Signup>
    </div>
        
        </>
    );
}

export default AppLogin;