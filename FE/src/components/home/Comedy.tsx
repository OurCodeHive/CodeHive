import React, { useEffect, useState } from 'react';
import style from '@/res/css/module/Home.module.css';
import refresh from '@/res/img/refresh.png';
import { authHttp, nonAuthHttp } from '@/api/http';
import { AxiosError, AxiosResponse } from 'axios';
const Comedy = () => {
    let [comedy, setComedy] = useState<string>("test");
    let random = 0;

    useEffect(()=>{
        // nonAuthHttp.get(`/comedy?random=${0}`).then((res)=>{
        //     setComedy(res.data.comedy);
        //     console.log(res.data.comedy);
        // })
        getComedy();
    }, [])

    function getComedy(){
        interface userData {
            status : number,
            authCode : string,
            message : string,
        }
        // const url = import.meta.env.VITE_APP_SERVER + `email/auth?email=${email}`;
        async function requestComedy(): Promise<userData | undefined> {
            try {
                const response: AxiosResponse<userData> = await nonAuthHttp.get(`/comedy?random=${random++}`);
                setComedy(response.data.comedy);
                console.log(response.data.comedy);
                return response.data;

            } catch (error) {
                const err = error as AxiosError
                console.log(err);
            }
        }
        requestComedy()
        .then((res)=>{
            console.log(res.comedy);
            setComedy(res.message);
        })
        .catch(()=>{

        })
            
    }
    return (
        <div>
            <div className={style.subtitle_comedy}>코딩문학제 오늘의 작품 <img src={refresh} alt="코딩문학제 새로고침" /></div>
                <div className={style.box}>
                    <div className={style.content}>
                        {comedy}
                    </div>
                </div>
            </div>
        
    );
};

export default Comedy;