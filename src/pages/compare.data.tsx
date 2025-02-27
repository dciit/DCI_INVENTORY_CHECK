import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { CompareSum } from '@/interface/summarypart.interface';

interface DataType {
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


interface PropFilter {
    text: string;
    value: string;
}

interface ParamCompareSum {
    data: DataType[];
    tagCompare: CompareSum[];
}


const CreateFilterChoice = (data: DataType[], key: string | number) => {
    let resChoice: PropFilter[] = [];
    [...new Set([...data.map((x: any) => x[key.toString()])])].map(n => {
        resChoice.push({ text: n, value: n })
    })
    return resChoice
}
const ViewCompareSum = (props: ParamCompareSum) => {
    const { data, tagCompare } = props;


    const [columns, setColumn] = useState<TableColumnsType<DataType>>([])
    useEffect(() => {
        if (data.length) {
            setColumn([
                {
                    title: 'Factory',
                    dataIndex: 'factory',
                    showSorterTooltip: { target: 'full-header' },
                    width: 120,
                    filters: CreateFilterChoice(data, 'factory'),
                    onFilter: (value, record) => record.factory.indexOf(value as string) === 0,
                    sorter: (a, b) => a.factory.length - b.factory.length
                },
                {
                    title: "Product",
                    dataIndex: "product",
                    key: "product",
                    align: 'center' as 'center',
                    filters: CreateFilterChoice(data, 'product'),
                    onFilter: (value, record) => record.product.indexOf(value as string) === 0
                },
                {
                    title: "WC",
                    dataIndex: "wcno",
                    key: "wcno",
                    align: 'center' as 'center',
                    filters: CreateFilterChoice(data, 'wcno'),
                    sorter: (a, b) => a.wcno - b.wcno,
                    onFilter: (value, record) => record.wcno.toString().indexOf(value as string) === 0

                },
                {
                    title: "Line Name",
                    dataIndex: "wcnO_NAME",
                    key: "wcnO_NAME",
                    align: 'center' as 'center',
                    width: 300,
                    render: (_text: any, row: { wcno: number; lineType: string; wcnO_NAME: string; }) => {
                        if (row.wcno.toString().startsWith('90')) {
                            return (
                                <>
                                    {row.lineType === "MAIN" ? (
                                        <span>MAIN ASSEMBLY LINE {row.wcno.toString().substring(2, 3)}</span>
                                    ) : row.lineType === "FINAL" ? (
                                        <span>FINAL LINE {row.wcno.toString().substring(2, 3)}</span>
                                    ) : (
                                        <span>EXPLODE LINE {row.wcno.toString().substring(2, 3)}</span>
                                    )}
                                </>

                            );
                        } else {
                            return <span>{row.wcnO_NAME}</span>
                        }
                    }
                },
                {
                    title: "Completed",
                    key: "completed",
                    align: 'center' as 'center',
                    sorter: (a, b) => {
                        const getPercentage = (row: any) => {
                            if (row.lineType === "MAIN") {
                                return row.tagCountMain > 0 ? (row.tagCountMainAuditee / row.tagCountMain) * 100 : 0;
                            } else if (row.lineType === "FINAL") {
                                return row.tagCountFinal > 0 ? (row.tagCountFinalAuditee / row.tagCountFinal) * 100 : 0;
                            } else {
                                return row.tagCountFinal > 0 ? (row.tagCountExplodeAuditee / row.tagCountFinal) * 100 : 0;
                            }
                        };
                        return getPercentage(a) - getPercentage(b);
                    },
                    render: (_text: any, row: { tagCountMain: number; tagCountMainAuditee: number; tagCountFinal: number; tagCountFinalAuditee: number; tagCountExplodeAuditee: number; lineType: string }) => {
                        return (
                            <>
                                <>
                                    {row.lineType === "MAIN" ? (
                                        <span>
                                            {row.tagCountMain > 0
                                                ? ((row.tagCountMainAuditee / row.tagCountMain) * 100).toFixed(1) + "%"
                                                : "0%"}
                                        </span>
                                    ) : row.lineType === "FINAL" ? (
                                        <span>
                                            {row.tagCountFinal > 0
                                                ? ((row.tagCountFinalAuditee / row.tagCountFinal) * 100).toFixed(1) + "%"
                                                : "0%"}
                                        </span>
                                    ) : (
                                        <span>
                                            {row.tagCountFinal > 0
                                                ? ((row.tagCountExplodeAuditee / row.tagCountFinal) * 100).toFixed(1) + "%"
                                                : "0%"}
                                        </span>
                                    )}
                                </>
                            </>
                        );
                    },
                },
                {
                    title: 'BOOK A',
                    children: [
                        {
                            title: "QTY",
                            key: "totalBookQty",
                            align: 'center' as 'center',
                            render: (_text: any, row: { wcno: number; }) => {
                                const compareRows: CompareSum[] = tagCompare.filter((compare: CompareSum) => compare.wcno == row.wcno);
                                const totalBookQty = compareRows.reduce((sum, item) => sum + (item.bookQty || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                return <span>{totalBookQty}</span>;
                            },
                            // sorter: (a, b) => a.bookQty - b.bookQty,
                        },
                        {
                            title: "AMOUNT",
                            key: "totalBookAmt",
                            align: 'center' as 'center',
                            render: (_text: any, row: { wcno: number; }) => {
                                const compareRows: any[] = tagCompare.filter((compare: CompareSum) => compare.wcno === row.wcno);
                                const totalBookAmt = compareRows.reduce((sum, item) => sum + (item.bookAmt || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                return <span>{totalBookAmt}</span>;
                            },
                            // sorter: (a, b) => a.wcno - b.wcno,
                        },
                    ]
                },

                {
                    title: 'Auditee Check(B)',
                    children: [
                        {
                            title: "Aditee Qty",
                            key: "totalAuditeeQty",
                            align: 'center' as 'center',
                            render: (_text: any, row: { wcno: number; }) => {
                                const compareRows: any[] = tagCompare.filter((compare: CompareSum) => compare.wcno === row.wcno);
                                const totalAuditeeQty = compareRows.reduce((sum, item) => sum + (item.auditeeQty || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                return <span>{totalAuditeeQty}</span>;
                            },
                        },
                        {
                            title: "Auditee Amount",
                            key: "totalAuditeeAmt",
                            align: 'center' as 'center',
                            render: (_text: any, row: { wcno: number; }) => {
                                const compareRows: any[] = tagCompare.filter((compare: CompareSum) => compare.wcno === row.wcno);
                                const totalAuditeeAmt = compareRows.reduce((sum, item) => sum + (item.auditeeAmt || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                return <span>{totalAuditeeAmt}</span>;
                            },
                        },
                    ]
                },

                {
                    title: 'Diff.(B-A)',
                    children: [
                        {
                            title: "Aditee Diff Qty",
                            key: "totalAuditeeDiffQty",
                            align: 'center' as 'center',
                            render: (_text: any, row: { wcno: number; }) => {
                                const compareRows: any[] = tagCompare.filter((compare: CompareSum) => compare.wcno === row.wcno);
                                const totalAuditeeDiffQty = compareRows.reduce((sum, item) => sum + (item.auditeeDiffQty || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                return <span>{totalAuditeeDiffQty}</span>;
                            },
                        },
                        {
                            title: "Aditee Diff Amount",
                            key: "totalAuditeeDiffAmt",
                            align: 'center' as 'center',
                            render: (_text: any, row: { wcno: number; }) => {
                                const compareRows: any[] = tagCompare.filter((compare: CompareSum) => compare.wcno === row.wcno);
                                const totalAuditeeDiffAmt = compareRows.reduce((sum, item) => sum + (item.auditeeDiffAmt || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                return <span>{totalAuditeeDiffAmt}</span>;
                            },
                        },
                    ]
                }
            ])
        }
    }, [data])
    return <Table<DataType>
        columns={columns}
        dataSource={data}
        showSorterTooltip={{ target: 'sorter-icon' }}
        pagination={false}
        scroll={{ y: 900 }}
    />
}

export default ViewCompareSum;