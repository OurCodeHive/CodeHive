/** 
 * Author : JM
 * Date : 23/07/21
 * Contents : 공통 axios 생성
*/

import axios from "axios";

export default axios.create({
    baseURL : 'http://localhost:8080/api',
    // baseURL : 'https://hiveapi.minsungblog.com/api',
    timeout: 100000,
    headers: {
        'Content-Type': 'application/json',
        'Authorization' : 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJma2F1czc1OUBuYXZlci5jb20iLCJ1c2Vyc19pZCI6IjEiLCJhdXRoIjoiUk9MRV9VU0VSIiwiZXhwIjoxNjkwNDM3MTA1fQ.5Ev0wh7vc4tslcaB2hiIiwed4zQSi9ABdkw8MXUDvtY'
    },
});