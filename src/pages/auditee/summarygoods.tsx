import { GoldTwoTone, SearchOutlined } from "@ant-design/icons"
import { Button, RefSelectProps, Select } from "antd"
import { useEffect, useRef, useState } from "react";
import imgprinter from "../../assets/printer.jpg";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
import { SummaryData, SummaryHeader, SummaryPartList } from "@/interface/summarypart.interface";
import { API_SUMMARY_DATA, API_SUMMARY_HEADER, API_SUMMARY_PARTLIST } from "@/service/summarypart.service";
import { useSelector } from "react-redux";
import { ReduxInterface } from "@/interface/main.interface";
import { Wcno } from "@/interface/compressorcheck";
import { API_SELECT_WCNO } from "@/service/partlist.service";
import Navbar from "@/components/main/navbar";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

function SummerizeGoods() {

    const oAccount: ReduxInterface = useSelector((state: any) => state.reducer);
    const navigate = useNavigate();
    const refWCNO = useRef<RefSelectProps>(null)

    const [sumHeader, SetSumHeader] = useState<SummaryHeader[]>([]);
    const [sumPartlist, setSumPartList] = useState<SummaryPartList[]>([]);
    const [sumData, setSumData] = useState<SummaryData[]>([]);

    const [arWCNO, setarWCNO] = useState<Wcno[]>([]);
    const [WCNO, setWCNO] = useState<string>('');
    const [isInitail, setIsInitail] = useState<boolean>(false);
    const [isLoad, setIsLoad] = useState<boolean>(false);



    useEffect(() => {
        if (!isInitail) {
            const fetchWCNO = async () => {
                const oWCNOs = await API_SELECT_WCNO();
                if (oWCNOs.status !== false) {
                    setarWCNO(oWCNOs);
                    // console.log(oWCNOs);
                } else {
                    // console.error("Error fetching WCNOs");
                }
            }
            fetchWCNO();
            setIsInitail(true);
        }
        loadData();
    }, [isInitail]);



    const loadData = async () => {
        setIsLoad(true);

        const oSumHeaders = await API_SUMMARY_HEADER(oAccount.authen.mSetInfo?.setCode!, WCNO);
        // console.log(oSumHeaders);
        if (oSumHeaders.status !== false) {
            SetSumHeader(oSumHeaders);
        } else {
            // console.error("Error fetching summary headers");
        }

        const oSumPartlists = await API_SUMMARY_PARTLIST(oAccount.authen.mSetInfo?.setCode!, WCNO);
        // console.log(oSumPartlists);
        if (oSumPartlists.status !== false) {
            setSumPartList(oSumPartlists);
        } else {
            // console.error("Error fetching summary part lists");
        }

        const oSumDatas = await API_SUMMARY_DATA(oAccount.authen.mSetInfo?.setCode!, WCNO);
        // console.log(oSumDatas);
        if (oSumDatas.status !== false) {
            setSumData(oSumDatas);
        } else {
            // console.error("Error fetching summary data");
        }


        setIsLoad(false);
    }



    // const exportToExcel = () => {
    //     const ws = XLSX.utils.json_to_sheet(initialData);

    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    //     const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    //     const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });

    //     saveAs(blob, "dataPartlist.xlsx");

    // }

    return (
        <>
            <Navbar />
            <head className="flex flex-col px-8 pt-8">
                <div className="flex flex-row justify-center items-center print:hidden">
                    <p className="text-3xl p-6 w-full border border-black rounded-lg bg-[#FFEFC8] font-bold text-center">
                        สรุปรายการ Part ของ Assembly Line โดย Auditee
                    </p>
                </div>
                <div className="flex flex-row w-full gap-3 mt-3 print:hidden">
                    <div className="flex justify-start gap-2">
                        <span className="p-2.5 border border-black bg-[#607EAA] text-lg text-white font-semibold text-center  rounded-lg">
                            W/C
                        </span>
                        <Select
                            ref={refWCNO}
                            showSearch
                            placeholder="Select a person"
                            optionFilterProp="label"
                            className="w-52 h-14 border rounded-lg"
                            value={WCNO}
                            onChange={(value) => setWCNO(value)}
                            options={arWCNO
                                .filter((wc) => (wc.wcno.startsWith("90") || wc.wcno.startsWith("92")) &&
                                    wc.wcno !== '902' &&
                                    wc.wcno !== '926'
                                )
                                .map((wc) => ({ value: wc.wcno, label: wc.wcno }))}
                        />
                        <div id="search" className="flex flex-1 justify-end">
                            <Button
                                onClick={() => {
                                    console.log("Button clicked");
                                    loadData();
                                }}
                                className="text-black focus:ring-4 focus:outline-none font-medium rounded-lg text-lg h-14 flex items-center gap-2"
                            >
                                <SearchOutlined className="text-xl" />
                                Search
                            </Button>

                        </div>
                    </div>
                </div>
                <div className="flex flex-row w-full mt-4 justify-end print:hidden">
                    <button onClick={() => navigate(`/auditeecheck`)} className="text-[#003092] border-2 border-[#003092] bg-white hover:bg-[#003092] hover:text-white focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-lg  px-3 py-0  text-center ">
                        <GoldTwoTone className="mr-3" />
                        หน้าแตก Part
                    </button>
                    <button
                        onClick={() => window.print()}
                    >
                        <img src={imgprinter} alt="" className="w-24 h-16" />
                    </button>
                </div>
            </head >
            <body className="mt-2">
                <div className="overflow-x-auto max-h-[700px]">
                    {
                        !isLoad ? (
                            <>
                                <table className="border-separate border-spacing-0 border border-gray-400 w-full table-fixed">
                                    {/* Header */}
                                    <thead>
                                        <tr>
                                            <th className="border border-gray-600 px-4 py-2 sticky top-0 left-0 bg-white z-[20] w-[50px] text-center shadow-md" rowSpan={2}>NO</th>
                                            <th className="border border-gray-600 px-4 py-2 sticky top-0 left-[50px]  bg-white z-20 w-[60px] text-center shadow-md" rowSpan={2}>WC</th>
                                            <th className="border border-gray-600 px-4 py-2 sticky top-0 left-[110px] bg-white z-20 w-[160px] text-center shadow-md" rowSpan={2}>Part No</th>
                                            <th className="border border-gray-600 px-4 py-2 sticky top-0 left-[270px] bg-white z-20 w-[60px] text-center shadow-md" rowSpan={2}>CM</th>
                                            <th className="border border-gray-600 px-4 py-2 sticky top-0 left-[330px] bg-white z-20 w-[280px] text-center shadow-md" rowSpan={2}>PART NAME</th>

                                            <th className="border border-gray-600 px-4 py-2 sticky top-0 bg-[#D7E5CA]  whitespace-nowrap w-[140px] text-center" colSpan={1}>Last Update</th>
                                            {sumHeader.map((row, rowindex) => (
                                                <th key={rowindex} className="border border-gray-400 px-2 py-1 text-center w-[150px] sticky top-0 bg-[#D7E5CA]">{row.lastDate}</th>
                                            ))}
                                        </tr>
                                        <tr className="bg-gray-200">
                                            <th className="border border-gray-600 px-4 py-2 sticky top-[42px] bg-[#D1E9F6] w-[140px] text-center">Total</th>
                                            {sumHeader.map((row, rowIndex) => (
                                                <th key={rowIndex} className="border border-gray-600 text-center max-w-full text-sm sticky top-[42px] bg-[#D1E9F6]">{row.model}</th>
                                            ))}
                                        </tr>
                                    </thead>

                                    {/* Body */}
                                    <tbody>
                                        {sumPartlist.length > 0 ? (
                                            sumPartlist.map((row, rowIndex) => (
                                                <tr key={rowIndex} className="hover:bg-gray-100">
                                                    <td className="border border-gray-400 px-4 py-2 sticky left-0 bg-white z-10 w-[50px] text-center shadow-md">
                                                        {rowIndex + 1}
                                                    </td>
                                                    <td className="border border-gray-400 px-4 py-2 sticky left-[50px] bg-white z-10 w-[60px] text-center shadow-md">{row.wcno}</td>
                                                    <td className="border border-gray-400 px-4 py-2 sticky left-[110px] bg-white z-10 w-[120px] whitespace-nowrap text-center shadow-md">{row.partNo}</td>
                                                    <td className="border border-gray-400 px-4 py-2 sticky left-[270px] bg-white z-10 w-[60px] text-center shadow-md">{row.cm}</td>
                                                    <td className="border border-gray-400 px-4 py-2 sticky left-[330px] bg-white z-10 w-[200px] text-left whitespace-nowrap shadow-md">{row.partName}</td>
                                                    <td className="border border-gray-400 px-4 py-2 font-bold text-right bg-sky-50 whitespace-nowrap">{row.sumQty.toLocaleString("en-US", {
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 2,
                                                    })}</td>
                                                    {sumHeader.map((col, colIdx) => (
                                                        <td key={colIdx} className="border border-gray-400 px-4 py-2 text-right whitespace-nowrap">
                                                            {
                                                                (sumData.filter((data) => data.model === col.model
                                                                    && data.partNo == row.partNo && row.cm == data.cm).length > 0) ?
                                                                    sumData.filter((data) => data.model === col.model &&
                                                                        data.partNo == row.partNo && row.cm == data.cm)[0].qty.toLocaleString("en-US", {
                                                                            minimumFractionDigits: 0,
                                                                            maximumFractionDigits: 2,
                                                                        }) : 0
                                                            }
                                                        </td>
                                                    ))}

                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={sumHeader.length + 6} className="border border-gray-400 px-4 py-2 text-center text-red-600">
                                                    ไม่พบข้อมูล
                                                </td>
                                            </tr>
                                        )
                                        }
                                    </tbody>

                                </table>
                            </>


                        ) : (<div className="item-center justify-center text-center">
                            <CircularProgress />
                        </div>)
                    }

                </div>
            </body>

        </>


    )
}

export default SummerizeGoods

