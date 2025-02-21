export interface Wcno {
    wcno: string;
    sname: string;
    name: string
}

export interface ModelList {
    modelCode: string;
    model: string
}

export interface MasterData {
    paramWCNO: string;
    paramModel: string;
    paramCodeModel: string
}

export interface MasterInterface {
    serach: boolean;
    load: boolean;
    message: string;
}

export interface Master {
    wcno: string;
    model: string;
    proc_Code: string;
    proc_Name: string;
    partNo: string;
    cm: string;
    partName: string;
    usageQty: number;
    orderNo: number;
}

export interface PropPartUsed {
    procCode: string;
    procName: string;
    partNo: string[];
    cm: string[];
    calculatedValue?: number;
}

export interface PartListQtyInfo {
    ivSetCode?: string;
    wcno: string;
    model: string;
    proc_Code: string;
    partNo: string;
    cm: string;
    usageQty: number;
    calQty: number;
    crBy?: string;
}

export interface BOMInfo{
    wcno: string;
    model : string;
    proc_Code : string;
    proc_Name : string;
    partNo : string;
    cm : string;
    partName : string;
    usageQty : number;
    orderNo : number;
}

export interface PartListDetInfo {
    ivExpNbr: string;
    ivSetCode: string;
    wcno: string;
    model: string;
    proc_Code: string;
    proc_Name: string;
    partNo: string;
    cm: string;
    partName: string;
    usageQty: number;
    calQty: number;
    crBy?: string;
    crDate?: string;
    lrev: string;
    rev: string;
}
