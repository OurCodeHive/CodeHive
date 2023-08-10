/** 
 * Author : JM
 * Date : 23/07/21 -> modified by DY on 23/07/29
 * Contents : 공통 axios 생성 (+ interceptor 설정 후 http 역할에 따라 이분화)
*/
import {Cookies} from 'react-cookie';
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import moment from 'moment';

interface ICookies {
    get(e:string):string,
}

interface IResponse extends AxiosResponse {
    response?: {
       data?: {
        accessToken?:string,
       };
       status: number;
       headers: string;
    };
 }

const cookies:ICookies = new Cookies();

async function reissue(accessToken: string | null) {
    await axios.create({
        baseURL: import.meta.env.VITE_APP_SERVER as string,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
        },
        withCredentials : true,
    }).post(`/reissue`, {
        accessToken : accessToken,
    }).then((res) => {
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('expireAt', moment().add(3, "minute").format("yyyy-MM-DD HH:mm:ss"))
    }).catch(() => {})
}

const nonAuthHttp : AxiosInstance = axios.create({
    baseURL : import.meta.env.VITE_APP_SERVER as string,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials : true,
})

const authHttp = axios.create({
    baseURL: import.meta.env.VITE_APP_SERVER as string,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials : true,
});

authHttp.interceptors.request.use(
    (config : InternalAxiosRequestConfig):InternalAxiosRequestConfig => {
        const expireAt = localStorage.getItem('expireAt');
        const accessToken: string | null = localStorage.getItem('accessToken');
        
        if (moment().isAfter(expireAt)) {
            reissue(accessToken);
        }

        if (config.headers && accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

      return config;
    }
)

// authHttp.interceptors.response.use(
//     async (response : IResponse): Promise<any> => {
//       const { config, status } = response; //response의 config 파일
//       const originalRequest = config;

//       if (response.data.accessToken && response.data.grantType === "Bearer") {
//         const accessToken = response.data.accessToken;
//         localStorage.setItem("accessToken", accessToken);
//         originalRequest.headers.Authorization = `Bearer ${accessToken}`
//         console.log("access renewed!");
//         return await axios(originalRequest).then((res)=>{
//             console.log(res);
//         }).catch((err) => {
//             console.log("errr");
//             console.log(err);
//         })
//       }
//       return response;
//     },
//     // 에러
//     (error) => {
//       console.log(error, '^^***')
//       throw error
//     }
//   )

const formHttp : AxiosInstance = axios.create({
    baseURL : import.meta.env.VITE_APP_SERVER as string,
    timeout: 10000,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
    withCredentials : true,
})

formHttp.interceptors.request.use(
    (config : InternalAxiosRequestConfig):InternalAxiosRequestConfig => {
      const expireAt = localStorage.getItem('expireAt');
      const accessToken: string | null = localStorage.getItem('accessToken');
      
      if (moment().isAfter(expireAt)) {
          reissue(accessToken);
      }

      if (config.headers && accessToken){
          config.headers.Authorization = `Bearer ${accessToken}`;
      }

    return config;
    }
)

export {authHttp, nonAuthHttp, formHttp};

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