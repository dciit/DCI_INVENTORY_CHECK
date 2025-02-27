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

export interface SummatyTagCheckADTE {
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