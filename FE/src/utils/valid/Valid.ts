/**
 * Author : JM
 * Date : 23/08/01
 * Description : check value use regEx
 */

//이메일 체크
const emailRegEx = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
function EmailCheck(target:string ):boolean {
    return emailRegEx.test(target);
}

export {EmailCheck};
