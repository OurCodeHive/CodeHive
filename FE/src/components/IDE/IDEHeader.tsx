import saveButton from "@/components/IDE/downlode";
import { useNavigate } from "react-router-dom";

function IDEHeader(props:any) {
  
  const navigate = useNavigate();

  function saveMemo() {
    let ns = new XMLSerializer();
    let korean = `<meta charset="utf-8"/>`;
    let html: any = document.querySelector(".ql-editor");
    let targetString = ns.serializeToString(html);
    return korean + targetString;
  }

  return(
    <div style={{
      backgroundColor:"#222326"
    }}>
      <div style={{
        padding: "10px 10px 10px 10px",
        display:"flex",
        width:"100vh",
        color:"wheat",
      }}>
        <button onClick={() => {
          saveButton(saveMemo(), "코드");
        }}>문서저장</button>&nbsp;
        <button onClick={() => {
          props.saveCode();
        }}>코드저장</button>&nbsp;
        <button>알림사항 변경</button>&nbsp;
        <h2>게리맨더링 코드리뷰 중 입니다.</h2>&nbsp;
        <button onClick={() =>{
          navigate('/');
        }}>나가기</button>
      </div>
    </div>
  )
}


export default IDEHeader;