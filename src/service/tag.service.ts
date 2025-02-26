import { ivurl } from "@/constants";
import axios from "axios";
const http = axios.create({
    baseURL: ivurl,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8;json/html; charset=UTF-8',
    }
});

export function API_TEG_SELECT(ivSetCode: string, paramYM: string, paramWCNO: string) {
    return new Promise<any>(resolve => {
        http.post(`/tag_select`, { ivSetCode: ivSetCode, paramYM: paramYM, paramWCNO: paramWCNO }).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            resolve({
                status: false,
                message: e.response.statusText
            })
        })
    })
}

export function API_TEG_SELECT_QR(param: any) {
    return new Promise<any>(resolve => {
        http.post(`/tag_select_qrcode`, param).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            resolve({
                status: false,
                message: e.response.statusText
            })
        })
    })
}

export function API_TAG_RECORD_AUDITEE(ivSetCode: string, ym: string, wcno: string, partNo: string, cm: string, qrCode: string, phyQty: number | string, updBy: string) {
    return new Promise<any>(resolve => {
        http.post(`/tag_auditee_record`, {
            ivSetCode: ivSetCode,
            ym: ym,
            wcno: wcno,
            partNo: partNo,
            cm: cm,
            qrCode: qrCode,
            phyQty: phyQty,
            updBy: updBy
        }).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            resolve({
                status: false,
                message: e.response.statusText
            })
        })
    })
}


export function API_TAG_RECORD_AUDITOR(ivSetCode: string, ym: string, wcno: string, partNo: string, cm: string, qrCode: string, phyQty: number | string, updBy: string) {
    return new Promise<any>(resolve => {
        http.post(`/tag_auditor_record`, {
            ivSetCode: ivSetCode,
            ym: ym,
            wcno: wcno,
            partNo: partNo,
            cm: cm,
            qrCode: qrCode,
            phyQty: phyQty,
            updBy: updBy
        }).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            resolve({
                status: false,
                message: e.response.statusText
            })
        })
    })
}


export function API_TAG_HISTORY_AUDITEE(ivSetCode: string, ym: string, wcno: string, partNo: string, cm: string) {
    return new Promise<any>(resolve => {
        http.post(`/tag_auditee_part_history`, {
            ivSetCode: ivSetCode,
            ym: ym,
            wcno: wcno,
            partNo: partNo,
            cm: cm,
        }).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            resolve({
                status: false,
                message: e.response.statusText
            })
        })
    })
}


export function API_TAG_HISTORY_AUDITOR(ivSetCode: string, ym: string, wcno: string, partNo: string, cm: string) {
    return new Promise<any>(resolve => {
        http.post(`/tag_auditor_part_history`, {
            ivSetCode: ivSetCode,
            ym: ym,
            wcno: wcno,
            partNo: partNo,
            cm: cm,
        }).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            resolve({
                status: false,
                message: e.response.statusText
            })
        })
    })
}



export function API_PERSON_HISTORY_AUDITOR(param: any) {
    return new Promise<any>(resolve => {
        http.post(`/tag_auditor_person_history`, param).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            resolve({
                status: false,
                message: e.response.statusText
            })
        })
    })
}


export function API_PERSON_HISTORY_AUDITEE(param: any) {
    return new Promise<any>(resolve => {
        http.post(`/tag_auditee_person_history`, param).then((res) => {
            resolve(res.data);
        }).catch((e) => {
            resolve({
                status: false,
                message: e.response.statusText
            })
        })
    })
}