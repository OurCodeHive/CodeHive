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
                "studyinfoId": props.studyinfoId,
                "userId": userInfo.userId
            })
          })
            .then(response => response.json())
            .then(data => {
              
              if (data.isLeave){
                // 스터디 탈퇴 시, 자료를 공유받을 수 없습니다. 그럼에도 탈퇴하시겠습니까? (예 / 아니오)
                console.log("스터디 탈퇴 시, 자료를 공유받을 수 없습니다. 그럼에도 탈퇴하시겠습니까? (예 / 아니오)");
              }

              if (!data.isLeave){
                console.log("스터디 ") 
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
