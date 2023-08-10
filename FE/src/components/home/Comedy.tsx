import React, { useEffect, useState } from 'react';
import ComedyStyle from '@/res/css/module/Comedy.module.css';
import refresh from '@/res/img/refresh.png';
import { authHttp, nonAuthHttp } from '@/api/http';
import { AxiosError, AxiosResponse } from 'axios';
const Comedy = () => {
    let [comedies, setComedies] = useState<ComedyItem[]>();
    let [writer, setWriter] = useState<string>();
    let [comedy, setComedy] = useState<string>("testtest");
    let random = Math.floor(Math.random() * 10);
    let [idx, setIdx] = useState<number>(random);
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
    //  interface IComedy {
    //      response?: {
    //         data?: {
    //          comedy? {

    //          }
    //         };
    //         status: number;
    //         headers: string;
    //      };
    //  }
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
                console.log(response.data);
                const {comedy} = response.data;
                if(comedy){
                    setComedies(comedy); //전체 코미디 넣기
                    setComedy(response.data.comedy[idx].content); //처음 로딩할 때 0번째 인덱스 코미디 등록하기
                    setWriter(response.data.comedy[idx].writer);
                }
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
        .catch(console.log)
            
    }
    function refreshComedy(){
        // console.log(comedy.length);
        // if(idx === 8){
        //     console.log("zero!");
        //     setIdx(0);
        // } else {
        //     setIdx(++idx);
        // }
        resetIdx();
        // setIdx(Math.floor(Math.random() * 10));
        console.log(idx);
        if(comedies){
            setComedy(comedies[idx]['content']);
            setWriter(comedies[idx]['writer']);
        }
    }
    function resetIdx(){
        // random = Math.floor(Math.random() * 10)
        console.log(comedy.length);
        if(idx === 8){
            console.log("zero!");
            setIdx(0);
        } else {
            setIdx(++idx);
        }
        // setIdx(Math.floor(Math.random() * 10));
    }

    return (
        <div className={`col-12 ${ComedyStyle.comedy_con}`}>
            <div className={`col-12 mb10 ${ComedyStyle.comedy_title}`}>
                <span>코딩문학제 오늘의 작품</span>
                <img onClick={refreshComedy} src={refresh} alt="코딩문학제 새로고침" />
            </div>
            <div className={`col-12 tc ${ComedyStyle.comedy_desc}`}>
                <textarea className='col-12' name="" id="" readOnly={true}>{comedy}</textarea>
                <div className={`col-12 ${ComedyStyle.writer_name}`}>{writer}</div>
            </div>
        </div>
    );
};

export default Comedy;