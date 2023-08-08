import MessagePopUp from "@/components/StudyGroup/invite/Message";
import { useState } from "react";

function AppInvite() {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isRejected, setIsRejected] = useState(false);

  const message = {
    accepted: "환영합니다.",
    rejected: "거절하였습니다."
  }

  const handleClosePopUp = () =>{
    setIsPopUpOpen(false);
  }

  const handleOpenPopUp = () =>{
    setIsPopUpOpen(true);
  }

  // const handleAccept = () => {
  //   setIsAccepted(true);
  //   setIsRejected(false);
  //   handleOpenPopUp();
  // }

  const handleAccept = () => {
    // POST 요청 보내기
    fetch("https://localhost:8080/api/study/invite", {
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
        setIsAccepted(true); // 성공적으로 수락했을 때 상태 업데이트
        handleOpenPopUp(); // 팝업 열기
        console.log(data);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  };


  const handleReject = () => {
    setIsAccepted(true);
    setIsRejected(true);
    handleOpenPopUp();
  }

  return (
    <div className="col-12 sub_wrap">
      {!isAccepted && (
        <>
          수락하시겠습니까?
          <button type="button" onClick={handleAccept}>수락</button>
          <button type="button" onClick={handleReject}>거절</button>
        </>
      )}

      {isPopUpOpen && (<MessagePopUp message={isRejected ? message.rejected : message.accepted} 
                                     onClose={handleClosePopUp}/>)}

    </div>
  )
}

export default AppInvite;
