import { ivurl } from '@/constants';
import axios from 'axios';
const http = axios.create({
    baseURL: ivurl,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8;json/html; charset=UTF-8',
    }
});

export function     API_LOGIN_EMPLOYEE(ParamUser: string, ParamPass: string) {
    return new Promise<any>(resolve => {
        http.post(`api/authen/authen`,{ ParamUser: ParamUser, ParamPass: ParamPass} ).then((res) => {
            resolve(res.data);
        }).catch((e)=>{
            resolve({
                status : false,
                message : e.response.statusText
            });
        });
    })
}