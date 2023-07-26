import Popup from '@/components/Util/Popup';

function AppStudy() {
  let insertPopupStatus = false;
  function openPopup(){
    insertPopupStatus = true;
    console.log("test");
  }

  return (
    <>
      <div onClick={openPopup}>test</div>

    </>
  )
}

export default AppStudy;
