export interface SummaryHeader {
    ivSetCode: string;
    wcno: string;
    model: string;
    lastDate: string;
}

export interface SummaryPartList {
    ivSetCode: string;
    wcno: string;
    tagNo: string;
    partNo: string;
    cm: string;
    partName: string;
    sumQty: number
}

export interface SummaryData {
    ivSetCode: string,
    wcno: string,
    model: string,
    partNo: string,
    cm: string,
    partName: string,
    qty: number,
    lastDate: string
}

{/*conclusion auditee*/ }

export interface SummaryTagCheckADTE {
    key: React.Key;
    ivSetCode: string;
    wcno: string;
    wcnO_SName: string;
    wcnO_NAME: string;
    grpCode: string;
    factory: string;
    product: string;
    lineType: string;
    lineSub: string;
    kind: string;
    tagCount: number;
    tagCountAuditee: number;
    tagCountAuditor: number;
    tagCountMain: number;
    tagCountMainAuditee: number;
    tagCountMainAuditor: number;
    tagCountFinal: number;
    tagCountFinalAuditee: number;
    tagCountFinalAuditor: number;
    tagCountExplode: number;
    tagCountExplodeAuditee: number;
    tagCountExplodeAuditor: number;
}

export interface FacData {
    factory: string;
}


{/*compare sum */ }

export interface CompareSum {
    ivSetCode: string;
    ym: string;
    factory: string;
    product: string;
    wcno: number;
    wcnO_SName: string;
    wcnO_NAME: string;
    partNo: string;
    cm: string;
    partName: string;
    tagNo: string;
    whum: string;
    stdCost: number;
    bookQty: number;
    bookAmt: number;
    auditeeQty: number;
    auditeeAmt: number;
    auditorQty: number;
    auditorAmt: number;
    auditeeDiffQty: number;
    auditeeDiffAmt: number;
    auditorDiffQty: number;
    auditorDiffAmt: number;
}

export interface DataType {
    key: React.Key;
    ivSetCode: string;
    wcno: number;
    wcnO_SName: string;
    wcnO_NAME: string;
    grpCode: string;
    factory: string;
    product: string;
    lineType: string;
    lineSub: string;
    kind: string;
    tagCount: number;
    tagCountAuditee: number;
    tagCountAuditor: number;
    tagCountMain: number;
    tagCountMainAuditee: number;
    tagCountMainAuditor: number;
    tagCountFinal: number;
    tagCountFinalAuditee: number;
    tagCountFinalAuditor: number;
    tagCountExplode: number;
    tagCountExplodeAuditee: number;
    tagCountExplodeAuditor: number;
}


export interface TagData {
    auditeeBy: string;
    auditeeDate: string
    auditeeQty: number
    auditeeStatus: string
    auditorBy: string
    auditorDate: string
    auditorQty: number
    auditorStatus: string
    cm: string
    crBy: string
    crDate: string
    ivSetCode: string
    lineType: string
    loca1: string
    loca2: string
    loca3: string
    model: string
    partName: string
    partNo: string
    qrCode: string
    route: string
    tagNo: string
    wcnO_NAME: string
    wcnO_SName: string
    wcno: string
    whum: string
    ym: string
}


{/* auditee */}
export interface HistoryAuditee {
    ivSetCode: string;
    ym: string;
    wcno: string;
    lineType: string;
    partNo: string;
    cm: string;
    partName: string;
    tagNo: string;
    whum: string;
    auditeeQty: number;
    auditeeBy: string;
    auditeeDate: string;
}


{/* Audiror */}
export interface HistoryAuditor {
    ivSetCode: string;
    ym: string;
    wcno: string;
    lineType: string;
    partNo: string;
    cm: string;
    partName: string;
    tagNo: string;
    whum: string;
    auditorQty: number;
    auditorBy: string;
    auditorDate: string;
}

{/*commithead */}
export interface CommitauditorHead {
    grpCode: string;
    grpInfo: any;
    ivSetCode: string;
    ym: string;
    factory: string;
    product: string;
    wcno: string;
    wcnO_SNAME: string;
    wcnO_NAME: string;
    balqty:number;
    balamt: number;
    bkqty:number;
    bkamt: number;
    phyqty: number
   phyamt: number;
    auditorQty: number;
    auditorAMT: number;
    diffQty: number;
    diffAMT: number;
}