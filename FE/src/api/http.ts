/** 
 * Author : JM
 * Date : 23/07/21
 * Contents : 공통 axios 생성
*/

import axios from "axios";

export default axios.create({
    baseURL : 'http://43.202.3.95/api',
    timeout: 100000,
    headers: {
        'Content-Type': 'application/json',
        'Authorization' : 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnbGVlaGF2ZUBnbWFpbC5jb20iLCJ1c2Vyc19pZCI6IjEiLCJhdXRoIjoiUk9MRV9VU0VSIiwiZXhwIjoxNjkwMzM0MDgwfQ.iv3X-kzIBGpWjnjyRSKkaqrgG5HTct8KCN_Vy-RI55A'
    },
});