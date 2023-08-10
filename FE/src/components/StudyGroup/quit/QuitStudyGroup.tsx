import React from "react";
import { useRecoilValue } from "recoil";
import { userState } from '@/atom/UserAtom';

function QuitStudyGroupButton(props:any){

    const userInfo = useRecoilValue(userState);

    const handleStudyQuit = () => {
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
            })
            .catch(error => {
              console.error("Error:", error);
            });
    };

    return (<button onClick={handleStudyQuit}></button>);
}

export default QuitStudyGroupButton;
