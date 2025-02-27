import { useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { CompareSum, DataType } from '@/interface/summarypart.interface';
import { ReduxInterface } from '@/interface/main.interface';
import { useSelector } from 'react-redux';
import { API_SUMMARY_COMPARE } from '@/service/conclusion.service';
import DetailCompareSum from './detailcomparesum';


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

    const oAccount: ReduxInterface = useSelector((state: any) => state.reducer)

    const [SumcompareData, setSumcompareData] = useState<CompareSum[]>([]);
    const [isModalPart, setIsModalPart] = useState<boolean>(false);

    const handleModelPart = async (wcno: number) => {
        
        setSumcompareData([])
        setIsModalPart(true);
 
        const ressumcompare = await API_SUMMARY_COMPARE(
            oAccount.authen.mSetInfo?.setCode!,
            oAccount.authen.mSetInfo?.ym!,
            wcno.toString()
        ); 
        setSumcompareData(ressumcompare)
 
    };


    const [columns, setColumn] = useState<TableColumnsType<DataType>>([])
    useEffect(() => {
        if (data.length) {
            setColumn([
                {
                    title: 'Factory',
                    dataIndex: 'factory',
                    showSorterTooltip: { target: 'full-header' },
                    width: 120,
                    className: 'text-lg',
                    filters: CreateFilterChoice(data, 'factory'),
                    onFilter: (value, record) => record.factory.indexOf(value as string) === 0,
                    sorter: (a, b) => a.factory.length - b.factory.length
                },
                {
                    title: "Product",
                    dataIndex: "product",
                    key: "product",
                    className: 'text-lg',
                    align: 'left' as 'left',
                    filters: CreateFilterChoice(data, 'product'),
                    onFilter: (value, record) => record.product.indexOf(value as string) === 0
                },
                {
                    title: "WC",
                    dataIndex: "wcno",
                    className: 'text-lg text-right',
                    key: "wcno",
                    align: 'right' as 'right',
                    filters: CreateFilterChoice(data, 'wcno'),
                    sorter: (a, b) => a.wcno - b.wcno,
                    onFilter: (value, record) => record.wcno.toString().indexOf(value as string) === 0

                },
                {
                    title: "Line Name",
                    dataIndex: "wcnO_NAME",
                    key: "wcnO_NAME",
                    align: 'left' as 'left',
                    className: 'text-lg',
                    width: 400,
                    render: (_text: any, row: { wcno: number; lineType: string; wcnO_NAME: string; }) => {
                        if (row.wcno.toString().startsWith('90')) {
                            return (
                                <>
                                    {row.lineType === "MAIN" ? (
                                        <span style={{ textAlign: "left" }}>MAIN ASSEMBLY LINE {row.wcno.toString().substring(2, 3)}</span>
                                    ) : row.lineType === "FINAL" ? (
                                        <span>FINAL LINE {row.wcno.toString().substring(2, 3)}</span>
                                    ) : (
                                        <span>EXPLODE LINE {row.wcno.toString().substring(2, 3)}</span>
                                    )}
                                </>
                            );
                        } else {
                            return <span>{row.wcnO_NAME}</span>;
                        }
                    }

                },
                {
                    title: "Completed",
                    key: "completed",
                    align: 'right' as 'right',
                    className: 'text-lg',
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
                                        <span >
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
                            className: 'text-lg',
                            align: 'right' as 'right',
                            render: (_text: any, row: { wcno: number; }) => {
                                const compareRows: CompareSum[] = tagCompare.filter((compare: CompareSum) => compare.wcno == row.wcno);
                                const totalBookQty = compareRows.reduce((sum, item) => sum + (item.bookQty || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                return <span>{totalBookQty}</span>;
                            },
                            sorter: (a: DataType, b: DataType) => {
                                const bookqtyA = tagCompare
                                    .filter(compare => compare.wcno === a.wcno)
                                    .reduce((sum, item) => sum + (item.bookQty || 0), 0);

                                const bookqtyB = tagCompare
                                    .filter(compare => compare.wcno === b.wcno)
                                    .reduce((sum, item) => sum + (item.bookQty || 0), 0);

                                return bookqtyA - bookqtyB;
                            }
                        },
                        {
                            title: "AMOUNT",
                            key: "totalBookAmt",
                            className: 'text-lg',
                            align: 'right' as 'right',
                            render: (_text: any, row: { wcno: number; }) => {
                                const compareRows: any[] = tagCompare.filter((compare: CompareSum) => compare.wcno === row.wcno);
                                const totalBookAmt = compareRows.reduce((sum, item) => sum + (item.bookAmt || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                return <span>{totalBookAmt}</span>;
                            },
                            sorter: (a: DataType, b: DataType) => {
                                const bookamtA = tagCompare
                                    .filter(compare => compare.wcno === a.wcno)
                                    .reduce((sum, item) => sum + (item.bookAmt || 0), 0);

                                const bookamtB = tagCompare
                                    .filter(compare => compare.wcno === b.wcno)
                                    .reduce((sum, item) => sum + (item.bookAmt || 0), 0);

                                return bookamtA - bookamtB
                            }
                        },
                    ]
                },
                {
                    title: 'Auditee Check(B)',
                    children: [
                        {
                            title: "Aditee Qty",
                            key: "totalAuditeeQty",
                            className: 'text-lg',
                            align: 'right' as 'right',
                            render: (_text: any, row: { wcno: number; }) => {
                                const compareRows: any[] = tagCompare.filter((compare: CompareSum) => compare.wcno === row.wcno);
                                const totalAuditeeQty = compareRows.reduce((sum, item) => sum + (item.auditeeQty || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                return <span>{totalAuditeeQty}</span>;
                            },
                            sorter: (a: DataType, b: DataType) => {
                                const auditeeQtyA = tagCompare
                                    .filter(compare => compare.wcno === a.wcno)
                                    .reduce((sum, item) => sum + (item.auditeeQty || 0), 0);

                                const auditeeQtyB = tagCompare
                                    .filter(compare => compare.wcno === b.wcno)
                                    .reduce((sum, item) => sum + (item.auditeeQty || 0), 0);

                                return auditeeQtyA - auditeeQtyB
                            }
                        },
                        {
                            title: "Auditee Amount",
                            key: "totalAuditeeAmt",
                            className: 'text-lg',
                            align: 'right' as 'right',
                            render: (_text: any, row: { wcno: number; }) => {
                                const compareRows: any[] = tagCompare.filter((compare: CompareSum) => compare.wcno === row.wcno);
                                const totalAuditeeAmt = compareRows.reduce((sum, item) => sum + (item.auditeeAmt || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                return <span>{totalAuditeeAmt}</span>;
                            },
                            sorter: (a: DataType, b: DataType) => {
                                const auditeeAmtA = tagCompare
                                    .filter(compare => compare.wcno === a.wcno)
                                    .reduce((sum, item) => sum + (item.auditeeAmt || 0), 0);

                                const auditeeAmtB = tagCompare
                                    .filter(compare => compare.wcno === b.wcno)
                                    .reduce((sum, item) => sum + (item.auditeeAmt || 0), 0);

                                return auditeeAmtA - auditeeAmtB
                            }
                        },
                    ]
                },
                {

                    title: 'Diff.(B-A)',
                    children: [
                        {
                            title: "Aditee Diff Qty",
                            key: "totalAuditeeDiffQty",
                            className: 'text-lg',
                            align: 'right' as 'right',
                            render: (_text: any, row: { wcno: number; }) => {
                                const compareRows: any[] = tagCompare.filter((compare: CompareSum) => compare.wcno === row.wcno);
                                const totalAuditeeDiffQty = compareRows.reduce((sum, item) => sum + (item.auditeeDiffQty || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                return <span>{totalAuditeeDiffQty}</span>;
                            },
                            sorter: (a: DataType, b: DataType) => {
                                const auditeeDiffQtyA = tagCompare
                                    .filter(compare => compare.wcno === a.wcno)
                                    .reduce((sum, item) => sum + (item.auditeeDiffQty || 0), 0);

                                const auditeeDiffQtyB = tagCompare
                                    .filter(compare => compare.wcno === b.wcno)
                                    .reduce((sum, item) => sum + (item.auditeeDiffQty || 0), 0);

                                return auditeeDiffQtyA - auditeeDiffQtyB
                            }
                        },
                        {
                            title: "Aditee Diff Amount",
                            key: "totalAuditeeDiffAmt",
                            className: 'text-lg',
                            align: 'right' as 'right',
                            render: (_text: any, row: { wcno: number; }) => {
                                const compareRows: any[] = tagCompare.filter((compare: CompareSum) => compare.wcno === row.wcno);
                                const totalAuditeeDiffAmt = compareRows.reduce((sum, item) => sum + (item.auditeeDiffAmt || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                return <span>{totalAuditeeDiffAmt}</span>;
                            },
                            sorter: (a: DataType, b: DataType) => {
                                const auditeeDiffAmtA = tagCompare
                                    .filter(compare => compare.wcno === a.wcno)
                                    .reduce((sum, item) => sum + (item.auditeeDiffAmt || 0), 0);

                                const auditeeDiffAmtB = tagCompare
                                    .filter(compare => compare.wcno === b.wcno)
                                    .reduce((sum, item) => sum + (item.auditeeDiffAmt || 0), 0);

                                return auditeeDiffAmtA - auditeeDiffAmtB
                            }
                        },
                    ]
                },
                {
                    title: 'operation',
                    dataIndex: 'operation',
                    render: (_text: any, row: { wcno: number; }) => {

                        return (
                            <Button type="primary" onClick={() => handleModelPart(row.wcno)}>
                                ดูรายละเอียด
                            </Button>
                        );
                    },

                },
            ])
        }
    }, [data])

    const sumBookQty = tagCompare.reduce((sum: any, item: any) => sum + (item.bookQty || 0), 0);
    const sumBookAmt = tagCompare.reduce((sum: any, item: any) => sum + (item.bookAmt || 0), 0);
    const sumAuditeeQty = tagCompare.reduce((sum: any, item: any) => sum + (item.auditeeQty || 0), 0);
    const sumAuditeeAmt = tagCompare.reduce((sum: any, item: any) => sum + (item.auditeeAmt || 0), 0);
    const sumAuditeeDiffQty = tagCompare.reduce((sum: any, item: any) => sum + (item.auditeeDiffQty || 0), 0);
    const sumAuditeeDiffAmt = tagCompare.reduce((sum: any, item: any) => sum + (item.auditeeDiffAmt || 0), 0);

    return (<>
        <Table<DataType>
            className=' rounded-lg'
            columns={columns}
            dataSource={data}
            showSorterTooltip={{ target: 'sorter-icon' }}
            pagination={false}
            scroll={{ y: 800 }}
            summary={() => (
                <Table.Summary.Row className='text-lg text-right font-bold'>
                    <Table.Summary.Cell colSpan={4} index={0}  >
                        Total
                    </Table.Summary.Cell>
                    <Table.Summary.Cell colSpan={1} index={0}  >
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={0} >
                        {sumBookQty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={0} >
                        {sumBookAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={0} >
                        {sumAuditeeQty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={0} >
                        {sumAuditeeAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={0} >
                        {sumAuditeeDiffQty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={0} >
                        {sumAuditeeDiffAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Table.Summary.Cell>
                </Table.Summary.Row>
            )}
        />

        <DetailCompareSum open={isModalPart} close={setIsModalPart} sumData={SumcompareData} />
    </>)
}

export default ViewCompareSum;