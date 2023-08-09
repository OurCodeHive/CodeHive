import React from "react";
import { useRecoilValue } from "recoil";
import { userState } from '@/atom/UserAtom';

function LinkInputPopUp(){
    const handlePreCheck = () => {
        // GET 요청 보내기

        // 이메일함 초대링크의 URL에 userstudy_id=4를 가져와서 fetch 함수의 QueryString에 넣어주기
        // 이메일에 첨부된 URL 입니다. -> http://localhost:8080/invte?studyinfo_id=2&users_id=2&userstudy_id=4&invite_email=gleehave@gmail.com
        // 주의! fetch 요청은 pre-check 로 요청보내주는것임! 헷갈리지 말것!

        fetch("http://localhost:8080/api/study/invite/pre-check?userstudyId=4", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(response => response.json())
          .then(data => {
            console.log(data); // 확인용 log

            // 로그인 여부를 알아야함.
            const userInfo = useRecoilValue(userState);

            // 1. 비회원이면서, 로그인 안한 사람.
            // "isOurUser" : false,
            if (!data.isOurUser){
                // 로그인 페이지로 이동
            }

            // 2. 비회원이면서, 로그인했음.
            // "isOurUser" : false,
            if (!data.isOurUser){
                
            }

            // 3. 회원이면서, 로그인 안한 사람
            // "isOurUser" : true,
            if (data.isOurUser){
                // 로그인 페이지 이동
            }

            // 4. 회원이면서, 로그인했음.
            // "isOurUser" : true,
            if (data.isOurUser){
                // 
            }


          })
          .catch(error => {
            console.error("Error:", error);
          });
      };
    
      const handlePrompt = () => {
        const inputValue = prompt("초대메일의 URL 링크를 입력하세요");
        if (inputValue) {
            // inputValue를 넣어주어야 함.
            handlePreCheck(); 
        }
      };
    
      return (alert(handlePrompt()));
    }
    export default LinkInputPopUp;