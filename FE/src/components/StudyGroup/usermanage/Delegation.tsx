import {useState, useEffect} from "react";

const DelegateUser = () => {

    // 방장을 바꿈. PUT 요청
    const changeHost = () => {
        fetch("http://localhost:8080/api/study/delegate", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "studyinfoId": 5,  // 현재 스터디 그룹의 PK
                "from": 1,         // 기존 방장인 유저PK
                "to": 2            // 새로운 방장이 될 유저 PK
              })
          })
            .then(response => response.json())
            .then(data => {
                
            })
            .catch(error => {
              console.error("Error:", error);
            });
    };

    return(
        <>
        해당 스터디원에게 스터디장을 위임하시겠습니까?
        <button type="button" onClick={changeHost}>예</button>
        <button type="button" >아니오</button>
      </>
    );
}

export default DelegateUser;
