/** 
 * Author : JM
 * Date : 23/07/24
 * Contents : 스터디 관련 api 요청
*/
import {authHttp, formHttp} from './http';
import { StudyType, StudyListType } from '@/type/StudyType';
import { StudyNoticeType, StudyNoticeListType } from '@/type/StudyNoticeType';
import { StudyDocumentType, StudyDocumentListType, StudyDocumentDetailType } from '@/type/StudyDocumentType';

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

const getNoticeView = async (studyinfoId: number, studyboardId: number, success: ({data} : {data : StudyNoticeType}) => void, fail: (error: unknown) => void) => {
    await api.get(`/study/${studyinfoId}/board/${studyboardId}`).then(success).catch(fail);
}

/**
 * insert study
 * @param param { param : FormData }
 * @param success 
 * @param fail 
 */
const insertNoticeData = async (studyinfoId: number, param: object, success: ({data} : {data: StudyType}) => void, fail: () => void) => {
    await api.post(`/study/${studyinfoId}/board`, JSON.stringify(param)).then(success).catch(fail);
}

const getDocumentList = async (studyinfoId: number, param: object, success: ({data} : {data : StudyDocumentListType}) => void, fail: (error: unknown) => void) => {
    await api.get(`/study/${studyinfoId}/document`, { params: param }).then(success).catch(fail);
}

const getDocumentView = async (studyinfoId: number, studyDocumentId: number, success: ({data} : {data : StudyDocumentDetailType}) => void, fail: (error: unknown) => void) => {
    await api.get(`/study/${studyinfoId}/document/${studyDocumentId}`).then(success).catch(fail);
}

export {getList, insertData, inviteMember, getView, getNoticeList, getNoticeView, insertNoticeData, getDocumentList, getDocumentView};