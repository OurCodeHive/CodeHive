import { PopupType } from ".";
import PopupStyle from "@/res/css/module/Popup.module.css";

const AlertPopup: React.FC<PopupType> = ({popupInfo}) => {
    let isOpen = popupInfo.popupStatus;
  
    const closePopup = () => {
      isOpen = false;
      popupInfo.closePopupProp(false);
    };
  
    return (
      <>
        {isOpen ? (
          <div className={`col-12 ${PopupStyle.popup_style_0_wrap}`}>
            <div className={`col-12 ${PopupStyle.popup_con}`}>
              <div className={`col-12 ${PopupStyle.popup_inner}`}>
                <div className="col-12">

                </div>
              </div>
            </div>
            <div>
                <span onClick={closePopup}>창 닫기</span>
            </div>
          </div>
        ) : null}
      </>
    );
  };
export default AlertPopup;