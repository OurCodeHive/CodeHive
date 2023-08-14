import {useState, useEffect} from "react";

const ForceLeaveUser = () => {

    // 강제퇴장
    const sendForceLeave = () => {
        fetch("http://localhost:8080/api/study/force/leave", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "studyinfoId": 5,    // 스터디 그룹 PK
                "from": 2,           // 현재 방장인 유저 PK
                "target": 1          // 강퇴할 유저 PK
              })
          })
            .then(response => response.json())
            .then(data => {
                if (data.isForcedLeave){
                    console.log(data.message);
                } else {
                    console.log(data.message);
                }
                
            })
            .catch(error => {
              console.error("Error:", error);
            });
    };

    return(
        <>
        해당 스터디원을 추방하시겠습니까?
        <button type="button" onClick={sendForceLeave}>예</button>
        <button type="button" >아니오</button>
      </>
    );
}

export default ForceLeaveUser;