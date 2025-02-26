import { ivurl } from "@/constants";
import axios from "axios";
const http = axios.create({
    baseURL: ivurl,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8;json/html; charset=UTF-8',
    }
});

export function API_TEG_SUMCHECK_ADTE(ivSetCode: string, paramBy: string, paramYM: string) {
    return new Promise<any>(resolve => {
        http.post(`/tag_summary_check`, { ivSetCode: ivSetCode, paramBy: paramBy, paramYM: paramYM }).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            resolve({
                status: false,
                message: e.response.statusText
            })
        })
    })
}


export function API_SUMMARY_COMPARE(paramSetCode: string, paramYM: string, paramWCNO: string) {
    return new Promise<any>(resolve => {
        http.post(`/tag_compare_summary`, {ivSetCode : paramSetCode, paramYM:paramYM, paramWCNO : paramWCNO}).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            resolve({
                status: false,
                message: e.response.statusText
            });
        });
    })
}
