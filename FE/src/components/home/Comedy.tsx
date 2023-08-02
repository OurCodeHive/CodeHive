import React, { useEffect, useState } from 'react';
import style from '@/res/css/module/Home.module.css';
import refresh from '@/res/img/refresh.png';
import { authHttp, nonAuthHttp } from '@/api/http';
import { AxiosError, AxiosResponse } from 'axios';
const Comedy = () => {
    let [comedies, setComedies] = useState([]);
    let [author, setAuthor] = useState([]);
    let [comedy, setComedy] = useState<string>("test");
    let [idx, setIdx] = useState<number>(0);
    let random = 0;

    useEffect(()=>{
        // nonAuthHttp.get(`/comedy?random=${0}`).then((res)=>{
        //     setComedy(res.data.comedy);
        //     console.log(res.data.comedy);
        // })
        getComedy();
    }, [])

    useEffect(()=>{
        setComedy(comedies[idx]["content"]);
        console.log(comedy);
    }, [idx])

    function getComedy(){
        interface userData {
            status : number,
            authCode : string,
            message : string,
        }
        // const url = import.meta.env.VITE_APP_SERVER + `email/auth?email=${email}`;
        async function requestComedy(): Promise<userData | undefined> {
            try {
                const response: AxiosResponse<userData> = await nonAuthHttp.get(`/comedy`);
                console.log(response.data.comedy[0]);
                setComedies(response.data.comedy); //전체 코미디 넣기
                setComedy(response.data.comedy[idx]["content"]); //처음 로딩할 때 0번째 인덱스 코미디 등록하기
                console.log(comedy);
                return response.data;
            } catch (error) {
                const err = error as AxiosError
                console.log(err);
            }
        }
        requestComedy()
        .then((res)=>{
            // console.log(res.comedy);
            // setComedy(res.message);
        })
        .catch(()=>{

        })
            
    }
    function refreshComedy(){
        if(idx === comedy.length-1){
            setIdx(0);
        } else {
            setIdx(idx+1)
        }
    }
    return (
        <div>
            <div className={style.subtitle_comedy}>코딩문학제 오늘의 작품 <img onClick={refreshComedy} src={refresh} alt="코딩문학제 새로고침" /></div>
                <div className={style.box}>
                    <textarea className={style.content_comedy} name="" id="" cols="40" rows="20">
                        {comedy}
                        {author}
                    </textarea>
                    </div>
                </div>
          
        
    );
};

export default Comedy;