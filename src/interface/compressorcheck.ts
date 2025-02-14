export interface MasterData {
    paramWCNO: string;
    paramModel: string;
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
    usageQty: number;
    orderNo: number;
}

export interface Partlist {
    wcno: string;
    model: string;
    proc_Code: string;
    proc_Name: string;
    partNo: string;
    cm: string;
    usageQty: number;
    orderNo: number;
}

export interface PropPartUsed {
    procCode: string;
    procName: string;
    partNo: string[];
    cm: string[];
}

export interface PartListQtyInfo {
    wcno: string;
    model: string;
    proc_Code: string;
    partNo: string;
    cm: string;
    usageQty: number;
    calQty: number;
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
