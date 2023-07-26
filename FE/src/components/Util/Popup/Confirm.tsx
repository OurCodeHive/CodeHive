import PopupStyle from "@/res/css/module/Popup.module.css";

const ConfirmPopup: React.FC<PopupProps> = ({popupStatus, PopupContents, closePopupProp}) => {
    let isOpen = popupStatus;
  
    const closePopup = () => {
      isOpen = false;
      closePopupProp(false);
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
            <PopupContents/>
            <div>
                <span onClick={closePopup}>창 닫기</span>
            </div>
          </div>
        ) : null}
      </>
    );
  };
  export default ConfirmPopup;