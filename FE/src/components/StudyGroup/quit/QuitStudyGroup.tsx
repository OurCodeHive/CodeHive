import React from "react";
import { useRecoilValue } from "recoil";
import { userState } from '@/atom/UserAtom';

function QuitStudyGroupButton(props:any){

    const userInfo = useRecoilValue(userState);

    const handleStudyQuitYes = () => {
        fetch("http://localhost:8080/api/study/leave", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "studyinfoId":2,
                "userId": 2
            })
          })
            .then(response => response.json())
            .then(data => {
              
              if (data.isLeave){
                console.log("스터디를 성공적으로 탈퇴하였습니다.");
              }

              if (!data.isLeave){
                console.log("다른 스터디원에게 방장을 위임하셔야 탈퇴할 수 있습니다."); 
              }
            })
            .catch(error => {
              console.error("Error:", error);
            });
    };

    const handleStudyQuitNo = () => {
      // 아무것도 없거나.. 
      // 다시 스터디 상세 화면으로 가게끔 뭘 해줘야할거같은데..?
    }

    return (
      <>
        스터디 탈퇴 시, 자료를 공유받을 수 없습니다. 그럼에도 탈퇴하시겠습니까?
        <button type="button" onClick={handleStudyQuitYes}>예</button>
        <button type="button" onClick={handleStudyQuitNo}>아니오</button>
      </>
    );
}

export default QuitStudyGroupButton;
