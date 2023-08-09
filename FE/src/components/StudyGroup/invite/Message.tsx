import React from "react";

interface MessagePopUpProps{
    message: string;
}

function MessagePopUp(props : MessagePopUpProps){
    alert(props.message);
    return null;
}

export default MessagePopUp;