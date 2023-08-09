/** 
 * Author : MS
 * Date : 23/08/08
 * Contents : 채팅 관련 api 요청
*/
import { authHttp } from './http';
import { ChatMessage, studyUserList } from '@/type/ChatType';
const api = authHttp;

/**
 * get chatlist findBy studyinfoId
 * @param param { studyInfoId : number }
 * @param success 
 * @param fail
 */
const getChatList = async (
  studyInfoId: string,
  success: ({data} : {data: ChatMessage[]}) => void,
  fail: (error: unknown) => void) => {
  await api.get(`/chat/${studyInfoId}`).then(success).catch(fail);
}

/**
 * 스터디원 목록 받기
 * @param param { studyInfoId : number }
 * @param success
 * @param fail
 */
const getStudyUserList = async (
  studyInfoId: string,
  success: ({data} : {data: studyUserList}) => void,
  fail: (err: unknown) => void) => {
  await api.get(`/study/user/list?study=${studyInfoId}`).then(success).catch(fail);
}


export { getChatList, getStudyUserList }