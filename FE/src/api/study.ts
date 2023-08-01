/** 
 * Author : JM
 * Date : 23/07/24
 * Contents : 스터디 관련 api 요청
*/
import { AxiosError } from 'axios';
import {authHttp, nonAuthHttp} from './http';
import { StudyType } from '@/type/StudyType';

const api = authHttp;

/**
 * get study list belong user
 * @param param { userIdx : number }
 * @param success 
 * @param fail 
 */
const getList = async <T = StudyType>(param: object): Promise<T | undefined> => {
    try {
        const result = await api.get<T>(`/study`, { params: param });
        return result.data;
      } catch (error) {
          const err = error as AxiosError
          console.log(err);
    }
}

/**
 * insert study
 * @param param { param : object }
 * @param success 
 * @param fail 
 */
const insertData = async <T = number>(param: object): Promise<T | undefined> => {
    try {
        const result = await api.post<T>(`/study`, { params: JSON.stringify(param) });
        return result.data;
      } catch (error) {
          const err = error as AxiosError
          console.log(err);
    }
}

export {getList, insertData};