// import { base } from "@/constants";
// import { TagInfo } from "@/interface/gentag.interface";
import Navbar from "@/components/main/navbar";
import { ReduxInterface } from "@/interface/main.interface";
import { DataType, SummaryTagCheckADTE, TagData } from "@/interface/summarypart.interface"
import { API_TEG_SUMCHECK_ADTE } from "@/service/conclusion.service";
import { API_TEG_SELECT } from "@/service/tag.service";
import { Button, Table, TableProps } from "antd";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { TbReportSearch } from "react-icons/tb";
import DetailSumAuditor from "./detailsum.auditor";
import { CircularProgress } from "@mui/material";

interface PropSummary {
    tag: number;
    tagCount: number;
}

function FinalSumAiditor() {

    const [summary, setSummary] = useState<PropSummary>({
        tag: 0, tagCount: 9999
    })

    const oAccount: ReduxInterface = useSelector((state: any) => state.reducer);

    const [tagCheck, setTagCheck] = useState<SummaryTagCheckADTE[]>([])
    const [factory, setFactoryData] = useState<String[]>([]);

    const oLineTyps = ['MAIN', 'FINAL', 'EXPLODE'];

    const [isModalPart, setIsModalPart] = useState<boolean>(false);
    const [TagData, setTagData] = useState<TagData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [_filters, setFilters] = useState<string[]>([])
    let once: boolean = true;


    const fetchCheckTag = async () => {
        setLoading(true);
        try {
            let checktag = await API_TEG_SUMCHECK_ADTE(
                'SET20250217WPDC3U608341659000001',
                oAccount.authen.sName!,
                '202502'
            );
            let clone: DataType[] = checktag.filter((row: DataType) => row.factory && (row.factory.startsWith("FAC") || row.factory.startsWith("ODM")) && row.wcno.toString().startsWith("90"))
            clone.map((row: DataType) => {
                oLineTyps.map((oLine: string) => {
                    let rename: string = '';
                    let tagCount: number = 0;
                    let tagCountAuditor: number = 0;
                    if (oLine == 'MAIN') {
                        rename = `MAIN ASSEMBLY LINE ${row.wcno.toString().substring(2, 3)}`
                        tagCount = row.tagCountMain;
                        tagCountAuditor = row.tagCountMainAuditor;
                        console.log(row)
                    } else if (oLine == 'FINAL') {
                        rename = `FINAL LINE ${row.wcno.toString().substring(2, 3)}`
                        tagCount = row.tagCountFinal;
                        tagCountAuditor = row.tagCountFinalAuditor;
                    } else {
                        rename = `แตก Part LINE ${row.wcno.toString().substring(2, 3)}`;
                        tagCount = row.tagCountExplode;
                        tagCountAuditor = row.tagCountExplodeAuditor;
                    }
                    checktag.push({ factory: row.factory, product: row.product, wcno: row.wcno, wcnO_NAME: rename, tagCount: tagCount, tagCountAuditor: tagCountAuditor })
                })
            })

            if (checktag && Array.isArray(checktag)) {
                setTagCheck(checktag);

                const uniqueFactories = Array.from(new Set(checktag.map((item) => item.factory)));
                setFactoryData(uniqueFactories);

            } else {
            }
        } catch (error) {
        }

        setLoading(false);
    };

    useEffect(() => {
        let tagSum: number = tagCheck.reduce((sum, item) => sum + item.tagCount, 0)
        let tagCountSum: number = tagCheck.reduce((sum, item) => sum + item.tagCountAuditor, 0)
        setSummary({ tag: tagSum, tagCount: tagCountSum })
    }, [tagCheck])


    useEffect(() => {
        if (once) {
            setLoading(false);
            once = !once;
        }
    }, [factory])

    const handleModalPart = async (data: SummaryTagCheckADTE) => {
        setTagData([]);
        setIsModalPart(true);
        const resTagData = await API_TEG_SELECT(
            'SET20250217WPDC3U608341659000001',
            '202502',
            data.wcno
        );
        setTagData(resTagData);
        console.log('123', resTagData)
    }


    interface PropFilter {
        text: string;
        value: string;
    }

    const CreateFilterChoice = (data: any[], key: string | number) => {
        let resChoice: PropFilter[] = [];
        [...new Set([...data.map((x: any) => x[key.toString()])])].map(n => {
            resChoice.push({ text: n, value: n })
        })
        return resChoice
    }

    useEffect(() => {
        fetchCheckTag();
    }, []);

    const columns = [
        {
            title: <div className="text-center">FACTORY</div>,
            dataIndex: 'factory',
            key: 'factory',
            filters: CreateFilterChoice(tagCheck, 'factory'),
            onFilter: (value: any, record: any) => record.factory.indexOf(value as string) === 0

        },
        {
            title: <div className="text-center">PRODUCT</div>,
            dataIndex: 'product',
            key: 'product',
            filters: CreateFilterChoice(tagCheck, 'product'),
            onFilter: (value: any, record: any) => record.product.indexOf(value as string) === 0,
        },
        {
            title: 'WC',
            dataIndex: 'wcno',
            key: 'wcno',
            filters: CreateFilterChoice(tagCheck, 'wcno'),
            onFilter: (value: any, record: any) => {
                setFilters(value)
                return record.wcno.indexOf(value as string) === 0
            },
        },
        {
            title: <div className="text-center">LINE NAME</div>,
            dataIndex: 'wcnO_NAME',
            key: 'wcnO_NAME',
        },
        {
            title: 'AUDITOR CHECK',
            children: [
                {
                    title: "จำนวนที่ปริ๊นท์ ",
                    dataIndex: 'tagCount',
                    key: "tagCount",
                    align: 'right' as 'right',
                    sorter: (a: any, b: any) => a.tagCount - b.tagCount,
                    render: (_text: any, row: { tagCount: number, tagCountAuditor: number }) => {
                        return <span className={`font-semibold text-sky-600 `}>{row.tagCount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>;
                    },
                },
                {
                    title: "จำนวนที่นับได้  ",
                    dataIndex: 'tagCountAuditor',
                    key: "tagCountAuditor",
                    align: 'right' as 'right',
                    filters: [
                        { text: 'ครบแล้ว', value: 'COMPLETED' },
                        { text: 'ยังไม่ครบ', value: 'NOT-COMPLETED' },
                    ],
                    onFilter: (value: any, record: any) => value == 'COMPLETED' ? record.tagCountAuditor == record.tagCount : record.tagCountAuditor != record.tagCount,
                    render: (_text: any, row: { tagCount: number, tagCountAuditor: number }) => {
                        return <span className={`font-semibold ${row.tagCountAuditor < row.tagCount ? 'text-red-500' : (row.tagCountAuditor == row.tagCount ? 'text-green-500' : '')}`}>
                                    {row.tagCountAuditor.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </span>;
                    },
                },
                {
                    title: "จำนวนคงเหลือ",
                    dataIndex: 'tagCount',
                    key: "tagCount",
                    align: 'right' as 'right',
                    sorter: (a: any, b: any) => (a.tagCount - a.tagCountAuditor) - (b.tagCount - b.tagCountAuditor),
                    render: (_text: any, row: { tagCount: number, tagCountAuditor: number }) => {
                        return <span className={`font-semibold ${row.tagCountAuditor < row.tagCount ? 'text-red-500' : (row.tagCountAuditor == row.tagCount ? 'text-green-500' : '')}`}>
                                    {(row.tagCount - row.tagCountAuditor).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>;
                    },
                }
            ]
        },
        {
            title: 'COMPLETED',
            align: 'center' as 'center',
            render: (_text: any, row: SummaryTagCheckADTE) => {
                return <div className='flex items-center justify-around text-right'>
                    <span className={`font-semibold text-right ${row.tagCountAuditor < row.tagCount ? 'text-red-500' : (row.tagCountAuditor == row.tagCount ? 'text-green-500' : '')}`}>{row.tagCount > 0 ? ((row.tagCountAuditor / row.tagCount) * 100).toFixed(1) + "%" : "0%"}</span>
                    <Button type="primary" size="small" icon={<TbReportSearch />} onClick={() => handleModalPart(row)} >
                        แสดงรายการ</Button>
                </div>;
            },
        },
    ];

    const onChange: TableProps<SummaryTagCheckADTE>['onChange'] = (_pagination, filters, _sorter, _extra) => {
        let clone = [...tagCheck];
        let tagSum: number = 0;
        let tagCountSum: number = 0;

        const filterWcno = filters.wcno as string[] | null;
        if (filterWcno != null) {
            clone = clone.filter(x => filterWcno.includes(x.wcno))
            tagSum = clone.reduce((sum, item) => sum + item.tagCount, 0)
            tagCountSum = clone.reduce((sum, item) => sum + item.tagCountAuditor, 0)
        } else {
            tagSum = clone.reduce((sum, item) => sum + item.tagCount, 0)
            tagCountSum = clone.reduce((sum, item) => sum + item.tagCountAuditor, 0)
        }
        const filterFac = filters.factory as string[] | null;
        if (filterFac != null) {
            clone = clone.filter(x => filterFac.includes(x.factory))
            tagSum = clone.reduce((sum, item) => sum + item.tagCount, 0)
            tagCountSum = clone.reduce((sum, item) => sum + item.tagCountAuditor, 0)
        } else {
            tagSum = clone.reduce((sum, item) => sum + item.tagCount, 0)
            tagCountSum = clone.reduce((sum, item) => sum + item.tagCountAuditor, 0)
        }
        const FilterProduct = filters.product as string[] | null;
        if (FilterProduct != null) {
            clone = clone.filter(x => FilterProduct.includes(x.product))
            tagSum = clone.reduce((sum, item) => sum + item.tagCount, 0)
            tagCountSum = clone.reduce((sum, item) => sum + item.tagCountAuditor, 0)
        } else {
            tagSum = clone.reduce((sum, item) => sum + item.tagCount, 0)
            tagCountSum = clone.reduce((sum, item) => sum + item.tagCountAuditor, 0)
        }


        setSummary({ tag: tagSum, tagCount: tagCountSum })
    };

    return (
        <>
            <Navbar />
            <div>
                <head className="flex flex-col px-16 py-8">
                    <div className="flex flex-row justify-center items-cente">
                        <p className="w-full mr-4 py-8 border border-gray-500 rounded-2xl bg-[#D4EBF8] text-3xl text-black font-bold text-center">
                            รายการนับวัตถุดิบของแต่ละสายการผลิต โดย Auditor
                        </p>
                    </div>
                </head>
                <body className="flex w-full p-4 justify-center">
                    {
                        loading ? <div className="flex justify-center items-center"><CircularProgress /></div> :
                            <div className='w-[100%] px-[5%]'>
                                <Table
                                    style={{ width: "100%" }}
                                    className="border"
                                    dataSource={tagCheck.filter(row => !row.wcnO_NAME.includes('MAIN ASSEMBLY AND FINAL'))}
                                    columns={columns}
                                    onChange={onChange}
                                    summary={() => {
                                        return <Table.Summary.Row className="font-bold bg-yellow-50">
                                            <Table.Summary.Cell colSpan={4} index={0} className="text-right">
                                                Total
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={0} className="text-right">
                                                {summary.tag.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={0} className="text-right">
                                                {summary.tagCount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={0} className="text-right">
                                                {(summary.tag - summary.tagCount)?.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell colSpan={2} index={2}>

                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    }}
                                />
                            </div>
                    }

                </body>
                <DetailSumAuditor open={isModalPart} close={setIsModalPart} tagData={TagData} />
            </div>



        </>



    )
}

export default FinalSumAiditor


