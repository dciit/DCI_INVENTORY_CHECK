// import { base } from "@/constants";
// import { Wcno } from "@/interface/compressorcheck";
// import { DataTag } from "@/interface/gentag.interface";
import Navbar from "@/components/main/navbar";
import { ReduxInterface } from "@/interface/main.interface";
import { CompareSum, SummatyTagCheckADTE } from "@/interface/summarypart.interface";
import { API_SUMMARY_COMPARE, API_TEG_SUMCHECK_ADTE } from "@/service/conclusion.service";
// import { API_TEG_SELECT } from "@/service/tag.service";
// import { API_SELECT_WCNO } from "@/service/partlist.service";
// import { Footer } from "antd/es/layout/layout";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import ViewCompareSum from "./compare.data";
import { CircularProgress } from "@mui/material";
function CompareSummary() {

    const [Datas, setDatas] = useState<any[]>([])
    const oAccount: ReduxInterface = useSelector((state: any) => state.reducer)
    const [tagCompare, setTagCompare] = useState<CompareSum[]>([])
    const [stagCheck, setTagCheck] = useState<SummatyTagCheckADTE[]>([])
    const [wcno, setWcno] = useState<string[]>([]);
    // const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    const oLineTyps = ['MAIN', 'FINAL', 'EXPLODE'];


    const fetchCheckTag = async () => {
        try {
            const checktag = await API_TEG_SUMCHECK_ADTE(
                oAccount.authen.mSetInfo?.setCode!,
                oAccount.authen.sName!,
                oAccount.authen.mSetInfo?.ym!
            );
            // console.log('all')
            // console.log(checktag)
            if (checktag && Array.isArray(checktag)) {
                setTagCheck(checktag);
                const uniqueFactories = Array.from(new Set(checktag.map((item) => item.wcno)));
                setWcno(uniqueFactories);
            } else {
                console.error("Invalid data format:", checktag);
            }
        } catch (error) {
            console.error("Error fetching check tag:", error);
        }
    };

    const fetchComparesum = async (wcno: string[]) => {
        try {
            if (!wcno || wcno.length === 0) return;

            const compareResults = await Promise.all(
                wcno.map(async (wcno) => {
                    try {
                        const result = await API_SUMMARY_COMPARE(
                            oAccount.authen.mSetInfo?.setCode!,
                            oAccount.authen.mSetInfo?.ym!,
                            wcno
                        );

                        return result && Array.isArray(result) ? result : [];
                    } catch (error) {
                        console.error(`Error fetching compare sum for wcno ${wcno}:`, error);
                        return [];
                    }
                })
            );
            // console.log('item')
            // console.log(compareResults.flat())
            setTagCompare(compareResults.flat());
        } catch (error) {
            console.error("Error fetching compare sum:", error);
        }
    };

    // const handleRowClick = async (wcno: string) => {
    //     try {
    //         // console.log("Row clicked with wcno:", wcno);

    //         const response = await API_TEG_SELECT(
    //             oAccount.authen.mSetInfo?.setCode!,
    //             oAccount.authen.mSetInfo?.ym!,
    //             wcno
    //         );

    //         const test = await API_SUMMARY_COMPARE(
    //             oAccount.authen.mSetInfo?.setCode!,
    //             oAccount.authen.mSetInfo?.ym!,
    //             wcno
    //         );

    //         const ressumcompare = await API_SUMMARY_COMPARE(
    //             oAccount.authen.mSetInfo?.setCode!,
    //             oAccount.authen.mSetInfo?.ym!,
    //             wcno
    //         );

    //         console.log("API Response:", response);
    //         console.log("test", test)
    //         console.log("API ResSumCompare:", ressumcompare);

    //         if (Array.isArray(response) && Array.isArray(ressumcompare)) {
    //             const filteredTagData = response.map(({ wcno, tagNo, partNo, cm, partName, auditeeStatus }) => ({
    //                 wcno, tagNo, partNo, cm, partName, auditeeStatus
    //             }));

    //             const filteredSumData = ressumcompare.map(({ wcno, bookQty, bookAmt, auditeeQty, auditeeAmt, auditeeDiffQty, auditeeDiffAmt }) => ({
    //                 wcno, bookQty, bookAmt, auditeeQty, auditeeAmt, auditeeDiffQty, auditeeDiffAmt
    //             }));

    //             navigate("/detailcomparesum", { state: { tagData: filteredTagData, sumData: filteredSumData } });
    //         } else {
    //             console.error("Error: Expected arrays but received", response, ressumcompare);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching row data:", error);
    //     }
    // };


    useEffect(() => {
        fetchCheckTag();
    }, []);


    useEffect(() => {
        if (wcno.length > 0) {
            fetchComparesum(wcno);
        }
    }, [wcno]);


    // const columns: TableColumnsType<SummatyTagCheckADTE> = [
    //     {
    //         title: 'Factory',
    //         // <span style={{ backgroundColor: "yellow", display: "block", padding: "15px" }}>Factory</span>
    //         dataIndex: "factory",
    //         align: "center" as "center",
    //         width: 120,
    //         filters: [
    //             { text: "FAC1", value: "FAC1" },
    //             { text: "FAC2", value: "FAC2" },
    //             { text: "FAC3", value: "FAC3" },
    //             { text: "ODM", value: "ODM" },
    //         ],
    //         onFilter: (value, record) => {
    //             return record.factory.indexOf(value as string) == 0
    //         },
    //         sorter: (a, b) => a.factory.length - b.factory.length,
    //         sortDirections: ['descend'],
    //     },
    //     {
    //         title: "Product",
    //         dataIndex: "product",
    //         key: "product",
    //         align: 'center' as 'center',
    //     },
    //     {
    //         title: "WC",
    //         dataIndex: "wcno",
    //         key: "wcno",
    //         align: 'center' as 'center',


    //     },
    //     {
    //         title: "Line Name",
    //         dataIndex: "wcnO_NAME",
    //         key: "wcnO_NAME",
    //         align: 'center' as 'center',
    //         // render: (_text: any, row: { wcno: string; lineType: string; wcnO_NAME: string; } ) => {
    //         //     if (row.wcno.startsWith('90')) {
    //         //         return (
    //         //             <>
    //         //                 {row.lineType === "MAIN" ? (
    //         //                     <span>
    //         //                         MAIN ASSEMBLY LINE {row.wcno.substring(2, 3)}
    //         //                     </span>
    //         //                 ) : (
    //         //                     <span>
    //         //                         FINAL LINE LINE {row.wcno.substring(2, 3)}
    //         //                     </span>
    //         //                 )}
    //         //             </>
    //         //         );
    //         //     } else {
    //         //         return <span>{row.wcnO_NAME}</span>
    //         //     }
    //         // }
    //     },
    //     {
    //         title: "Completed",
    //         key: "completed",
    //         align: 'center' as 'center',
    //         render: (_text: any, row: { tagCountMain: number; tagCountMainAuditee: number; tagCountFinal: number; tagCountFinalAuditee: number; lineType: string }) => {
    //             return (
    //                 <>
    //                     {
    //                         row.lineType === "MAIN" ? (
    //                             <span>
    //                                 {row.tagCountMain > 0
    //                                     ? ((row.tagCountMainAuditee / row.tagCountMain) * 100).toFixed(1) + "%"
    //                                     : "0%"}
    //                             </span>
    //                         ) : (
    //                             <span>
    //                                 {row.tagCountFinal > 0
    //                                     ? ((row.tagCountFinalAuditee / row.tagCountFinal) * 100).toFixed(1) + "%"
    //                                     : "0%"}
    //                             </span>
    //                         )
    //                     }
    //                 </>
    //             );
    //         },
    //     },
    //     {
    //         title: 'BOOK A',
    //         children: [
    //             {
    //                 title: "QTY",
    //                 key: "totalBookQty",
    //                 align: 'center' as 'center',
    //                 render: (_text: any, row: { wcno: string; }) => {
    //                     const compareRows = stagCompare.filter((compare) => compare.wcno === row.wcno);
    //                     const totalBookQty = compareRows.reduce((sum, item) => sum + (item.bookQty || 0), 0).toFixed(2);
    //                     return <span>{totalBookQty}</span>;
    //                 },
    //             },
    //             {
    //                 title: "AMOUNT",
    //                 key: "totalBookAmt",
    //                 align: 'center' as 'center',
    //                 render: (_text: any, row: { wcno: string; }) => {
    //                     const compareRows = stagCompare.filter((compare) => compare.wcno === row.wcno);
    //                     const totalBookAmt = compareRows.reduce((sum, item) => sum + (item.bookAmt || 0), 0).toFixed(2);
    //                     return <span>{totalBookAmt}</span>;
    //                 },
    //             },
    //         ]
    //     },

    //     {
    //         title: 'Auditee Check(B)',
    //         children: [
    //             {
    //                 title: "Aditee Qty",
    //                 key: "totalAuditeeQty",
    //                 align: 'center' as 'center',
    //                 render: (_text: any, row: { wcno: string; }) => {
    //                     const compareRows = stagCompare.filter((compare) => compare.wcno === row.wcno);
    //                     const totalAuditeeQty = compareRows.reduce((sum, item) => sum + (item.auditeeQty || 0), 0).toFixed(2);
    //                     return <span>{totalAuditeeQty}</span>;
    //                 },
    //             },
    //             {
    //                 title: "Auditee Amount",
    //                 key: "totalAuditeeAmt",
    //                 align: 'center' as 'center',
    //                 render: (_text: any, row: { wcno: string; }) => {
    //                     const compareRows = stagCompare.filter((compare) => compare.wcno === row.wcno);
    //                     const totalAuditeeAmt = compareRows.reduce((sum, item) => sum + (item.auditeeAmt || 0), 0).toFixed(2);
    //                     return <span>{totalAuditeeAmt}</span>;
    //                 },
    //             },
    //         ]
    //     },

    //     {
    //         title: 'Diff.(B-A)',
    //         children: [
    //             {
    //                 title: "Aditee Diff Qty",
    //                 key: "totalAuditeeDiffQty",
    //                 align: 'center' as 'center',
    //                 render: (_text: any, row: { wcno: string; }) => {
    //                     const compareRows = stagCompare.filter((compare) => compare.wcno === row.wcno);
    //                     const totalAuditeeDiffQty = compareRows.reduce((sum, item) => sum + (item.auditeeDiffQty || 0), 0).toFixed(2);
    //                     return <span>{totalAuditeeDiffQty}</span>;
    //                 },
    //             },
    //             {
    //                 title: "Aditee Diff Amount",
    //                 key: "totalAuditeeDiffAmt",
    //                 align: 'center' as 'center',
    //                 render: (_text: any, row: { wcno: string; }) => {
    //                     const compareRows = stagCompare.filter((compare) => compare.wcno === row.wcno);
    //                     const totalAuditeeDiffAmt = compareRows.reduce((sum, item) => sum + (item.auditeeDiffAmt || 0), 0).toFixed(2);
    //                     return <span>{totalAuditeeDiffAmt}</span>;
    //                 },
    //             },
    //         ]
    //     },

    // ];
    useEffect(() => {
        if (tagCompare.length) {
            const filteredStagCheck = stagCheck
                .filter((row) => row.factory && (row.factory.startsWith('FAC') || row.factory.startsWith('ODM')) && !row.wcno.startsWith('90'))

            const expandedRows = stagCheck
                .filter((row) => row.factory && (row.factory.startsWith('FAC') || row.factory.startsWith('ODM')) && row.wcno.startsWith('90'))
                .map((row) =>
                    oLineTyps.map((ln) => ({
                        ...row,
                        lineType: ln,
                    }))
                )
                .flat();
            setDatas([...filteredStagCheck, ...expandedRows])
        }
    }, [tagCompare])
    useEffect(() => {
        console.log('eff datas')
        if (Datas.length) {
            console.log('has data')
            setLoading(false);
        }
    }, [Datas])
    return (
        <>.

            <Navbar />
            <head className="flex flex-col px-8 py-8">
                <div className="flex flex-row justify-center items-cente">
                    <p className="w-full mr-4 py-8 border border-gray-500 rounded-2xl bg-[#E1EACD] text-3xl text-black font-bold text-center">
                        รายการนับวัตถุดิบของแต่ละสายการผลิต
                        <hr className="mx-28 mt-2  border-black" />
                        <p className=" mt-2 text-2xl font-light">(Auditee)</p>
                    </p>
                </div>
                <body className="flex w-full p-4 justify-center">
                    {
                        loading == true ? <div className="items-center justify-center mt-3"><CircularProgress /></div> : 
                        (Datas.length && <ViewCompareSum data={Datas} tagCompare={tagCompare} />)
                    }
                </body>
            </head>
        </>



    )
}

export default CompareSummary