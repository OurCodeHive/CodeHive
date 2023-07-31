/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AxiosRequestConfig } from "axios";
import Cookie from "js-cookie";
import moment from "moment";
import {http} from "./http";
import { useNavigate } from "react-router-dom";
// const api = http;


const refreshError = (err:any) => {
    // Cookie.remove("refreshToken");
    console.log("token err!");

    //유저정보 remove
    sessionStorage.clear();
    localStorage.clear();
    alert("세션이 만료되었습니다. 다시 로그인 해주세요.")
    return err;
    // return Promise.

}
export {refresh, refreshError};


const refresh = async(config : AxiosRequestConfig) : Promise<AxiosRequestConfig> => {
    try {
        const refreshToken = Cookie.get("refreshToken");//시간을 걸어서 준 리프레시토큰
        console.log(refreshToken);
    } catch(err){
        console.log(err);
    }}

        const expireAt = localStorage.getItem("expireAt");
        let accessToken = localStorage.getItem("accessToken")
        // const userState = localStorage.getItem("useState");
        // //null 처리 - 타입에러 방지
        // if(!userState){
        //     throw new Error("No saved accessToken");
        // }
        
        //토큰이 만료되었고, refreshToken이 저장되어 있을때 (refreshtoken은 항상 저장돼있음.)
        if(moment(expireAt).diff(moment())<0 && refreshToken){
            const data = {
                refreshToken : refreshToken,//time
                accessToken : accessToken
            }
            //refresh token을 보내서 
            const result = await http.post(``, data); //에러처리는..?
            //accessToken 재정의
             accessToken = result.accessToken;
            //다시 accessToken을 저장
            localStorage.setItem("accessToken", result.accessToken);
            //유효기간 저장 (3분 더)
            localStorage.setItem("expiresAt", moment().add(3,"minute").format("yyyy-MM-DD HH:mm:ss") as string);
     
        config.headers["Authorization"] = `Bearer ${accessToken}`;
    
        return config;

    } 

    // console.log("catched!");

 


}