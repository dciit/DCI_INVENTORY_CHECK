import { ivurl } from "@/constants";
import axios from "axios";
const http = axios.create({
    baseURL: ivurl,
    headers: {
        'Content-Type' : 'application/json;charset=UTF-8;json/html; charset=UTF-8',
    }
});

export function API_SUMMARY_HEADER(paramSetCode: string, paramWCNO: string) {
    return new Promise<any>(resolve => {
        http.post(`/summary_header`, {ivSetCode : paramSetCode, paramWCNO : paramWCNO}).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            resolve({
                status: false,
                message: e.response.statusText
            });
        });
    })
}

export function API_SUMMARY_PARTLIST(paramSetCode: string, paramWCNO: string) {
    return new Promise<any>(resolve => {
        http.post(`/summary_partlist`, {ivSetCode : paramSetCode, paramWCNO : paramWCNO}).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            resolve({
                status: false,
                message: e.response.statusText
            });
        });
    })
}


export function API_SUMMARY_DATA(paramSetCode: string, paramWCNO: string) {
    return new Promise<any>(resolve => {
        http.post(`/summary_data`, {ivSetCode : paramSetCode, paramWCNO : paramWCNO}).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            resolve({
                status: false,
                message: e.response.statusText
            });
        });
    })
}

