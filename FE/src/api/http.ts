/** 
 * Author : JM
 * Date : 23/07/21 -> modified by DY on 23/07/29
 * Contents : 공통 axios 생성 (+ interceptor 설정 후 http 역할에 따라 이분화)
*/

import axios from "axios";
// import {refresh, refreshError} from "./token";

//인증이 필요한 axios instance
const authHttp =  axios.create({
    baseURL : import.meta.env.VITE_APP_SERVER,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

authHttp.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("accessToken")
      config.headers.common["Authorization"] = `Bearer ${accessToken}`
      return config
    }
)

  restApi.interceptors.response.use(
    async (response) => {
      const { config } = response;
      const originalRequest = config;
  
      if (response?.data?.code == 40300) {
        const refresh_token = await getStorage("refreshToken")
        return await restApi.get(`/account/token?refreshToken=${refresh_token}`)
          .then(async (res) => {
            if (res.data.message === "OK") {
              setStorage("token", res.data.payload.access_token)
              originalRequest.headers.Authorization = `${res.data.payload.access_token}`;
              return axios(originalRequest);
            } 
  
          }).catch((err) => {
            console.log(err)
          })
      }
  
      return response;
    },
    async (error) => {
  
      console.log(error, '^^***')
      throw error
  
    }
  )









// http.interceptors.request.use(refresh, refreshError);

//인증이 불필요한 axios instance
const nonAuthHttp = axios.create({
    // baseURL : 'https://hiveapi.minsungblog.com/api',
    baseURL : 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})
export {http, nonAuthHttp};


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