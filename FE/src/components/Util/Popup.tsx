import { useEffect, useState } from "react";

type PopupProps = {
    popupStatus : boolean;
    PopupContents : React.FC;
};

const Popup: React.FC<PopupProps> = ({popupStatus, PopupContents}) => {
    const [isOpen, setIsOpen] = useState<boolean>(popupStatus);
  
    useEffect(() => {
        setIsOpen(true);
    }, []);
  
    const closePopup = () => {
      setIsOpen(false);
    };
  
    return (
      <>
        {isOpen ? (
          <div>
            <PopupContents/>
            <div>
                <span onClick={closePopup}>창 닫기</span>
            </div>
          </div>
        ) : null}
      </>
    );
  };
  export default Popup;