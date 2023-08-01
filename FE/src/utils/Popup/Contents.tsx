import { PopupType, PopupContentsProps } from ".";
import PopupStyle from "@/res/css/module/util/Popup.module.css";

const ContentsPopup: React.FC<PopupType> = ({PopupInfo}) => {
    let isOpen = PopupInfo.PopupStatus;
    const closePopup = () => {
      isOpen = false;
      PopupInfo.ClosePopupProp(false);
    };

    const PopupContents:React.FC<PopupContentsProps> = PopupInfo.PopupContents as React.FC<PopupContentsProps>;
  
    return (
      <>
        {isOpen ? (
          <div className={`col-12 ${PopupStyle.popup_wrap}`} style={{zIndex : `${PopupInfo.zIndex}`}} onClick={() => closePopup()}>
            <div className={`col-12 ${PopupStyle.popup_con}`} style={{maxWidth : `${PopupInfo.maxWidth}px`}}>
              <div className={`col-12 ${PopupStyle.popup_inner}`} onClick={(e) => e.stopPropagation()}>
                <div className={`col-12 ${PopupStyle.popup_contents_con}`}>
                  <div className={`col-12 ${PopupStyle.popup_contents}`}>
                    <PopupContents closePopup={closePopup} />
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