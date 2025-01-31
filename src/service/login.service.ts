import { hrapi } from '@/constants';
import axios from 'axios';
const http = axios.create({
    baseURL: hrapi,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8;json/html; charset=UTF-8',
    }
});

export function API_LOGIN_EMPLOYEE(code: string) {
    return new Promise<any>(resolve => {
        http.get(`/login/${code}`).then((res) => {
            resolve(res.data);
        }).catch((e)=>{
            console.log('asd')
            resolve({
                status : false,
                message : e.response.statusText
            });
        });
    })
}