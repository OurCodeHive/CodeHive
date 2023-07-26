import { PopupType } from ".";
import PopupStyle from "@/res/css/module/Popup.module.css";

const ContentsPopup: React.FC<PopupType> = ({PopupInfo}) => {
    let isOpen = PopupInfo.PopupStatus;
    const PopupContents:React.FC = PopupInfo.PopupContents as React.FC;
  
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
                <div className={`col-12 ${PopupStyle.popup_header_con}`}>
                  <div className={`col-12 ${PopupStyle.popup_header_top_con}`}>
                    <div className={`col-12 ${PopupStyle.title_con}`}>
                      {PopupInfo.PopupTitle}
                    </div>
                    <button className={`${PopupStyle.popup_close_btn}`} onClick={closePopup}>창 닫기</button>
                  </div>
                </div>
                <div className={`col-12 ${PopupStyle.popup_contents_con}`}>
                  <div className={`col-12 ${PopupStyle.popup_contents}`}>
                    <PopupContents/>
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