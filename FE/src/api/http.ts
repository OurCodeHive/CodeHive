/** 
 * Author : JM
 * Date : 23/07/21 -> modified by DY on 23/07/29
 * Contents : 공통 axios 생성 (+ interceptor 설정 후 http 역할에 따라 이분화)
*/

import {Cookies} from 'react-cookie';
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from "axios";

interface ICookies {
    get(e:string):string,
}
interface IResponse extends AxiosResponse{
    data : {
        accessToken : string,
    }
}

const cookies:ICookies = new Cookies();


// interface APIResponse<T> {
//     statusCode: number // 상태코드 (보인 서버상태코드)
//     errorCode: number // 에러코드 (본인 서버에러코드)
//     message: string // 메시지
//     result: T // 데이터 내용
//     timestamp: Date // 시간
//   }

//인증이 필요한 axios instance
const authHttp : AxiosInstance =  axios.create({
    baseURL: import.meta.env.VITE_APP_SERVER as string,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

let accessToken:string|null = localStorage.getItem("accessToken");

authHttp.interceptors.request.use(
    (config : InternalAxiosRequestConfig):InternalAxiosRequestConfig => {
        console.log(accessToken);
        if(config.headers && accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
            console.log(config);
        }
      return config;
    }
)
interface customResponse extends AxiosResponse {
    // name: string; 
    // message: string;
    // stack?: string; - Error 인터페이스 프로퍼티들을 직접 쓰거나 아니면 상속해준다.
    response?: {
       data?: {
        message?:string;
        accessToken? : string;
       };
       status: number;
       headers: string;
    };
 }
authHttp.interceptors.response.use(
    //실행
    (response : AxiosResponse): Promise<any> => {
    
      const { config, status } = response; //response의 config 파일
      const originalRequest = config;
      console.log(response);//
      console.log(status);//
      
      return response;
    },
    //에러
    (error:AxiosError) => {
        console.log(error.response?.status);
        
        if (error.response?.status === 403) {//에러 = 엑세스 토큰 만료. 확인 후 validate
            const refreshToken = cookies.get("refreshToken");
            const reIssueData = {
                accessToken : accessToken,
                refreshToken : refreshToken
            }
            return nonAuthHttp.post(`reissue`, reIssueData)//엑세스 & 리프레시 토큰 재발급
              .then((res:customResponse) => {
                if(res.status == 200){
                    accessToken = res.data.accessToken;
                    localStorage.setItem("accessToken", accessToken);
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return axios(originalRequest);
                }
              }).catch((err) => {
                console.log(err)
              })
          }


    //   console.log(error, '^^***')
    //   throw error
    }
  )

//인증이 불필요한 axios instance
const nonAuthHttp : AxiosInstance = axios.create({
    baseURL : import.meta.env.VITE_APP_SERVER as string,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})
export {authHttp, nonAuthHttp};

////////////////
//previous code 
////////////////

// export default axios.create({
//     // baseURL : 'http://localhost:8080/api',
//     baseURL : 'https://hiveapi.minsungblog.com/api',
//     timeout: 100000,
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization' : 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJma2F1czc1OUBuYXZlci5jb20iLCJ1c2Vyc19pZCI6IjEiLCJhdXRoIjoiUk9MRV9VU0VSIiwiZXhwIjoxNjkwNDM3MTA1fQ.5Ev0wh7vc4tslcaB2hiIiwed4zQSi9ABdkw8MXUDvtY'
//     },
// });