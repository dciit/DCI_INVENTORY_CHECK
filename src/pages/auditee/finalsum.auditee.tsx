// import { base } from "@/constants";
// import { TagInfo } from "@/interface/gentag.interface";
import Navbar from "@/components/main/navbar";
import { ReduxInterface } from "@/interface/main.interface";
import { FacData, SummatyTagCheckADTE } from "@/interface/summarypart.interface"
import { API_TEG_SUMCHECK_ADTE } from "@/service/conclusion.service";
import { API_TEG_SELECT } from "@/service/tag.service";
import { Button, RefSelectProps, Select } from "antd";
import { useEffect, useRef, useState } from "react"
import { TbReportSearch } from "react-icons/tb";
import { useSelector } from "react-redux";
import DetailSumAuditee from "./detailsum.auditee";

function FinalSumAuditee() {

    const oAccount: ReduxInterface = useSelector((state: any) => state.reducer)

    const [stagCheck, setTagCheck] = useState<SummatyTagCheckADTE[]>([])
    const [factory, setFactoryData] = useState<String[]>([]);

    const [searchData, setSearchData] = useState<FacData>({
        factory: ''
    });

    const refFAC = useRef<RefSelectProps>(null)
    const oLineTyps = ['MAIN', 'FINAL', 'EXPLODE'];

    const [isModalPart, setIsModalPart] = useState<boolean>(false);
    const [TagData, setTagData] = useState<any[]>([]);


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
                // console.log(uniqueFactories);

            } else {
                // console.error("Invalid data format:", checktag);
            }
        } catch (error) {
            // console.error("Error fetching check tag:", error);
        }
    };


    const handleModalPart = async (data: SummatyTagCheckADTE) => {
        setTagData([]);
        const resTagData = await API_TEG_SELECT(
            oAccount.authen.mSetInfo?.setCode!,
            oAccount.authen.mSetInfo?.ym!,
            data.wcno
        );
        setTagData(resTagData);
        setIsModalPart(true);
    }



    useEffect(() => {
        fetchCheckTag();
    }, []);



    return (
        <>
            <Navbar />
            <head className="flex flex-col px-8 py-8">
                <div className="flex flex-row justify-center items-cente">
                    <p className="w-full mr-4 py-8 border border-gray-500 rounded-2xl bg-[#E1EACD] text-3xl text-black font-bold text-center">
                        รายการนับวัตถุดิบของแต่ละสายการผลิต โดย Auditee
                        <hr className="mx-28 mt-2  border-black" />
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
            <body className="flex w-full p-4 justify-center mt-3">
                <div className="overflow-x-auto max-h-[600px]">
                    <table className="border-separate border-spacing-0 border border-gray-400 w-full table-fixed">
                        <thead>
                            <tr className="bg-[#F9F5EB]">
                                <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2 w-32" rowSpan={2}>Factory</th>
                                <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2 w-32" rowSpan={2}>Procuct</th>
                                <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2 w-28" rowSpan={2}>WC</th>
                                <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2 w-80" rowSpan={2}>Line Name</th>
                                <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2" colSpan={3}>Auditee Check</th>
                                <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2" rowSpan={2}>Completed</th>
                            </tr>
                            <tr className="bg-[#F9F5EB]">
                                <th className="border border-gray-600 sticky top-[42px] bg-[#F9F5EB] z-[10] px-4 py-2">จำนวนที่ปริ๊นท์</th>
                                <th className="border border-gray-600 sticky top-[42px] bg-[#F9F5EB] z-[10] px-4 py-2">จำนวนที่นับได้</th>
                                <th className="border border-gray-600 sticky top-[42px] bg-[#F9F5EB] z-[10] px-4 py-2">จำนวนคงเหลือ</th>
                            </tr>
                        </thead>

                        <tbody>
                            {stagCheck
                                .filter((row) => row.factory && (row.factory.startsWith("FAC") || row.factory.startsWith("ODM")) && !row.wcno.startsWith("90"))
                                .filter((row) => !searchData.factory || row.factory === searchData.factory)
                                .map((row, rowIndex) => (
                                    <tr key={rowIndex} style={{ cursor: "pointer" }}
                                        className="dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <td className="border border-gray-600 px-4 py-2 text-center">{row.factory}</td>
                                        <td className="border border-gray-600 px-4 py-2 text-center">{row.product}</td>
                                        <td className="border border-gray-600 px-4 py-2 text-center">{row.wcno}</td>
                                        <td className="border border-gray-600 px-4 py-2 text-left">{row.wcnO_NAME}</td>
                                        <td className="border border-gray-600 px-4 py-2 text-right">{row.tagCount}</td>
                                        <td className={`border border-gray-600 px-4 py-2 text-right 
                                        ${row.tagCount === row.tagCountAuditee ? "text-green-600 " : " text-red-500 "}`}>
                                            {row.tagCountAuditee}
                                        </td>

                                        <td className={`border border-gray-600 px-4 py-2 text-right 
                                        ${row.tagCount === row.tagCountAuditee ? "text-green-600 " : " text-red-500 "}`}>
                                            {row.tagCount - row.tagCountAuditee}
                                        </td>
                                        <td className={`border border-gray-600 px-4 py-2 text-right ${row.tagCount === row.tagCountAuditee ? "text-green-600 " : " text-red-500 "}`}>
                                            {row.tagCount > 0 ? ((row.tagCountAuditee / row.tagCount) * 100).toFixed(1) + "%" : "0%"}
                                            <Button type="primary" className="mr-5" size="small" icon={<TbReportSearch />} onClick={() => handleModalPart(row)} >
                                                แสดงรายการ</Button>
                                        </td>
                                    </tr>
                                ))}

                            {stagCheck
                                .filter((row) => row.factory && (row.factory.startsWith("FAC") || row.factory.startsWith("ODM")) && row.wcno.startsWith("90"))
                                .filter((row) => !searchData.factory || row.factory === searchData.factory)
                                .map((row, rowIndex) => (
                                    oLineTyps.map((ln) => (

                                        <tr key={rowIndex} style={{ cursor: "pointer" }}
                                            className="dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                                            <td className="border border-gray-600 px-4 py-2 text-center">{row.factory}</td>
                                            <td className="border border-gray-600 px-4 py-2 text-center">{row.product}</td>
                                            <td className="border border-gray-600 px-4 py-2 text-center">{row.wcno}</td>
                                            {
                                                (ln == "MAIN") ?

                                                    (<>
                                                        <td className="border border-gray-600 px-4 py-2 text-leff whitespace-nowrap">
                                                            MAIN ASSEMBLY LINE {row.wcno.substring(2, 3)}
                                                        </td>
                                                        <td className="border border-gray-600 px-4 py-2 text-right">
                                                            {row.tagCountMain}
                                                        </td>
                                                        <td className={`border border-gray-600 px-4 py-2 text-right 
                                                    ${row.tagCountMain === row.tagCountMainAuditee ? "text-green-600 " : " text-red-500 "}`}>
                                                            {row.tagCountMainAuditee}
                                                        </td>
                                                        <td className={`border border-gray-600 px-4 py-2 text-right 
                                                    ${row.tagCountMain === row.tagCountMainAuditee ? "text-green-600 " : " text-red-500 "}`}>
                                                            {row.tagCountMain - row.tagCountMainAuditee}
                                                        </td>
                                                        <td className={`border border-gray-600 px-4 py-2 text-right ${row.tagCountMain === row.tagCountMainAuditee ? "text-green-600 " : " text-red-500 "} `}>
                                                            {row.tagCountMain > 0 ? ((row.tagCountMainAuditee / row.tagCountMain) * 100).toFixed(1) + "%" : "0%"}
                                                            <Button type="primary" className="mr-5" size="small" icon={<TbReportSearch />} onClick={() => handleModalPart(row)} >
                                                                แสดงรายการ</Button>
                                                        </td>


                                                    </>)

                                                    : (ln == "FINAL") ? <>
                                                        <td className="border border-gray-600 px-4 py-2 text-left whitespace-nowrap">
                                                            FINAL LINE {row.wcno.substring(2, 3)}
                                                        </td>
                                                        <td className="border border-gray-600 px-4 py-2 text-right">
                                                            {row.tagCountFinal}
                                                        </td>
                                                        <td className={`border border-gray-600 px-4 py-2 text-right 
                                                    ${row.tagCountFinal === row.tagCountFinalAuditee ? "text-green-600 " : " text-red-500 "}`}>
                                                            {row.tagCountFinalAuditee}
                                                        </td>
                                                        <td className={`border border-gray-600 px-4 py-2 text-right 
                                                    ${row.tagCountFinal === row.tagCountFinalAuditee ? "text-green-600 " : " text-red-500 "}`}>
                                                            {row.tagCountFinal - row.tagCountFinalAuditee}
                                                        </td>
                                                        <td className={`border border-gray-600 px-4 py-2 text-right ${row.tagCountFinal === row.tagCountFinalAuditee ? "text-green-600 " : " text-red-500 "}`}>
                                                            {row.tagCountFinal > 0 ? ((row.tagCountFinalAuditee / row.tagCountFinal) * 100).toFixed(1) + "%" : "0%"}
                                                            <Button type="primary" className="mr-5" size="small" icon={<TbReportSearch />} onClick={() => handleModalPart(row)} >
                                                                แสดงรายการ</Button>
                                                        </td>
                                                    </> : <>
                                                        <td className="border border-gray-600 px-4 py-2 text-left whitespace-nowrap">
                                                            แตก Part LINE {row.wcno.substring(2, 3)}
                                                        </td>
                                                        <td className="border border-gray-600 px-4 py-2 text-right">
                                                            {row.tagCountExplode}
                                                        </td>
                                                        <td className={`border border-gray-600 px-4 py-2 text-right 
                                                    ${row.tagCountExplode === row.tagCountExplodeAuditee ? "text-green-600 " : " text-red-500 "}`}>
                                                            {row.tagCountExplodeAuditee}
                                                        </td>
                                                        <td className={`border border-gray-600 px-4 py-2 text-right 
                                                    ${row.tagCountExplode === row.tagCountExplodeAuditee ? "text-green-600 " : " text-red-500 "}`}>
                                                            {row.tagCountExplode - row.tagCountExplodeAuditee}
                                                        </td>
                                                        <td className={`border border-gray-600 px-4 py-2 text-right ${row.tagCountExplode === row.tagCountExplodeAuditee ? "text-green-600 " : " text-red-500 "}`}>
                                                            {row.tagCountExplode > 0 ? ((row.tagCountExplodeAuditee / row.tagCountExplode) * 100).toFixed(1) + "%" : "0%"}
                                                            <Button type="primary" className="mr-5" size="small" icon={<TbReportSearch />} onClick={() => handleModalPart(row)} >
                                                                แสดงรายการ</Button>
                                                        </td>
                                                    </>


                                            }

                                        </tr>
                                    ))
                                ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={4} className="border border-gray-600 text-right p-4 py-2 font-bold">Total:</td>
                                <td className="border border-gray-600 px-4 py-2 text-right font-semibold bg-[]">
                                    {new Intl.NumberFormat().format(
                                        stagCheck.reduce((total: any, item: { wcno: any; }) => {
                                            const sumItem = stagCheck?.find((s: any) => s.wcno === item.wcno);
                                            return total + (sumItem?.tagCount || 0);
                                        }, 0)
                                    )}
                                </td>
                                <td className="border border-gray-600 px-4 py-2 text-right font-semibold bg-[]">
                                    {new Intl.NumberFormat().format(
                                        stagCheck.reduce((total: any, item: { wcno: any; }) => {
                                            const sumItem = stagCheck?.find((s: any) => s.wcno === item.wcno);
                                            return total + (sumItem?.tagCountAuditee || 0);
                                        }, 0)
                                    )}
                                </td>
                                <td className="border border-gray-600 px-4 py-2 text-right font-semibold bg-[]">
                                    {new Intl.NumberFormat().format(
                                        stagCheck.reduce((total: any, item: { wcno: any; }) => {
                                            const sumItem = stagCheck?.find((s: any) => s.wcno === item.wcno);
                                            return total + (sumItem?.tagCountAuditee || 0);
                                        }, 0)
                                    )}
                                </td>
                                <td className="border border-gray-600 px-4 py-2 text-right font-semibold bg-[]">

                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

            </body>



            <DetailSumAuditee open={isModalPart} close={setIsModalPart} tagData={TagData} />
        </>



    )
}

export default FinalSumAuditee


