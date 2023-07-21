// import React from 'react';
import style from '../res/css/module/AppLogin.module.css'

import Login from '../components/Login/Login';
import Signin from '../components/Login/Signin';
function AppLogin() {
    return (
    <>
    <div className={style.signin_background}>
        {/* <Login></Login> */}
        <Signin></Signin>
    </div>
        
        </>
    );
}

export default AppLogin;