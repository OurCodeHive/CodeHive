function JoinUser(props:any) {

  let userList = props.user;
  userList.sort();
  
  return (
    <>
      <div style={{
        position:"absolute",
        color:"wheat",
        fontSize:"16px",
        right:"17vh"
      }}>
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