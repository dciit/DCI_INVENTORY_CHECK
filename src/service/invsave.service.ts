import { ivurl } from "@/constants";
import { PartListQtyInfo } from "@/interface/compressorcheck";
import axios from "axios";
const http = axios.create({
    baseURL: ivurl,
    headers: {
        'Content-Type' : 'application/json;charset=UTF-8;json/html; charset=UTF-8',
    }
});

export function API_SETTAG_CODE(paramYMD: string, paramBy: string) {
    return new Promise<any>(resolve => {
        http.post(`/setdata_gen`,{paramYMD : paramYMD, paramBy : paramBy}).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            // console.log('Gen Data Success')
            resolve({
                status: false,
                message: e.response.statusText
            })
        })
    })
}

export function API_SAVE_INFO_INVENTORY(oPartList: PartListQtyInfo[]) {
    return new Promise<any>(resolve => {
        http.post(`/explodepart_record`,oPartList).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            // console.log('Sent Data Successful')
            resolve({
                status: false,
                message: e.response.statusText
            })
        })
    })
    
}


export function API_EXPORTPARTLIST_SELECT(ivSetCode: string, paramWCNO: string, paramModel: string) {
    return new Promise<any>(resolve => {
        http.post(`/explodepart_select`,{ivSetCode: ivSetCode, paramWCNO: paramWCNO, paramModel: paramModel}).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            // console.log('Sent Data Successful')
            resolve({
                status: false,
                message: e.response.statusText
            })

        })
    })
}
