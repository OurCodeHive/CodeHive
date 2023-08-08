import React from 'react';
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import { userState } from '@/atom/UserAtom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import moment from 'moment';

const RedirectLogin = () => {
    let [searchParams] = useSearchParams();
    let [userInfo, setUserInfo] = useRecoilState(userState);

    const navigate = useNavigate();

    function loginPromise(key : string, value : string) {
        return new Promise((res) => {
            setTimeout(res, 300);
        }).then(() => {
            localStorage.setItem(key, value);
        })
    }

    function navigatePromise(location : string) {
        return new Promise((res) => {
            setTimeout(res, 300);
        }).then(() => {
            navigate(location);
        })
    }

    async function doLogin() {
        const email : string | null = searchParams.get("email");
        const userId : number = searchParams.get("id") as unknown as number;
        const nickname : string | null = searchParams.get("nickname");
        const token = searchParams.get("token") as string;

        await loginPromise('expireAt', moment().add(3, "minute").format("yyyy-MM-DD HH:mm:ss"));
        await loginPromise('accessToken', searchParams.get("token") as string);

        setUserInfo({
            email: email,
            userId : userId,
            nickname : nickname,
            accessToken : token,
        });
        
        await navigatePromise("/home");
    }
    
    doLogin();

    return (
        <p>메인 페이지로 리다이렉트 합니다.</p>
        );
    };

export default RedirectLogin;