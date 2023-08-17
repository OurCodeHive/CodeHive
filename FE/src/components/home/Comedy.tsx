import React, { useEffect, useState } from 'react';
import ComedyStyle from '@/res/css/module/Comedy.module.css';
import refresh from '@/res/img/refresh.png';
import { authHttp, nonAuthHttp } from '@/api/http';
import { AxiosError, AxiosResponse } from 'axios';


const Comedy = () => {

    const defaultComedy = {
        content: "버그의 꽃말은\r 그거 기능이에요",
        id: 1,
        writer: "이유록 님"
    }
    
    let [comedies, setComedies] = useState<ComedyItem[]>();
    let [writer, setWriter] = useState<string>(defaultComedy.writer);
    let [comedy, setComedy] = useState<string>(defaultComedy.content);
    let random = Math.floor(Math.random() * 10);
    interface ComedyItem {
        content: string; 
        writer : string;
        idx:number;
      }

    interface IComedy {
        response?: {
           data?: {
            [index:number]:{
               comedy? : ComedyItem[];
            }
            comedy? : ComedyItem[] | IComedy;
          };
        };
        comedy : ComedyItem[];
     }

    useEffect(()=>{
        getComedy();
    }, [])

    function getComedy(){
        interface userData {
            status : number,
            authCode : string,
            message : string,
        }
        // const url = import.meta.env.VITE_APP_SERVER + `email/auth?email=${email}`;
        async function requestComedy(): Promise<IComedy | undefined> {
            try {
                const response: AxiosResponse<IComedy> = await authHttp.get<IComedy>(`/comedy`);
                const {comedy} = response.data;
                if(comedy){
                    setComedies(comedy); //전체 코미디 넣기
                    // console.log(comedy)
                    setComedy(response.data.comedy[random].content); //처음 로딩할 때 0번째 인덱스 코미디 등록하기
                    setWriter(response.data.comedy[random].writer);
                }
                return response.data;
            } catch (error) {
                const err = error as AxiosError
                console.log(err);
            }
        }
        requestComedy()
        .then((res)=>{
            res;
        })
        .catch(console.log)
            
    }
    function refreshComedy(){
        resetIdx();
        if(comedies){
            setComedy(comedies[random]['content']);
            setWriter(comedies[random]['writer']);
        }
    }
    function resetIdx(){
        random = Math.floor(Math.random() * 9)
    }

    return (
        <>
        <div className={`col-12 mb5 ${ComedyStyle.comedy_title}`}>
            <span>코딩문학제 오늘의 작품</span>
            <img onClick={refreshComedy} src={"https://fitsta-bucket.s3.ap-northeast-2.amazonaws.com/Refresh.png"} alt="코딩문학제 새로고침" />
        </div>
        <div className={`col-12 ${ComedyStyle.comedy_con}`}>
            <div className={`col-12 tc ${ComedyStyle.comedy_desc}`}>
                <textarea className='col-12' name="" id="" readOnly={true} value={comedy}></textarea>
                <div className={`col-12 ${ComedyStyle.writer_name}`}>{writer}</div>
            </div>
        </div>
        </>
    );
};

export default Comedy;