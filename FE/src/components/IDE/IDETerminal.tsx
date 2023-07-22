function IDETerminal(props: any) {
  return(
    <div style={{
      position:"absolute",
      backgroundColor:"#222426",
      width:"75%",
      right:"0px",
      bottom:"0px",
      height:"5.8vh",
      color:"wheat"
    }}>
        터미널
        <button onClick={() => {
          props.comfile();
        }}>run</button>
    </div>
  )
}


export default IDETerminal