import { useRecoilValue } from 'recoil';
import { voiceJoinUserState } from '@/atom/voiceUserAtom';

function JoinUserList() {

  let userInfo :any = useRecoilValue(voiceJoinUserState);
  return (
    <>
      {
        userInfo.map((item:any, index:number) => {
          return <p key={index}>{item.name}</p>
        })
      }
    </>
  )
}


export default JoinUserList