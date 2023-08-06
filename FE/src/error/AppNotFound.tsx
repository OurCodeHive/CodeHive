import Style from "@/res/css/module/AppNotFound.module.css"
import { useNavigate } from "react-router-dom";


function AppNotFound() {

  const navigate = useNavigate();

  return (
    <>
      <div className={Style.container}>
        <div className={Style.content}>
          <h1>404</h1>
          <h2>페이지를 찾을 수 없습니다</h2>
          <p>죄송합니다. 이 페이지를 사용할 수 없습니다.</p>
          <a onClick={() => {
            navigate("/")
          }}>홈페이지로 돌아가기</a>
        </div>
      </div>
    </>
  )
}

export default AppNotFound;
