import LinkInputPopUp from "@/components/StudyGroup/invite/LinkInput";
import MessagePopUp from "@/components/StudyGroup/invite/Message";
import { useState, useEffect } from "react";

// 1. (수락버튼) handleAccept라는 요청함수 만들어 둠.
//     1-1. http://localhost:8080/ 형태니까 꼭! 실서버로 변경
// 2. (거절버튼) 요청함수 안만들었음.
// 3.  async 필요.
// 4. Message의 "닫기" 누르면 URL이 invite로 유지되어있음. 여기도 redirct?
// 5. useState나 Recoil에 유저 정보를 넣어줘야하는데 이건 모르겠음.

function AppInvite() {

  const message = {
    accepted: "환영합니다.",
    rejected: "거절하였습니다."
  }

  const handleAccept = () => {
    // POST 요청 보내기
    fetch("http://localhost:8080/api/study/invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "usersId": 2,
        "userstudyId": 12
      })
    })
      .then(response => response.json())
      .then(data => {
        // 성공적으로 수락했을 때 상태 업데이트
        console.log(data); // response 확인용 log
      })
      .catch(error => {
        console.error("Error:", error);
      });
  };

  const handleReject = () => {
    // status를 바꿔야 하지만, 따로 URL 없습니다.
    // 바로 home과 같은 곳으로 페이지 이동으로 생각합니다.
  };

  return (
    <div className="col-12 sub_wrap">

      {/* 1. 이메일에서 링크를 클릭하면, 여기 페이지에 도달합니다.
      2. input 창에서 사용자는 이메일 링크의 URL을 복붙해서 기입합니다. */}
      <LinkInputPopUp></LinkInputPopUp>

      {/* 3. 수락, 거절 버튼을 누릅니다.
      3-1. 수락은 POST 요청을 보냄.
      3-2. 거절은 다른 페이지로 이동 */}
        <>
          수락하시겠습니까?
          <button type="button" onClick={handleAccept}>수락</button>
          <button type="button" onClick={handleReject}>거절</button>
        </>

      {/* 4. 메세지를 alert에 넣어서 줍니다. */}
      <MessagePopUp message={message.accepted}/>

    </div>
  )
}

export default AppInvite;
