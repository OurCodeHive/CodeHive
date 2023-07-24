/** 
 * Author : JM
 * Date : 23/07/24
 * Contents : 스터디 관련 api 요청
*/

import http from './http';

const api = http;

/**
 * get study list belong user
 * @param param {userIdx}
 * @param success 
 * @param fail 
 */
async function getList(param: object, success: () => void, fail: () => void) {
    await api.get(`/attraction/list`, { params: param }).then(success).catch(fail);
}

export {getList};