import { ivurl } from "@/constants";
import axios from "axios";
const http = axios.create({
    baseURL: ivurl,
    headers: {
        'Content-Type' : 'application/json;charset=UTF-8;json/html; charset=UTF-8',
    }
});

export function API_PARTLIST_CHECK_INVENTORY(paramWCNO: string, paramModel: string) {
    return new Promise<any>(resolve => {
        http.post(`/bom_partlist`, {paramWCNO : paramWCNO, paramModel : paramModel}).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            resolve({
                status: false,
                message: e.response.statusText
            });
        });
    })
}


export function API_SELECT_WCNO() {
    return new Promise<any>(resolve => {
        http.get(`/wcno_list`).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            resolve({
                status: false,
                message: e.response.statusText
            })
        })
    })
}

export function API_SELECT_MODELLIST(paramWCNO: string) {
    return new Promise<any>(resolve => {
        http.post(`/model_list_by_wcno`, {paramWCNO: paramWCNO}).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            resolve({
                status: false,
                message: e.response.status.statusText
            })
        })
    })
}
