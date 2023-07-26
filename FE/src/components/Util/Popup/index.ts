/**
 * Date : 23/07/26
 * Author : JM
 * Contents : 팝업 공통 타입 정의
 * PopupStatus -> 팝업 오픈 여부 *
 * zIndex -> 팝업 z-index 설정값 *
 * maxWidth -> 팝업 콘텐츠 크기값 *
 * closePopupProp -> 팝업 닫을 시 상위에 변수 전달 *
 * popupTitle -> 팝업 제목 *
 * popupDesc -> 팝업 설명
 * popupContents -> 팝업안에 로드해야하는 컨텐츠
 * cancelPopupProp -> 취소 누를 시 보내야 하는 값
 * confirmPopupProp -> 확인 누를 시 보내야 하는 값
 */
export type PopupType = {
    PopupInfo : {
      PopupStatus : boolean;
      zIndex : number;
      maxWidth: number;
      ClosePopupProp : (flag: boolean) => void;
      PopupTitle : string;
      PopupDesc? : string;
      PopupContents? : React.FC;
      CancelPopupProp? : (param : unknown) => void;
      ConfirmPopupProp? : (param : unknown) => void;
    };
};

import AlertPopup from "./Alert";
import ConfirmPopup from "./Confirm";
import ContentsPopup from "./Contents";

export {AlertPopup, ConfirmPopup, ContentsPopup};