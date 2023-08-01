/** 
 * Author : JM
 * Date : 23/07/24
 * Contents : 스터디 관련 api 요청
*/
import { AxiosError } from 'axios';
import http from './http';
import { StudyType } from '@/type/StudyType';

const api = http;

/**
 * get study list belong user
 * @param param { userIdx : number }
 * @param success 
 * @param fail
 */
const getList = async (param: object, success: ({data} : {data: object}) => void, fail: (error: unknown) => void) => {
    await api.get<Array<StudyType>>(`/study`, { params: param }).then(success).catch(fail);
}

/**
 * insert study
 * @param param { param : object }
 * @param success 
 * @param fail 
 */
const insertData = async (param: object, success: ({data} : {data: object}) => void, fail: () => void) => {
    await api.post(`/study`, JSON.stringify(param)).then(success).catch(fail);
}

const inviteMember = async (param: object, success: () => void, fail: () => void) => {
    await api.post(`/email/study/invite`, JSON.stringify(param)).then(success).catch(fail);
}

export {getList, insertData, inviteMember};