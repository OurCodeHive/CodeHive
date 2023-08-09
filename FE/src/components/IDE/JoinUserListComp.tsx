import style from "@/res/css/module/UserVideo.module.css";

function JoinUser({ userNameList }:{ userNameList:string[] }) {

  return (
    <>
      <div className={style.joinUserName}>
        {
          userNameList.map((item:string, index:number) => {
            return (
              <p key={item}>{item}</p>
            )
          })
        }
      </div>
    </>
  )
}


export default JoinUser;