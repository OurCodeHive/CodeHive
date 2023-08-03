/** 
 * Author : JM
 * Date : 23/07/24
 * Contents : 스터디 관련 api 요청
*/
import { StudyNoticeListType } from '@/type/StudyNoticeType';
import {authHttp, formHttp} from './http';
import { StudyType, StudyListType } from '@/type/StudyType';

const api = authHttp;
const formApi = formHttp;

/**
 * get study list belong user
 * @param param { userIdx : number }
 * @param success 
 * @param fail
 */
const getList = async (param: object, success: ({data} : {data: StudyListType}) => void, fail: (error: unknown) => void) => {
    await api.get(`/study`, { params: param }).then(success).catch(fail);
}

/**
 * insert study
 * @param param { param : FormData }
 * @param success 
 * @param fail 
 */
const insertData = async (param: FormData, success: ({data} : {data: StudyType}) => void, fail: () => void) => {
    await formApi.post(`/study`, param).then(success).catch(fail);
}

/**
 * invite member
 * @param param { param : object }
 * @param success 
 * @param fail 
 */
const inviteMember = async (param: object, success: () => void, fail: () => void) => {
    await api.post(`/email/study/invite`, JSON.stringify(param)).then(success).catch(fail);
}

/**
 * get study view
 * @param studyinfoId : number
 * @param success 
 * @param fail 
 */
const getView = async (studyinfoId: number, success: ({data} : {data: StudyType}) => void, fail: (error: unknown) => void) => {
    await api.get(`/studyinfo/${studyinfoId}`).then(success).catch(fail);
}

const getNoticeList = async (studyinfoId: number, param: object, success: ({data} : {data : StudyNoticeListType}) => void, fail: (error: unknown) => void) => {
    await api.get(`/study/${studyinfoId}/board`, { params: param }).then(success).catch(fail);
}

export {getList, insertData, inviteMember, getView, getNoticeList};