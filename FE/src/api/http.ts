/** 
 * Author : JM
 * Date : 23/07/21
 * Contents : 공통 axios 생성
*/

import axios from "axios";

export default axios.create({
    baseURL : 'http://localhost:8080/api',
    timeout: 100000,
    headers: {
        'Content-Type': 'application/json',
    },
});