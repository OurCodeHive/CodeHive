import React from "react";

interface MessagePopUpProps{
    message: string;
    onClose: () => void;
}

function MessagePopUp(props : MessagePopUpProps){
    // 닫기를 누르면 redirect 해야하는데?
    return (
        <div>
            <div>{props.message}</div>
            <button onClick={props.onClose}>닫기</button>
        </div>  
    );

    // alert으로 됩니다...
    // alert(props.message);
    // props.onClose();
    // return null;
}

export default MessagePopUp;