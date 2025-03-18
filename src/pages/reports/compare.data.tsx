import { useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { CompareSum, DataType } from '@/interface/summarypart.interface';
// import { ReduxInterface } from '@/interface/main.interface';
// import { useSelector } from 'react-redux';
import { API_SUMMARY_COMPARE } from '@/service/conclusion.service';
import DetailCompareSum from './detailcomparesum';
// import { PropSummary } from '../auditee/finalsum.auditee';


export interface PropFilter {
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

interface Props {
    bookQty: number;
    bookAMT: number;
    auditeeQty: number;
    auditeeAmt: number;
    auditeeDiffQty: number;
    anuditeeDiffAmt: number;

}
const ViewCompareSum = (props: ParamCompareSum) => {
    const { data, tagCompare } = props;
    const [summary, setSummary] = useState<Props>({
        bookQty: 0, bookAMT: 0, auditeeQty: 0, auditeeAmt: 0, auditeeDiffQty: 0, anuditeeDiffAmt: 0
    })
    // const oAccount: ReduxInterface = useSelector((state: any) => state.reducer)

    const [SumcompareData, setSumcompareData] = useState<CompareSum[]>([]);
    const [isModalPart, setIsModalPart] = useState<boolean>(false);


    const handleModelPart = async (wcno: number) => {
        setSumcompareData([])
        setIsModalPart(true);

        const ressumcompare = await API_SUMMARY_COMPARE(
            'SET20250217WPDC3U608341659000001',
            '202502'!,
            wcno.toString()
        );
        setSumcompareData(ressumcompare)
    };

    const [columns, setColumn] = useState<TableColumnsType<DataType>>([])

    //---------------------columns------------------------------
    
    useEffect(() => {
        if (data.length) {
            setColumn([
                {
                    title: <div className='text-center text-sm'>FACTORY</div>,
                    dataIndex: 'factory',
                    showSorterTooltip: { target: 'full-header' },
                    width: 120,
                    className: 'text-sm',
                    filters: CreateFilterChoice(data, 'factory'),
                    onFilter: (value, record) => record.factory.indexOf(value as string) === 0,
                    sorter: (a, b) => a.factory.length - b.factory.length
                },
                {
                    title: <div className='text-sm text-center'>PRODUCT</div>,
                    dataIndex: "product",
                    key: "product",
                    className: 'text-sm',
                    align: 'left' as 'left',
                    filters: CreateFilterChoice(data, 'product'),
                    onFilter: (value, record) => record.product.indexOf(value as string) === 0
                },
                {
                    title: "WC",
                    dataIndex: "wcno",
                    className: 'text-sm text-right',
                    key: "wcno",
                    align: 'right' as 'right',
                    width: '5%',
                    filters: CreateFilterChoice(data, 'wcno'),
                    sorter: (a, b) => a.wcno - b.wcno,
                    onFilter: (value, record) => record.wcno.toString().indexOf(value as string) === 0

                },
                {
                    title: <div className='text-center text-sm'>LINE NAME</div>,
                    dataIndex: "wcnO_NAME",
                    key: "wcnO_NAME",
                    align: 'left' as 'left',
                    className: 'text-sm',
                    width: 300,
                },
                // {
                //     title: "COMPLATED",
                //     key: "completed",
                //     align: 'right' as 'right',
                //     className: 'text-lg',
                //     sorter: (a, b) => {
                //         const getPercentage = (row: any) => {
                //             const tagCountAuditee = row[`tagCountAuditee${row.lineType}`];
                //             const tagCountTotal = row[`tagCount${row.lineType}`];

                //             return tagCountTotal > 0 ? (tagCountAuditee / tagCountTotal) * 100 : 0;
                //         };

                //         return getPercentage(a) - getPercentage(b);
                //     },

                //     // sorter: (a, b) => {
                //     //     const getPercentage = (row: any) => {
                //     //         if (row.lineType === "MAIN") {
                //     //             return row.tagCountMain > 0 ? (row.tagCountMainAuditee / row.tagCountMain) * 100 : 0;
                //     //         } else if (row.lineType === "FINAL") {
                //     //             return row.tagCountFinal > 0 ? (row.tagCountFinalAuditee / row.tagCountFinal) * 100 : 0;
                //     //         } else {
                //     //             return row.tagCountFinal > 0 ? (row.tagCountExplodeAuditee / row.tagCountFinal) * 100 : 0;
                //     //         }
                //     //     };
                //     //     return getPercentage(a) - getPercentage(b);
                //     // },
                //     // render: (_text: any, row: { tagCountMain: number; tagCountMainAuditee: number; tagCountFinal: number; tagCountFinalAuditee: number; tagCountExplodeAuditee: number; lineType: string }) => {
                //     //     return (
                //     //         <>
                //     //             <>
                //     //                 {row.lineType === "MAIN" ? (
                //     //                     <span >
                //     //                         {row.tagCountMain > 0
                //     //                             ? ((row.tagCountMainAuditee / row.tagCountMain) * 100).toFixed(1) + "%"
                //     //                             : "0%"}
                //     //                     </span>
                //     //                 ) : row.lineType === "FINAL" ? (
                //     //                     <span>
                //     //                         {row.tagCountFinal > 0
                //     //                             ? ((row.tagCountFinalAuditee / row.tagCountFinal) * 100).toFixed(1) + "%"
                //     //                             : "0%"}
                //     //                     </span>
                //     //                 ) : (
                //     //                     <span>
                //     //                         {row.tagCountFinal > 0
                //     //                             ? ((row.tagCountExplodeAuditee / row.tagCountFinal) * 100).toFixed(1) + "%"
                //     //                             : "0%"}
                //     //                     </span>
                //     //                 )}
                //     //             </>
                //     //         </>
                //     //     );
                //     // },
                // },
                {
                    title: <div className='text-center text-sm'>BOOK A</div>,
                    children: [
                        {
                            title: <div className='text-center text-sm'>QTY</div>,
                            key: "totalBookQty",
                            className: 'text-sm',
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
                            title: <div className='text-center text-sm'>AMOUNT</div>,
                            key: "totalBookAmt",
                            className: 'text-sm',
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
                    title: <div className='text-center text-sm'>AUDITEE CHECK(B)</div>,
                    children: [
                        {
                            title: <div className='text-center text-sm'>AUDITEE QTY</div>,
                            key: "totalAuditeeQty",
                            className: 'text-sm',
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
                            title: <div className='text-center text-sm'>AUDITEE AMOUNT</div>,
                            key: "totalAuditeeAmt",
                            className: 'text-sm',
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

                    title: <div className='text-center text-sm'>DIFF.(B-A)</div>,
                    children: [
                        {
                            title: <div className='text-center text-sm'>AUDITEE DIFF QTY</div>,
                            key: "totalAuditeeDiffQty",
                            className: 'text-sm',
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
                            title: <div className='text-center text-sm'>AUDITEE DIFF AMOUNT</div>,
                            key: "totalAuditeeDiffAmt",
                            className: 'text-sm',
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
                    title: <div className="text-center text-sm">OPERATIONS</div>,
                    dataIndex: "operation",
                    render: (_text: any, row: { wcno: number }) => {
                        return (
                            <div className="flex justify-end">
                                <Button type="primary" className='h-7' onClick={() => handleModelPart(row.wcno)}>
                                    ดูรายละเอียด
                                </Button>
                            </div>
                        );
                    },
                }
                
            ])
        }
    }, [data])

    useEffect(() => {
        let clone = [...tagCompare];
        let bookqtysum: number = 0;
        let bookamtsum: number = 0;
        let auditeeqty: number = 0;
        let auditeeamt: number = 0;
        let auditeediffqty: number = 0;
        let auditeediffamt: number = 0; 
        bookqtysum = clone.reduce((sum, item) => sum + item.bookQty, 0)
        bookamtsum = clone.reduce((sum, item) => sum + item.bookAmt, 0)
        auditeeqty = clone.reduce((sum, item) => sum + item.auditeeQty, 0)
        auditeeamt = clone.reduce((sum, item) => sum + item.auditeeAmt, 0)
        auditeediffqty = clone.reduce((sum, item) => sum + item.auditeeDiffQty, 0)
        auditeediffamt = clone.reduce((sum, item) => sum + item.auditeeDiffAmt, 0) 
        setSummary({
            bookQty: bookqtysum,
            bookAMT: bookamtsum,
            auditeeQty: auditeeqty,
            auditeeAmt: auditeeamt,
            auditeeDiffQty: auditeediffqty,
            anuditeeDiffAmt: auditeediffamt
        })
    }, [columns])


    const onChange: TableProps<DataType>['onChange'] = (_, filters, _sorter, _extra) => {
        let clone = [...tagCompare];
        let bookqtysum: number = 0;
        let bookamtsum: number = 0;
        let auditeeqty: number = 0;
        let auditeeamt: number = 0;
        let auditeediffqty: number = 0;
        let auditeediffamt: number = 0;

        const filterWcno = filters.wcno as number[] | null;
        if (filterWcno != null) {
            clone = clone.filter(x => filterWcno.includes(x.wcno))
            bookqtysum = clone.reduce((sum, item) => sum + item.bookQty, 0)
            bookamtsum = clone.reduce((sum, item) => sum + item.bookAmt, 0)
            auditeeqty = clone.reduce((sum, item) => sum + item.auditeeQty, 0)
            auditeeamt = clone.reduce((sum, item) => sum + item.auditeeAmt, 0)
            auditeediffqty = clone.reduce((sum, item) => sum + item.auditeeDiffQty, 0)
            auditeediffamt = clone.reduce((sum, item) => sum + item.auditeeDiffAmt, 0)
        } else {
            bookqtysum = clone.reduce((sum, item) => sum + item.bookQty, 0)
            bookamtsum = clone.reduce((sum, item) => sum + item.bookAmt, 0)
            auditeeqty = clone.reduce((sum, item) => sum + item.auditeeQty, 0)
            auditeeamt = clone.reduce((sum, item) => sum + item.auditeeAmt, 0)
            auditeediffqty = clone.reduce((sum, item) => sum + item.auditeeDiffQty, 0)
            auditeediffamt = clone.reduce((sum, item) => sum + item.auditeeDiffAmt, 0)
        }
        const FilterFac = filters.factory as string[] | null;
        if (FilterFac != null) {
            clone = clone.filter(x => FilterFac.includes(x.factory))
            bookqtysum = clone.reduce((sum, item) => sum + item.bookQty, 0)
            bookamtsum = clone.reduce((sum, item) => sum + item.bookAmt, 0)
            auditeeqty = clone.reduce((sum, item) => sum + item.auditeeQty, 0)
            auditeeamt = clone.reduce((sum, item) => sum + item.auditeeAmt, 0)
            auditeediffqty = clone.reduce((sum, item) => sum + item.auditeeDiffQty, 0)
            auditeediffamt = clone.reduce((sum, item) => sum + item.auditeeDiffAmt, 0)
        } else {
            bookqtysum = clone.reduce((sum, item) => sum + item.bookQty, 0)
            bookamtsum = clone.reduce((sum, item) => sum + item.bookAmt, 0)
            auditeeqty = clone.reduce((sum, item) => sum + item.auditeeQty, 0)
            auditeeamt = clone.reduce((sum, item) => sum + item.auditeeAmt, 0)
            auditeediffqty = clone.reduce((sum, item) => sum + item.auditeeDiffQty, 0)
            auditeediffamt = clone.reduce((sum, item) => sum + item.auditeeDiffAmt, 0)
        }
        const FilterProduct = filters.product as string[] | null;
        if (FilterProduct != null) {
            clone = clone.filter(x => FilterProduct.includes(x.product))
            bookqtysum = clone.reduce((sum, item) => sum + item.bookQty, 0)
            bookamtsum = clone.reduce((sum, item) => sum + item.bookAmt, 0)
            auditeeqty = clone.reduce((sum, item) => sum + item.auditeeQty, 0)
            auditeeamt = clone.reduce((sum, item) => sum + item.auditeeAmt, 0)
            auditeediffqty = clone.reduce((sum, item) => sum + item.auditeeDiffQty, 0)
            auditeediffamt = clone.reduce((sum, item) => sum + item.auditeeDiffAmt, 0)
        } else {
            bookqtysum = clone.reduce((sum, item) => sum + item.bookQty, 0)
            bookamtsum = clone.reduce((sum, item) => sum + item.bookAmt, 0)
            auditeeqty = clone.reduce((sum, item) => sum + item.auditeeQty, 0)
            auditeeamt = clone.reduce((sum, item) => sum + item.auditeeAmt, 0)
            auditeediffqty = clone.reduce((sum, item) => sum + item.auditeeDiffQty, 0)
            auditeediffamt = clone.reduce((sum, item) => sum + item.auditeeDiffAmt, 0)
        }
        setSummary({
            bookQty: bookqtysum,
            bookAMT: bookamtsum,
            auditeeQty: auditeeqty,
            auditeeAmt: auditeeamt,
            auditeeDiffQty: auditeediffqty,
            anuditeeDiffAmt: auditeediffamt
        })
    };
    
    return (<>
        <Table<DataType>
            size="middle"
            className=' rounded-lg px-6'
            columns={columns}
            dataSource={data}
            showSorterTooltip={{ target: 'sorter-icon' }}
            bordered
            onChange={onChange}
            scroll={{ y: 800 }}
            summary={() => (
                <Table.Summary.Row className='text-sm text-right font-bold bg-yellow-50'>
                    <Table.Summary.Cell colSpan={4} index={0}  >
                        Total
                    </Table.Summary.Cell>
                    {/* <Table.Summary.Cell colSpan={1} index={0}  >
                    </Table.Summary.Cell> */}
                    <Table.Summary.Cell index={0} >
                        {summary.bookQty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={0} >
                        {summary.bookAMT.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={0} >
                        {summary.auditeeQty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={0} >
                        {summary.auditeeAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={0} >
                        {summary.auditeeDiffQty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={0} >
                        {summary.anuditeeDiffAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={0}>

                    </Table.Summary.Cell>
                </Table.Summary.Row>
            )}
        />

        <DetailCompareSum open={isModalPart} close={setIsModalPart} sumData={SumcompareData} />
       
    </>)
}

export default ViewCompareSum;