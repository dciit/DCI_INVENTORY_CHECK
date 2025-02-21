// import { base } from "@/constants";
// import { Wcno } from "@/interface/compressorcheck";
// import { DataTag } from "@/interface/gentag.interface";
import { ReduxInterface } from "@/interface/main.interface";
import { CompareSum, SummatyTagCheckADTE } from "@/interface/summarypart.interface";
import { API_SUMMARY_COMPARE, API_TEG_SUMCHECK_ADTE } from "@/service/conclusion.service";
import { API_TEG_SELECT } from "@/service/gentag.service";
// import { API_SELECT_WCNO } from "@/service/partlist.service";
import { RefSelectProps, Table } from "antd";
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CompareSummary() {

    const oAccount: ReduxInterface = useSelector((state: any) => state.reducer)

    const [stagCompare, setTagCompare] = useState<CompareSum[]>([])
    const [stagCheck, setTagCheck] = useState<SummatyTagCheckADTE[]>([])
    const [wcno, setWcno] = useState<string[]>([]);

    // const [searchData, setSearchData] = useState<DataTag>({
    //     paramWCNO: '',
    // });

    // const refWCNO = useRef<RefSelectProps>(null)

    const navigate = useNavigate();
    const oLineTyps = ['MAIN', 'FINAL'];


    const fetchCheckTag = async () => {
        try {
            const checktag = await API_TEG_SUMCHECK_ADTE(
                oAccount.authen.mSetInfo?.setCode!,
                oAccount.authen.sName!,
                oAccount.authen.mSetInfo?.ym!
            );

            if (checktag && Array.isArray(checktag)) {
                setTagCheck(checktag);

                const uniqueWcno = Array.from(new Set(checktag.map((item) => item.wcno)));
                setWcno(uniqueWcno);
                console.log("WCNO List:", uniqueWcno);
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

            setTagCompare(compareResults.flat());
        } catch (error) {
            console.error("Error fetching compare sum:", error);
        }
    };

    const handleRowClick = async (wcno: string) => {
        try {
            console.log("Row clicked with wcno:", wcno);

            const response = await API_TEG_SELECT(
                oAccount.authen.mSetInfo?.setCode!,
                oAccount.authen.mSetInfo?.ym!,
                wcno
            );

            const test = await API_SUMMARY_COMPARE(
                oAccount.authen.mSetInfo?.setCode!,
                oAccount.authen.mSetInfo?.ym!,
                wcno
            );

            const ressumcompare = await API_SUMMARY_COMPARE(
                oAccount.authen.mSetInfo?.setCode!,
                oAccount.authen.mSetInfo?.ym!,
                wcno
            );

            console.log("API Response:", response);
            console.log("test", test)
            console.log("API ResSumCompare:", ressumcompare);

            if (Array.isArray(response) && Array.isArray(ressumcompare)) {
                const filteredTagData = response.map(({ wcno, tagNo, partNo, cm, partName, auditeeStatus }) => ({
                    wcno, tagNo, partNo, cm, partName, auditeeStatus
                }));

                const filteredSumData = ressumcompare.map(({ wcno, bookQty, bookAmt, auditeeQty, auditeeAmt, auditeeDiffQty, auditeeDiffAmt }) => ({
                    wcno, bookQty, bookAmt, auditeeQty, auditeeAmt, auditeeDiffQty, auditeeDiffAmt
                }));

                navigate("/detailcomparesum", { state: { tagData: filteredTagData, sumData: filteredSumData } });
            } else {
                console.error("Error: Expected arrays but received", response, ressumcompare);
            }
        } catch (error) {
            console.error("Error fetching row data:", error);
        }
    };


    useEffect(() => {
        fetchCheckTag();
    }, []);


    useEffect(() => {
        if (wcno.length > 0) {
            fetchComparesum(wcno);
        }
    }, [wcno]);


    const columns = [
        {
            title: "Factory",
            dataIndex: "factory",
            key: "factory",
            align: 'center' as 'center'
        },
        {
            title: "Product",
            dataIndex: "product",
            key: "product",
            align: 'center' as 'center'
        },
        {
            title: "WC",
            dataIndex: "wcno",
            key: "wcno",
            align: 'center' as 'center',
        },
        {
            title: "Line Name",
            dataIndex: "wcnO_NAME",
            key: "wcnO_NAME",
            align: 'center' as 'center',
            render: (_text: any, row: { wcno: string; lineType: string; wcnO_NAME: string; }) => {
                if (row.wcno.startsWith('90')) {
                    return (
                        <>
                            {row.lineType === "MAIN" ? (
                                <span>
                                    MAIN ASSEMBLY LINE {row.wcno.substring(2, 3)}
                                </span>
                            ) : (
                                <span>
                                    FINAL LINE LINE {row.wcno.substring(2, 3)}
                                </span>
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
            render: (_text: any, row: { tagCountMain: number; tagCountMainAuditee: number; tagCountFinal: number; tagCountFinalAuditee: number; lineType: string }) => {
                return (
                    <>
                        {
                            row.lineType === "MAIN" ? (
                                <span>
                                    {row.tagCountMain > 0
                                        ? ((row.tagCountMainAuditee / row.tagCountMain) * 100).toFixed(1) + "%"
                                        : "0%"}
                                </span>
                            ) : (
                                <span>
                                    {row.tagCountFinal > 0
                                        ? ((row.tagCountFinalAuditee / row.tagCountFinal) * 100).toFixed(1) + "%"
                                        : "0%"}
                                </span>
                            )
                        }
                    </>
                );
            }
        },

        {
            title: "Book",
            key: "totalBookQty",
            align: 'center' as 'center',
            render: (_text: any, row: { wcno: string; }) => {
                const compareRows = stagCompare.filter((compare) => compare.wcno === row.wcno);
                const totalBookQty = compareRows.reduce((sum, item) => sum + (item.bookQty || 0), 0).toFixed(2);
                return <span>{totalBookQty}</span>;
            },
        },
        {
            title: "Amount",
            key: "totalBookAmt",
            align: 'center' as 'center',
            render: (_text: any, row: { wcno: string; }) => {
                const compareRows = stagCompare.filter((compare) => compare.wcno === row.wcno);
                const totalBookAmt = compareRows.reduce((sum, item) => sum + (item.bookAmt || 0), 0).toFixed(2);
                return <span>{totalBookAmt}</span>;
            },
        },
        {
            title: "Aditee Qty",
            key: "totalAuditeeQty",
            align: 'center' as 'center',
            render: (_text: any, row: { wcno: string; }) => {
                const compareRows = stagCompare.filter((compare) => compare.wcno === row.wcno);
                const totalAuditeeQty = compareRows.reduce((sum, item) => sum + (item.auditeeQty || 0), 0).toFixed(2);
                return <span>{totalAuditeeQty}</span>;
            },
        },
        {
            title: "Auditee Amount",
            key: "totalAuditeeAmt",
            align: 'center' as 'center',
            render: (_text: any, row: { wcno: string; }) => {
                const compareRows = stagCompare.filter((compare) => compare.wcno === row.wcno);
                const totalAuditeeAmt = compareRows.reduce((sum, item) => sum + (item.auditeeAmt || 0), 0).toFixed(2);
                return <span>{totalAuditeeAmt}</span>;
            },
        },
        {
            title: "Aditee Diff Qty",
            key: "totalAuditeeDiffQty",
            align: 'center' as 'center',
            render: (_text: any, row: { wcno: string; }) => {
                const compareRows = stagCompare.filter((compare) => compare.wcno === row.wcno);
                const totalAuditeeDiffQty = compareRows.reduce((sum, item) => sum + (item.auditeeDiffQty || 0), 0).toFixed(2);
                return <span>{totalAuditeeDiffQty}</span>;
            },
        },
        {
            title: "Aditee Diff Amount",
            key: "totalAuditeeDiffAmt",
            align: 'center' as 'center',
            render: (_text: any, row: { wcno: string; }) => {
                const compareRows = stagCompare.filter((compare) => compare.wcno === row.wcno);
                const totalAuditeeDiffAmt = compareRows.reduce((sum, item) => sum + (item.auditeeDiffAmt || 0), 0).toFixed(2);
                return <span>{totalAuditeeDiffAmt}</span>;
            },
        },
    ];

    const filteredStagCheck = stagCheck
        .filter((row) => row.factory && (row.factory.startsWith('FAC') || row.factory.startsWith('ODM')) && !row.wcno.startsWith('90'))
        // .filter((row) => !searchData.paramWCNO || row.wcno === searchData.paramWCNO);

    const expandedRows = stagCheck
        .filter((row) => row.factory && (row.factory.startsWith('FAC') || row.factory.startsWith('ODM')) && row.wcno.startsWith('90'))
        // .filter((row) => !searchData.paramWCNO || row.wcno === searchData.paramWCNO)
        .map((row) =>
            oLineTyps.map((ln) => ({
                ...row,
                lineType: ln,
            }))
        )
        .flat();

    const data = [...filteredStagCheck, ...expandedRows];

    return (
        <head className="flex flex-col px-8 py-8">
            <div className="flex flex-row justify-center items-cente">
                <p className="w-full mr-4 py-8 border border-gray-500 rounded-2xl bg-[#A6F1E0] text-3xl text-black font-bold text-center">
                    รายการนับวัตถุดิบของแต่ละสายการผลิต
                    <hr className="mx-28 mt-2  border-black" />
                    <p className=" mt-2 text-2xl font-light">(Auditee)</p>
                </p>
            </div>
            <div className="mt-7 flex justify-start gap-2">
                <span className="p-2.5 bg-[#607EAA] border border-black rounded-md text-lg text-white font-semibold text-center">WC</span>

            </div>
            <body className="flex flex-col w-full p-4 justify-center">
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey={(record) => record.key || record.wcno}
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record.wcno),
                    })}
                    pagination={false}
                    bordered
                />
            </body>
        </head>


    )
}

export default CompareSummary




