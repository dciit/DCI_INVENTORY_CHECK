export interface TagInfo {
    ivSetCode: string;
    ym: string;
    wcno: string;
    wcnO_SName: string;
    wcnO_NAME: string;
    lineType: string;
    partNo: string;
    cm: string;
    partName: string;
    tagNo: string;
    model: string;
    whum: string;
    loca1: string;
    loca2: string;
    loca3: string;
    route: string;
    crBy: string;
    crDate: string;
    auditeeQty: number,    
    auditeeBy: string,    
    auditeeDate: string,    
    auditeeStatus: string,    
    auditorQty: number,    
    auditorBy: string,    
    auditorDate: string,    
    auditorStatus: string,    
    qrCode: string;
}

export interface DataTag {
    paramWCNO: string;
}