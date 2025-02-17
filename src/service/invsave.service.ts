import { hrapi } from "@/constants";
import { PartListQtyInfo } from "@/interface/compressorcheck";
import { message } from "antd";
import axios from "axios";
import { resolve } from "path";
const http = axios.create({
    baseURL: hrapi,
    headers: {
        'Content-Type' : 'application/json;charset=UTF-8;json/html; charset=UTF-8',
    }
});

export function API_SETTAG_CODE(paramYMD: string, paramBy: string) {
    return new Promise<any>(resolve => {
        http.post(`/setdata_gen`,{paramYMD : paramYMD, paramBy : paramBy}).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log('Gen Data Success')
            resolve({
                status: false,
                message: e.response.statusText
            })
        })
    })
}

export function API_SAVE_INFO_INVENTORY(oPartList: PartListQtyInfo[]) {
    //ivSetCode: string, wcno: string, model: string, proc_Code: string, partNo: string, cm: string,  usageQty: number, calQty: number, crBy: string
    return new Promise<any>(resolve => {
        http.post(`/explodepart_record`,oPartList).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            console.log('Sent Data Successful')
            resolve({
                status: false,
                message: e.response.statusText
            })
        })
    })
    
}