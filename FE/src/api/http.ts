/** 
 * Author : JM
 * Date : 23/07/21
 * Contents : 공통 axios 생성
*/
import axios from "axios";
import { useRecoilValue } from 'recoil';
import { userState } from '@/atom/UserAtom';

//인증토큰 가지고 오기
const GetAccessToken = () => {
    //return useRecoilValue(userState).accessToken;
    return "Bearer "+ "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0QDEyMzQuY29tIiwidXNlcnNfaWQiOiI3IiwiYXV0aCI6IlJPTEVfVVNFUiIsImV4cCI6MTY5MDg2MjU1MH0.J44gCSt9MOkU4eOJe57IILz34ve_OK4nH_-85rrHT10";
}

export default axios.create({
    //baseURL : 'http://localhost:8080/api',
    baseURL : 'http://codehive.shop:8080/api',
    timeout: 100000,
    headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': '*/*',
        'Authorization' : GetAccessToken(),
    },
});