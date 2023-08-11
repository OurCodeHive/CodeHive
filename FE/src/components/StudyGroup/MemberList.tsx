function MemberList(props:any) {
  return(
    <>
      멤버보기
      <button
      onClick={props.ClosePopupProp}
      >끄기</button>
    </>
  )
}


export default MemberList;