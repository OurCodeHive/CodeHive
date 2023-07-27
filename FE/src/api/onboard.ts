import { AxiosError, AxiosResponse } from 'axios';
import http from './http';
const api = http;

///////////////////////////////
//이메일 인증 클릭 시 실행되는 함수
///////////////////////////////
function verifyEmail(email:string){
    //유효 이메일 형식 인증 로직
        const regex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
          if (regex.test(email)) {
            sendVerificationCode()
                .then((res)=> {
                if(res){
                    alert(`${res.message}`)
                }
        });
        } else {
            alert("올바른 이메일을 입력해주세요")
          }

    interface userData {
        status : number,
        authCode : string,
        message : string,
    }
    const url = import.meta.env.VITE_APP_SERVER + `email/auth?email=${email}`;
    async function sendVerificationCode(): Promise<userData | undefined> {
        try {
            const response: AxiosResponse<userData> = await api.get(url);
            return response.data;
        } catch (error) {
            const err = error as AxiosError
            console.log(err);
        }
        }
        
}
////////////////
//닉네임 중복체크
////////////////
function nicknameDuplicateCheck(nickname : string){
    interface returnData {
        message : string,
        status : number,
    }
    async function getData(): Promise<returnData | undefined> {
        try {
            const response: AxiosResponse<returnData> = await api.get(`/check/${nickname}`);
            const data = response.data as returnData
            return data;
        } catch (error) {
            const err = error as AxiosError
            console.log(err);
        }
        }
        getData()
        .then((res)=> {
        if(res){
            alert(`${res.message}`)
        }
        });
        // getData().then((res)=>console.log(res));

}

export {verifyEmail, nicknameDuplicateCheck}