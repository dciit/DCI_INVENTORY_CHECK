// import { base } from "@/constants";
// import { TagInfo } from "@/interface/gentag.interface";
import Navbar from "@/components/main/navbar";
import { ReduxInterface } from "@/interface/main.interface";
import { DataType, FacData, SummatyTagCheckADTE } from "@/interface/summarypart.interface"
import { API_TEG_SUMCHECK_ADTE } from "@/service/conclusion.service";
import { API_TEG_SELECT } from "@/service/tag.service";
import { Button, RefSelectProps, Select, Table } from "antd";
import { useEffect, useRef, useState } from "react"
import { TbReportSearch } from "react-icons/tb";
import { useSelector } from "react-redux";
import DetailSumAuditee from "./detailsum.auditee";
import { CircularProgress } from "@mui/material";
interface PropSummary {
    tag: number;
    tagCount: number;
}

function FinalSumAuditee() {
    const [summary, setSummary] = useState<PropSummary>({
        tag: 0, tagCount: 9999
    })
    const oAccount: ReduxInterface = useSelector((state: any) => state.reducer)

    const [tagCheck, setTagCheck] = useState<SummatyTagCheckADTE[]>([])
    const [factory, setFactoryData] = useState<String[]>([]);

    const [searchData, setSearchData] = useState<FacData>({
        factory: ''
    });

    const refFAC = useRef<RefSelectProps>(null)
    const oLineTyps = ['MAIN', 'FINAL', 'EXPLODE'];

    const [isModalPart, setIsModalPart] = useState<boolean>(false);
    const [TagData, setTagData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    let once: boolean = true;
    const fetchCheckTag = async () => {
        try {
            let checktag = await API_TEG_SUMCHECK_ADTE(
                oAccount.authen.mSetInfo?.setCode!,
                oAccount.authen.sName!,
                oAccount.authen.mSetInfo?.ym!
            );
            let clone: DataType[] = checktag.filter((row: DataType) => row.factory && (row.factory.startsWith("FAC") || row.factory.startsWith("ODM")) && row.wcno.toString().startsWith("90"))
            clone.map((row: DataType) => {
                oLineTyps.map((oLine: string) => {
                    let rename: string = '';
                    let tagCount: number = 0;
                    let tagCountAuditee: number = 0;
                    if (oLine == 'MAIN') {
                        rename = `MAIN ASSEMBLY LINE ${row.wcno.toString().substring(2, 3)}`
                        tagCount = row.tagCountMain;
                        tagCountAuditee = row.tagCountMainAuditee;
                    } else if (oLine == 'FINAL') {
                        rename = `FINAL LINE ${row.wcno.toString().substring(2, 3)}`
                        tagCount = row.tagCountFinal;
                        tagCountAuditee = row.tagCountFinalAuditee;
                    } else {
                        rename = `แตก Part LINE ${row.wcno.toString().substring(2, 3)}`;
                        tagCount = row.tagCountExplode;
                        tagCountAuditee = row.tagCountExplodeAuditee;
                    }
                    checktag.push({ factory: row.factory, product: row.product, wcno: row.wcno, wcnO_NAME: rename, tagCount: tagCount, tagCountAuditee: tagCountAuditee })
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
    };
    useEffect(() => {
        let tagSum: number = tagCheck.reduce((sum, item) => sum + item.tagCount, 0)
        let tagCountSum: number = tagCheck.reduce((sum, item) => sum + item.tagCountAuditee, 0)
        setSummary({ tag: tagSum, tagCount: tagCountSum })
    }, [tagCheck])
    useEffect(() => {
        if (once) {
            setLoading(false);
            once = !once;
        }
    }, [factory])

    const handleModalPart = async (data: SummatyTagCheckADTE) => {
        setTagData([]);
        setIsModalPart(true);
        const resTagData = await API_TEG_SELECT(
            oAccount.authen.mSetInfo?.setCode!,
            oAccount.authen.mSetInfo?.ym!,
            data.wcno
        );
        setTagData(resTagData);
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
            title: 'Factory',
            dataIndex: 'factory',
            key: 'factory',

        },
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
            sorter: (a: any, b: any) => a.product.length - b.product.length,
        },
        {
            title: 'WC',
            dataIndex: 'wcno',
            key: 'wcno',
            filters: CreateFilterChoice(tagCheck, 'wcno'),
            onFilter: (value: any, record: any) => record.wcno.indexOf(value as string) === 0,
        },
        {
            title: 'LineName',
            dataIndex: 'wcnO_NAME',
            key: 'wcnO_NAME',
        },
        {
            title: 'Auditee Check',
            children: [
                {
                    title: "จำนวนที่ปริ๊นท์ ",
                    dataIndex: 'tagCount',
                    key: "tagCount",
                    align: 'right' as 'right',
                    sorter: (a: any, b: any) => a.tagCount - b.tagCount,
                    render: (_text: any, row: { tagCount: number, tagCountAuditee: number }) => {
                        return <span className={`font-semibold text-sky-600 `}>{row.tagCount}</span>;
                    },
                },
                {
                    title: "จำนวนที่นับได้  ",
                    dataIndex: 'tagCountAuditee',
                    key: "tagCountAuditee",
                    align: 'right' as 'right',
                    filters: [
                        { text: 'ครบแล้ว', value: 'COMPLETED' },
                        { text: 'ยังไม่ครบ', value: 'NOT-COMPLETED' },
                    ],
                    onFilter: (value: any, record: any) => value == 'COMPLETED' ? record.tagCountAuditee == record.tagCount : record.tagCountAuditee != record.tagCount,
                    render: (_text: any, row: { tagCount: number, tagCountAuditee: number }) => {
                        return <span className={`font-semibold ${row.tagCountAuditee < row.tagCount ? 'text-red-500' : (row.tagCountAuditee == row.tagCount ? 'text-green-500' : '')}`}>{row.tagCountAuditee}</span>;
                    },
                },
                {
                    title: "จำนวนคงเหลือ",
                    dataIndex: 'tagCount',
                    key: "tagCount",
                    align: 'right' as 'right',
                    sorter: (a: any, b: any) => (a.tagCount - a.tagCountAuditee) - (b.tagCount - b.tagCountAuditee),
                    render: (_text: any, row: { tagCount: number, tagCountAuditee: number }) => {
                        return <span className={`font-semibold ${row.tagCountAuditee < row.tagCount ? 'text-red-500' : (row.tagCountAuditee == row.tagCount ? 'text-green-500' : '')}`}>{row.tagCount - row.tagCountAuditee}</span>;
                    },
                }
            ]
        },
        {
            title: 'Completed',
            align: 'right' as 'right',
            render: (_text: any, row: SummatyTagCheckADTE) => {
                return <div className='flex items-center justify-between text-right'>
                    <span className={`font-semibold text-right ${row.tagCountAuditee < row.tagCount ? 'text-red-500' : (row.tagCountAuditee == row.tagCount ? 'text-green-500' : '')}`}>{row.tagCount > 0 ? ((row.tagCountAuditee / row.tagCount) * 100).toFixed(1) + "%" : "0%"}</span>
                    <Button type="primary" size="small" icon={<TbReportSearch />} onClick={() => handleModalPart(row)} >
                        แสดงรายการ</Button>
                </div>;
            },
        },
    ];

    // const sumTagQty = checktag.reduce((sum: any, item: any) => sum + (item.tagCount || 0), 0);
    // const sumTagCountAdt = checktag.reduce((sum: any, item: any) => sum + (item.tagCountAuditee || 0), 0);
    // const sumTagCountAdtrm = checktag.reduce((sum: any, item: any) =>
    //     sum + ((item.tagCount || 0) - (item.tagCountAuditee || 0)), 0
    // );



    return (
        <>
            <Navbar />
            <head className="flex flex-col px-8 py-8">
                <div className="flex flex-row justify-center items-cente">
                    <p className="w-full mr-4 py-8 border border-gray-500 rounded-2xl bg-[#E1EACD] text-3xl text-black font-bold text-center">
                        รายการนับวัตถุดิบของแต่ละสายการผลิต โดย Auditee
                        <p className=" mt-2 text-2xl font-light"></p>
                    </p>
                </div>
                <div className="mt-7 flex justify-start gap-2 ml-4">
                    <span className="p-2.5 bg-[#003092] border border-black rounded-md text-lg text-white font-semibold text-center">Factory</span>
                    <Select
                        ref={refFAC}
                        showSearch
                        placeholder="Select a factory"
                        optionFilterProp="label"
                        className="w-52 h-14 border rounded-lg text-black"
                        value={searchData.factory}
                        onChange={(value) => setSearchData({ ...searchData, factory: value })}
                        options={factory.map((fac) => ({ value: fac, label: fac }))}
                    />
                </div>
            </head>
            <body className="flex w-full p-4 justify-center">

                {
                    loading ? <div><CircularProgress /></div> : <div className='w-[100%] px-[5%]'>
                        <Table
                            style={{ width: "100%" }}
                            className="border"
                            dataSource={tagCheck.filter(row => !row.wcnO_NAME.includes('MAIN ASSEMBLY AND FINAL'))}
                            columns={columns}
                            summary={() => {
                                return <Table.Summary.Row className="font-bold">
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
                                        {/* {sumTagCountAdtrm.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} */}
                                    </Table.Summary.Cell>

                                </Table.Summary.Row>
                            }}
                        />
                    </div>
                }

            </body>
            <DetailSumAuditee open={isModalPart} close={setIsModalPart} tagData={TagData} />
        </>



    )
}

export default FinalSumAuditee