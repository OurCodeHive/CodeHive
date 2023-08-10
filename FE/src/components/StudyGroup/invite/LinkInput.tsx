import React from "react";
import { useRecoilValue } from "recoil";
import { userState } from '@/atom/UserAtom';

function LinkInputPopUp(){
    const handlePreCheck = (inviteLink : string) => {

        const url = new URL(inviteLink);
        const params = new URLSearchParams(url.search);
        const userstudyId = params.get("userstudy_id");

        // 로그인 여부를 알아야함.
        const userInfo = useRecoilValue(userState);

        // GET 요청 보내기
        // 이메일함 초대링크의 URL에 userstudy_id=4를 가져와서 fetch 함수의 QueryString에 넣어주기
        // 이메일에 첨부된 URL 입니다. -> http://localhost:8080/invte?studyinfo_id=2&users_id=2&userstudy_id=4&invite_email=gleehave@gmail.com
        // 주의! fetch 요청은 pre-check 로 요청보내주는것임! 헷갈리지 말것!

        fetch(`http://localhost:8080/api/study/invite/pre-check?userstudyId=${userstudyId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(response => response.json())
          .then(data => {
            
            // 1. 비회원이면서, 로그인 안한 사람.
            // "isOurUser" : false,
            if (!data.isOurUser && !userInfo){
                // 올바르지 않은 접근
                console.log("비회원이면서, 로그인 안한 사람 : 올바르지않은 접근");
                console.log("1번: ", data.isOurUser);
            }

            // 2. 비회원이면서, 로그인했음.
            // "isOurUser" : false,
            if (!data.isOurUser && userInfo){
                // 수락, 거절로 감.
                console.log("비회원이면서, 로그인한 사람 : 수락, 거절로 가야함.");
                console.log("2번: ", data.isOurUser);
            }

            // 3. 회원이면서, 로그인 안한 사람
            // "isOurUser" : true,
            if (data.isOurUser && !userInfo){
                // 올바르지 않은 접근
                console.log("회원이면서 로그인 안한 사람 : 올바르지않은 접근");
                console.log("3번: ", data.isOurUser);
            }

            // 4. 회원이면서, 로그인했음.
            // "isOurUser" : true,
            if (data.isOurUser && userInfo){
              // 수락, 거절로 감.  
              console.log("회원이면서 로그인한 사람 : 수락, 거절로 가야함.");
              console.log("4번: ", data.isOurUser);
            }
          })
          .catch(error => {
            console.error("Error:", error);
          });
      };
    
      const handlePrompt = () => {
        const inviteLink = prompt("초대메일의 URL 링크를 입력하세요");
        if (inviteLink) {
            handlePreCheck(inviteLink);
            alert("스터디 가입 판단 중..."); 
        }
      };
    
      return (alert(handlePrompt()));
    }
    export default LinkInputPopUp;