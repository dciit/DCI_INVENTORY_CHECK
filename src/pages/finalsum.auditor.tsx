// import { base } from "@/constants";
// import { TagInfo } from "@/interface/gentag.interface";
import { ReduxInterface } from "@/interface/main.interface";
import { FacData, SummatyTagCheckADTE } from "@/interface/summarypart.interface"
import { API_TEG_SUMCHECK_ADTE } from "@/service/conclusion.service";
import { API_TEG_SELECT } from "@/service/gentag.service";
import { RefSelectProps, Select } from "antd";
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function FinalSumAiditor() {

    const oAccount: ReduxInterface = useSelector((state: any) => state.reducer)

    const [stagCheck, setTagCheck] = useState<SummatyTagCheckADTE[]>([])
    const [factory, setFactoryData] = useState<String[]>([]);

    const [searchData, setSearchData] = useState<FacData>({
        factory: ''
    });

    const refFAC = useRef<RefSelectProps>(null)

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

                const uniqueFactories = Array.from(new Set(checktag.map((item) => item.factory)));
                setFactoryData(uniqueFactories);
                console.log(uniqueFactories);
            } else {
                console.error("Invalid data format:", checktag);
            }
        } catch (error) {
            console.error("Error fetching check tag:", error);
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

            console.log("API Response:", response);

            if (Array.isArray(response)) {
                console.log("Received array response:", response);
                navigate("/adtedetailsum", { state: { tagData: response } });
            } else {
                console.error("Error: Expected array but received", response);
                console.error("Error fetching row data:", response?.message || "Unknown error");
            }
        } catch (error) {
            console.error("Error fetching row data:", error);
        }
    };



    useEffect(() => {
        fetchCheckTag();
    }, []);



    return (
        <head className="flex flex-col px-8 py-8">
            <div className="flex flex-row justify-center items-cente">
                <p className="w-full mr-4 py-8 border border-gray-500 rounded-2xl bg-[#E1EACD] text-3xl text-black font-bold text-center">
                    รายการนับวัตถุดิบของแต่ละสายการผลิต
                    <hr className="mx-28 mt-2  border-black" />
                    <p className=" mt-2 text-2xl font-light">(Auditor)</p>
                </p>
            </div>
            <div className="mt-7 flex justify-start gap-2">
                <span className="p-2.5 bg-[#607EAA] border border-black rounded-md text-lg text-white font-semibold text-center">Factory</span>
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
            <body className="flex w-full p-4 justify-center mt-3">
                <div className="max-h-[600px]">
                    <table className="border-separate border-spacing-0 border border-gray-400 w-full table-fixed">
                        <thead>
                            <tr className="bg-[#F9F5EB]">
                                <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2" rowSpan={2}>Factory</th>
                                <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2" rowSpan={2}>Procuct</th>
                                <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2" rowSpan={2}>WC</th>
                                <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2" rowSpan={2}>Line Name</th>
                                <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2" rowSpan={2}>Tag Count</th>
                                <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2" colSpan={2}>Auditor Check</th>
                                <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2" rowSpan={2}>Completed</th>
                            </tr>
                            <tr className="bg-[#F9F5EB]">
                                <th className="border border-gray-600 sticky top-10 bg-[#F9F5EB] z-[10] px-4 py-2">จำนวนที่นับได้</th>
                                <th className="border border-gray-600 sticky top-10 bg-[#F9F5EB] z-[10] px-4 py-2">จำนวนคงเหลือ</th>
                            </tr>
                        </thead>

                        <tbody>
                            {stagCheck
                                .filter((row) => row.factory && (row.factory.startsWith("FAC") || row.factory.startsWith("ODM")) && !row.wcno.startsWith("90"))
                                .filter((row) => !searchData.factory || row.factory === searchData.factory)
                                .map((row, rowIndex) => (
                                    <tr key={rowIndex} onClick={() => handleRowClick(row.wcno)} style={{ cursor: "pointer" }}
                                        className="dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <td className="border border-gray-600 px-4 py-2 text-center">{row.factory}</td>
                                        <td className="border border-gray-600 px-4 py-2 text-center">{row.product}</td>
                                        <td className="border border-gray-600 px-4 py-2 text-left">{row.wcno}</td>
                                        <td className="border border-gray-600 px-4 py-2 text-left">{row.wcnO_NAME}</td>
                                        <td className="border border-gray-600 px-4 py-2 text-right">{row.tagCount}</td>
                                        <td className={`border border-gray-600 px-4 py-2 text-right 
                                        ${row.tagCountAuditor === 0 ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
                                            {row.tagCountAuditor === 0 ? row.tagCountAuditor : "เช็คแล้ว"}
                                        </td>

                                        <td className={`border border-gray-600 px-4 py-2 text-right 
                                        ${row.tagCount - row.tagCountAuditor !== 0 ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
                                            {row.tagCount - row.tagCountAuditor !== 0 ? row.tagCount - row.tagCountAuditor : row.tagCount - row.tagCountAuditor}
                                        </td>
                                        <td className="border border-gray-600 px-4 py-2 text-right">
                                            {row.tagCount > 0 ? ((row.tagCountAuditor / row.tagCount) * 100).toFixed(1) + "%" : "0%"}
                                        </td>
                                    </tr>
                                ))}

                            {stagCheck
                                .filter((row) => row.factory && (row.factory.startsWith("FAC") || row.factory.startsWith("ODM")) && row.wcno.startsWith("90"))
                                .filter((row) => !searchData.factory || row.factory === searchData.factory)
                                .map((row, rowIndex) => (
                                    oLineTyps.map((ln) => (

                                        <tr key={rowIndex} onClick={() => handleRowClick(row.wcno)} style={{ cursor: "pointer" }}
                                            className="dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                                            <td className="border border-gray-600 px-4 py-2 text-center">{row.factory}</td>
                                            <td className="border border-gray-600 px-4 py-2 text-center">{row.product}</td>
                                            <td className="border border-gray-600 px-4 py-2 text-center">{row.wcno}</td>
                                            {
                                                (ln == "MAIN") ?
                                                    (<td className="border border-gray-600 px-4 py-2 text-leff whitespace-nowrap">
                                                        MAIN ASSEMBLY LINE {row.wcno.substring(2, 3)}
                                                    </td>) :
                                                    (<td className="border border-gray-600 px-4 py-2 text-left whitespace-nowrap">
                                                        FINAL LINE LINE {row.wcno.substring(2, 3)}
                                                    </td>)
                                            }
                                            {
                                                (ln == "MAIN") ?
                                                    (<td className="border border-gray-600 px-4 py-2 text-right">
                                                        {row.tagCountMain}
                                                    </td>) :
                                                    (<td className="border border-gray-600 px-4 py-2 text-right">
                                                        {row.tagCountFinal}
                                                    </td>)
                                            }
                                            {
                                                (ln == "MAIN") ?
                                                    (<td className={`border border-gray-600 px-4 py-2 text-right 
                                                    ${row.tagCountMainAuditor === 0 ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
                                                        {row.tagCountMainAuditor === 0 ? row.tagCountMainAuditor : "เช็คแล้ว"}
                                                    </td>) :
                                                    (<td className={`border border-gray-600 px-4 py-2 text-right 
                                                    ${row.tagCountFinalAuditor === 0 ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
                                                        {row.tagCountFinalAuditor === 0 ? row.tagCountFinalAuditor : "เช็คแล้ว"}
                                                    </td>)
                                            }

                                            {
                                                (ln == "MAIN") ?
                                                    (<td className={`border border-gray-600 px-4 py-2 text-right 
                                                    ${row.tagCountMain - row.tagCountMainAuditor !== 0 ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
                                                        {row.tagCountMain - row.tagCountMainAuditor !== 0 ? row.tagCountMain - row.tagCountAuditor : row.tagCountMain - row.tagCountAuditor}
                                                    </td>) :
                                                    (<td className={`border border-gray-600 px-4 py-2 text-right 
                                                    ${row.tagCountFinal - row.tagCountFinalAuditor !== 0 ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
                                                        {row.tagCountFinal - row.tagCountFinalAuditor !== 0 ? row.tagCountFinal - row.tagCountFinalAuditor : row.tagCountFinal - row.tagCountFinalAuditor}
                                                    </td>)
                                            }
                                            {
                                                (ln == "MAIN") ?
                                                    (<td className="border border-gray-600 px-4 py-2 text-right">
                                                        {row.tagCountMain > 0 ? ((row.tagCountMainAuditor / row.tagCountMain) * 100).toFixed(1) + "%" : "0%"}
                                                    </td>) :
                                                    (<td className="border border-gray-600 px-4 py-2 text-right">
                                                        {row.tagCountFinal > 0 ? ((row.tagCountFinalAuditor / row.tagCountFinal) * 100).toFixed(1) + "%" : "0%"}
                                                    </td>)
                                            }
                                        </tr>
                                    ))
                                ))}


                        </tbody>
                    </table>
                </div>

            </body>
        </head>


    )
}

export default FinalSumAiditor


