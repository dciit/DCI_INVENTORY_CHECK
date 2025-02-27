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


    useEffect(() => {
        fetchCheckTag();
    }, []);


    useEffect(() => {
        if (wcno.length > 0) {
            fetchComparesum(wcno);
        }
    }, [wcno]);

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
            </head>
            <body className="flex w-full p-4 justify-center">
                {
                    loading == true ? <div className="items-center justify-center mt-3"><CircularProgress /></div> :
                        (Datas.length && <ViewCompareSum data={Datas} tagCompare={tagCompare} />)
                }
            </body>

        </>



    )
}

export default CompareSummary