import style from "@/res/css/module/UserVideo.module.css";


function JoinUser(props:any) {

  let userList = props.user;
  userList.sort();
  
  return (
    <>
      <div className={style.joinUserName}>
        {
          userList.map((item:any, index:number) => {
            return <p key={index}>{item}</p>
          })
        }
      </div>
    </>
  )
}


export default JoinUser;