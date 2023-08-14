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
                if (data.isDelegated){
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
        해당 스터디원에게 스터디장을 위임하시겠습니까?
        <button type="button" onClick={changeHost}>예</button>
        <button type="button" >아니오</button>
      </>
    );
}

export default DelegateUser;

// 멤버 목록이 조회되었다고 가정한다.

// 성공적으로 방장 위임이 되었다면, data.isDelegated = true
// 위임에 실패했다면, data.isDelegated = false


// {
//     "studyinfoId": 5,  // 현재 스터디 그룹의 PK
//     "from": 1,         // 기존 방장인 유저PK
//     "to": 2            // 새로운 방장이 될 유저 PK
//   }
// Back에서는 to라는 users_id PK를 테이블에서 검색 (즉, 우리 서비스의 회원인지, 비회원인지 검색)
// 서비스 회원이면 study_group 이라는 테이블에 있는 1명의 USER 정보를 to 유저로 업데이트 시킴.
// 서비스 비회원이면 data.isDelegated = false를 return
