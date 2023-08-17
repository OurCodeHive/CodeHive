import { PopupType } from ".";
import PopupStyle from "./css/Popup.module.css";

const ContentsPopup: React.FC<PopupType> = ({PopupInfo}) => {
    let isOpen = PopupInfo.PopupStatus;
    
    const closePopup = () => {
      isOpen = false;
      PopupInfo.ClosePopupProp(false);
    };
  
    return (
      <>
        {isOpen ? (
          <div className={`col-12 ${PopupStyle.popup_wrap}`} style={{zIndex : `${PopupInfo.zIndex}`}} onClick={() => closePopup()}>
            <div className={`col-12 ${PopupStyle.popup_con}`} style={{maxWidth : `${PopupInfo.maxWidth}px`}}>
              <div className={`col-12 ${PopupStyle.popup_inner}`} onClick={(e) => e.stopPropagation()}>
                <div className={`col-12 ${PopupStyle.popup_contents_con}`}>
                  <div className={`col-12 ${PopupStyle.popup_contents}`}>
                    {PopupInfo.PopupContents}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  };
  export default ContentsPopup;