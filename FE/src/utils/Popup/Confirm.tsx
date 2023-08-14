import { PopupType } from ".";
import PopupStyle from "./css/Popup.module.css";

const ConfirmPopup: React.FC<PopupType> = ({PopupInfo}) => {
    let isOpen = PopupInfo.PopupStatus;

    //취소 눌렀을 때 실행되는 함수 -> cancelPopup이 있으면 cancelPopup실행,
    const cancelPopup = () => {
      isOpen = false;
      PopupInfo.CancelPopupProp ? PopupInfo.CancelPopupProp(false) : PopupInfo.ClosePopupProp(false);
    };

    const confirmPopup = () => {
      isOpen = false;
      PopupInfo.ConfirmPopupProp ? PopupInfo.ConfirmPopupProp(true) : PopupInfo.ClosePopupProp(false);
    }
  
    return (
      <>
        {isOpen ? (
          <div className={`col-12 ${PopupStyle.popup_wrap}`} style={{zIndex : `${PopupInfo.zIndex}`}}>
            <div className={`col-12 ${PopupStyle.popup_con}`} style={{maxWidth : `${PopupInfo.maxWidth}px`}}>
              <div className={`col-12 ${PopupStyle.popup_inner}`}>
                <div className={`col-12 ${PopupStyle.popup_contents_con}`}>
                  <div className={`col-12 ${PopupStyle.popup_contents}`}>
                    <div className={`col-12 tc mb21 ${PopupStyle.headline}`} dangerouslySetInnerHTML={{__html : PopupInfo.PopupTitle}}></div>
                  </div>
                  <div className={`col-12 tc ${PopupStyle.confirm_btn_style_0_con}`}>
                    <button type="button" className={`col-6 btn_style_0 bg_point0 ${PopupStyle.confirm_btn_style_0}`} onClick={confirmPopup}>확인</button>
                    <button type="button" className={`col-6 btn_style_0 bg_a2a2a2 ${PopupStyle.confirm_btn_style_0}`} onClick={cancelPopup}>취소</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  };
  export default ConfirmPopup;