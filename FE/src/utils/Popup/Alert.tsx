import { PopupType } from ".";
import PopupStyle from "./css/Popup.module.css";

const AlertPopup: React.FC<PopupType> = ({PopupInfo}) => {
    let isOpen = PopupInfo.PopupStatus;
  
    const closePopup = () => {
      isOpen = false;
      PopupInfo.ClosePopupProp(false);
    };
  
    return (
      <>
        {isOpen ? (
          <div className={`col-12 ${PopupStyle.popup_wrap}`} style={{zIndex : `${PopupInfo.zIndex}`}}>
            <div className={`col-12 ${PopupStyle.popup_con}`} style={{maxWidth : `${PopupInfo.maxWidth}px`}}>
              <div className={`col-12 ${PopupStyle.popup_inner}`}>
                <div className={`col-12 ${PopupStyle.popup_header_con}`}>
                  <div className={`col-12 ${PopupStyle.popup_header_top_con}`}></div>
                </div>
                <div className={`col-12 ${PopupStyle.popup_contents_con}`}>
                  <div className={`col-12 ${PopupStyle.popup_contents}`}>
                    <div className={`col-12 tc mb21 ${PopupStyle.headline}`} dangerouslySetInnerHTML={{__html : PopupInfo.PopupTitle}}>
                    </div>
                    <div className="col-12 tc btn_style_0_con">
                      <button 
                      style={{}}
                      className="btn_style_0 bg_black" onClick={closePopup}>확인</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </>
    );
  };
export default AlertPopup;