/** 
 * Author : JM
 * Date : 23/07/24
 * Contents : 스터디 관련 api 요청
*/

import http from './http';
import { StudyType } from '@/type/StudyType';

const api = http;

/**
 * get study list belong user
 * @param param {userIdx}
 * @param success 
 * @param fail 
 */
const getList = async <T = StudyType>(param: object): Promise<T> => {
    const result = await api.get<T>(`/attraction/list`, { params: param });
    return result.data;
}

export {getList};