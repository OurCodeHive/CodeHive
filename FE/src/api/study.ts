/** 
 * Author : JM
 * Date : 23/07/24
 * Contents : 스터디 관련 api 요청
*/
import {authHttp, formHttp} from './http';
import { StudyType, StudyListType, StudyUpdateType } from '@/type/StudyType';
import { StudyNoticeType, StudyNoticeListType } from '@/type/StudyNoticeType';
import { StudyDocumentType, StudyDocumentListType, StudyDocumentDetailType, StudyDocumentDetailItemType, file } from '@/type/StudyDocumentType';
import { UserListType } from '@/type/UserType';

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

const updateStudyInfoData = async (param:FormData, success:({data}: {data:StudyUpdateType}) => void, fail:() => void) => {
    await formApi.put(`/study`, param).then(success).catch(fail);
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

const inviteProcess = async (param: object, success: () => void, fail: (error: unknown) => void) => {
    await api.post(`/study/invite`, JSON.stringify(param)).then(success).catch(fail);
}

const studyQuit = async (param: object, success: ({data} : {data : any}) => void, fail: (error: unknown) => void) => {
    await api.post(`/study/leave`, JSON.stringify(param)).then(success).catch(fail);
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
const insertNoticeData = async (studyinfoId: number, param: object, success: ({data} : {data: object}) => void, fail: () => void) => {
    await api.post(`/study/${studyinfoId}/board`, JSON.stringify(param)).then(success).catch(fail);
}

const updateNoticeData = async (studyinfoId: number, studyboardId: number, param: object, success: ({data} : {data: object}) => void, fail: () => void) => {
    await api.put(`/study/${studyinfoId}/board/${studyboardId}`, JSON.stringify(param)).then(success).catch(fail);
}

const removeNoticeData = async (studyinfoId: number, studyboardId: number, success: ({data} : {data: object}) => void, fail: (error: unknown) => void) => {
    await api.delete(`/study/${studyinfoId}/board/${studyboardId}`).then(success).catch(fail);
}

const getDocumentList = async (studyinfoId: number, param: object, success: ({data} : {data : StudyDocumentListType}) => void, fail: (error: unknown) => void) => {
    await api.get(`/study/${studyinfoId}/document`, { params: param }).then(success).catch(fail);
}

const getDocumentView = async (studyinfoId: number, studyDocumentId: number, success: ({data} : {data : StudyDocumentDetailItemType}) => void, fail: (error: unknown) => void) => {
    await api.get(`/study/${studyinfoId}/document/${studyDocumentId}`).then(success).catch(fail);
}

const deleteStudyfile = async (studyDocumentId: number, success:() => void, fail:(err: unknown) => void) => {
    await api.delete(`/study/file/${studyDocumentId}`).then(success).catch(fail); 
}

const updateStudyFile = async (param: FormData, success:({data} : {data: file[]}) => void, fail:(err:unknown) => void) => {
    await formApi.put("study/file", param).then(success).catch(fail);
}

const insertStudyFile = async (param: FormData, success:({data} : {data: any}) => void, fail:(err:unknown) => void) => {
    await formApi.post("study/file", param).then(success).catch(fail);
}

const getMemberList = async (param: object, success:({data} : {data : UserListType}) => void, fail:(error:unknown) => void) => {
    await api.get("study/user/list", { params: param }).then(success).catch(fail);
}

const updateMemberMandate = async (param: object, success:({data} : {data: any}) => void, fail:(error:unknown) => void) => {
    await api.put(`/study/delegate`, JSON.stringify(param)).then(success).catch(fail);
}

const updateMemberDrop = async (param: object, success:({data} : {data: any}) => void, fail:(error:unknown) => void) => {
    await api.post(`/study/force/leave`, JSON.stringify(param)).then(success).catch(fail);
}

export {getList, insertData, inviteMember, inviteProcess, studyQuit, getView, getNoticeList, getNoticeView, insertNoticeData, updateNoticeData, removeNoticeData, getDocumentList, getDocumentView, deleteStudyfile, updateStudyFile, insertStudyFile, getMemberList, updateMemberMandate, updateMemberDrop, updateStudyInfoData };