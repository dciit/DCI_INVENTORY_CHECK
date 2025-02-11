export interface MasterData { 
    paramWCNO : string;
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
    totalQty: "0";
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
    totalQty: 0;
}

export interface PropPartUsed {
    procName: string;
    partNo: string[];
}

export interface Qtytotal {
    qtytotal: number;
}