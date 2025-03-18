import { GoldTwoTone, SearchOutlined } from "@ant-design/icons"
import { Button, RefSelectProps, Select } from "antd"
import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { SummaryData, SummaryHeader, SummaryPartList } from "@/interface/summarypart.interface";
import { API_SUMMARY_DATA, API_SUMMARY_HEADER, API_SUMMARY_PARTLIST } from "@/service/summarypart.service";
// import { useSelector } from "react-redux";
// import { ReduxInterface } from "@/interface/main.interface";
import { Wcno } from "@/interface/compressorcheck";
import { API_SELECT_WCNO } from "@/service/partlist.service";
import Navbar from "@/components/main/navbar";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

function SummerizeGoods() {

    // const oAccount: ReduxInterface = useSelector((state: any) => state.reducer);
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
        setSumPartList

        const oSumHeaders = await API_SUMMARY_HEADER('SET20250217WPDC3U608341659000001', WCNO);
        if (oSumHeaders.status !== false) {
            SetSumHeader(oSumHeaders);
        } else {
        }

        const oSumPartlists = await API_SUMMARY_PARTLIST('SET20250217WPDC3U608341659000001', WCNO);
        if (oSumPartlists.status !== false) {
            setSumPartList(oSumPartlists);
        } else {
            // console.error("Error fetching summary part lists");
        }

        const oSumDatas = await API_SUMMARY_DATA('SET20250217WPDC3U608341659000001', WCNO);
        // console.log(oSumDatas);
        if (oSumDatas.status !== false) {
            setSumData(oSumDatas);
        } else {
            // console.error("Error fetching summary data");
        }


        setIsLoad(false);
    }

    const contentRef = useRef<HTMLDivElement>(null);


    const exportToExcel = (partlist: SummaryPartList[], sumData: SummaryData[], fileName: string) => {

        const wb = XLSX.utils.book_new();

        let newobj: any = [];
        partlist.map((item: SummaryPartList) => {

            newobj = [...newobj, ...[{
                wcno: item.wcno,
                tagNo: item.tagNo,
                partNo: item.partNo,
                cm: item.cm,
                sumQty: item.sumQty
            }]]
        });

        let newsumdata: any = [];
        sumData.map((item: SummaryData) => {
            newsumdata = [
                ...newsumdata,
                ...[{
                    wcno: item.wcno,
                    partNo: item.partNo,
                    cm: item.cm,
                    model: item.model,
                    qty: item.qty,
                    lastDate: item.lastDate
                }]
            ]
        })


        const ws1 = XLSX.utils.json_to_sheet(newobj);
        XLSX.utils.book_append_sheet(wb, ws1, "Part List");

        const ws2 = XLSX.utils.json_to_sheet(newsumdata);
        XLSX.utils.book_append_sheet(wb, ws2, "Summary Data");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(dataBlob, `${fileName}.xlsx`);
    };

    const handlePrint = () => {
        if (sumHeader.length === 0 || sumPartlist.length === 0 || sumData.length === 0) {
            alert("ไม่มีข้อมูลประวัติสำหรับพิมพ์");
            return;
        }
    
        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(`
                <!DOCTYPE html>
                <html lang="th">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>ประวัติการ Auditee</title>
                        <style>
                            @page { 
                                size: A3 landscape; 
                                margin: 10mm; 
                            }
                            body {
                                font-family: Arial, sans-serif;
                            }
                            table { 
                                width: 100%; 
                                border-collapse: collapse; 
                            }
                            th, td { 
                                border: 1px solid black; 
                                padding: 8px; 
                                text-align: center; 
                                font-size: 12px;
                            }
                            th { 
                                background-color: #f2f2f2; 
                            }
                            .table-container {
                                width: 100%;
                                overflow-x: auto;
                            }
                        </style>
                    </head>
                    <body>
                        <h2 style="text-align: center;">ประวัติการ Auditee</h2>
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th rowspan="2">NO</th>
                                        <th rowspan="2">WC</th>
                                        <th rowspan="2">Tag No</th>
                                        <th rowspan="2">Part No</th>
                                        <th rowspan="2">CM</th>
                                        <th rowspan="2">PART NAME</th>
                                        <th colspan="1">Last Update</th> 
                                        ${sumHeader.map(row => `<th>${row.lastDate}</th>`).join('')}
                                    </tr>
                                    <tr>
                                        <th>TOTAL</th>
                                        ${sumHeader.map(row => `<th>${row.model}</th>`).join('')}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${sumPartlist.length > 0 ? sumPartlist.map((row, rowIndex) => `
                                        <tr>
                                            <td>${rowIndex + 1}</td>
                                            <td>${row.wcno}</td>
                                            <td>${row.tagNo}</td>
                                            <td>${row.partNo}</td>
                                            <td>${row.cm}</td>
                                            <td>${row.partName}</td>
                                            <td>${row.sumQty.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
                                            ${sumHeader.map(col => `
                                                <td>
                                                    ${sumData.find(data => data.model === col.model && data.partNo == row.partNo && row.cm == data.cm)?.qty.toLocaleString("en-US") || 0}
                                                </td>
                                            `).join('')}
                                        </tr>
                                    `).join('') : `
                                        <tr>
                                            <td colspan="${sumHeader.length + 7}" class="text-center text-red-600">ไม่พบข้อมูล</td>
                                        </tr>
                                    `}
                                </tbody>
                            </table>
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };
    
    


    return (
        <>
            <Navbar />
            <head className="flex flex-col px-8 pt-8">
                <div className="flex flex-row justify-center items-center print:hidden">
                    <p className="text-3xl p-6 w-full border border-black rounded-lg bg-[#D4EBF8] font-bold text-center">
                        สรุปรายการ Part ของ Assembly Line โดย Auditee
                    </p>
                </div>
                <div className="flex flex-row w-full gap-3 mt-3 print:hidden">
                    <div className="flex justify-start gap-2">
                        <span className="p-2.5 border border-black bg-yellow-50 text-lg text-black font-semibold text-center  rounded-lg">
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
                <div className="flex flex-row w-full mt-4 justify-end print:hidden pr-5">
                    <button onClick={() => navigate(`/auditeecheck`)} className="text-[#003092] border-2 border-[#003092] bg-white hover:bg-[#003092] hover:text-white focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-lg  px-3 py-0  text-center ">
                        <GoldTwoTone className="mr-3" />
                        หน้าแตก Part
                    </button>
                    <button
                        onClick={() => exportToExcel(sumPartlist, sumData, "SummaryCheck")}
                        className="text-green-700 border-2 border-green-700 bg-white hover:bg-green-600 hover:text-white focus:outline-none focus:ring-green-700 font-medium rounded-lg text-lg  px-3 py-3 ml-5  text-center "
                    >
                        Export to Excel
                    </button>
                    <button
                        onClick={handlePrint}
                        className="text-yellow-500 border-2 border-yellow-500 bg-white hover:bg-yellow-500 hover:text-white focus:outline-none focus:ring-green-700 font-medium rounded-lg text-lg  px-3 py-3 ml-5  text-center "
                    >
                        Print
                    </button>
                </div>
            </head >
            <body className="mt-2 px-8">
                <div ref={contentRef} className="overflow-x-auto max-h-[700px]">
                    {
                        !isLoad ? (
                            <>
                                <table className="border-separate border-spacing-0 border border-gray-400 w-full table-fixed">
                                    {/* Header */}
                                    <thead>
                                        <tr>
                                            <th className="border border-gray-600 px-4 py-2 sticky top-0 left-0 bg-white z-[20] w-[50px] text-center shadow-md" rowSpan={2}>NO</th>
                                            <th className="border border-gray-600 px-4 py-2 sticky top-0 left-[50px]  bg-white z-20 w-[60px] text-center shadow-md" rowSpan={2}>WC</th>
                                            <th className="border border-gray-600 px-4 py-2 sticky top-0 left-[110px] bg-white z-20 w-[160px] text-center shadow-md" rowSpan={2}>Tag No</th>
                                            <th className="border border-gray-600 px-4 py-2 sticky top-0 left-[270px] bg-white z-20 w-[160px] text-center shadow-md" rowSpan={2}>Part No</th>
                                            <th className="border border-gray-600 px-4 py-2 sticky top-0 left-[430px] bg-white z-20 w-[60px] text-center shadow-md" rowSpan={2}>CM</th>
                                            <th className="border border-gray-600 px-4 py-2 sticky top-0 left-[490px] bg-white z-20 w-[280px] text-center shadow-md" rowSpan={2}>PART NAME</th>

                                            <th className="border border-gray-600 px-4 py-2 sticky top-0 left-[770px] bg-[#D7E5CA] z-20  whitespace-nowrap w-[140px] text-center" colSpan={1}>Last Update</th>
                                            {sumHeader.map((row, rowindex) => (
                                                <th key={rowindex} className="border border-gray-400 px-2 py-1 text-center w-[150px] sticky top-0 bg-[#D7E5CA]">{row.lastDate}</th>
                                            ))}
                                        </tr>
                                        <tr className="bg-gray-200">
                                            <th className="border border-gray-600 px-4 py-2 sticky top-[42px] left-[770px] bg-[#D1E9F6] z-20 w-[140px] text-center">Total</th>
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
                                                    <td className="border border-gray-400 px-4 py-2 sticky left-[110px] bg-white z-10 w-[60px] text-center shadow-md">{row.tagNo}</td>
                                                    <td className="border border-gray-400 px-4 py-2 sticky left-[270px] bg-white z-10 w-[120px] whitespace-nowrap text-center shadow-md">{row.partNo}</td>
                                                    <td className="border border-gray-400 px-4 py-2 sticky left-[430px] bg-white z-10 w-[60px] text-center shadow-md">{row.cm}</td>
                                                    <td className="border border-gray-400 px-4 py-2 sticky left-[490px] bg-white z-10 w-[200px] text-left whitespace-nowrap shadow-md">{row.partName}</td>
                                                    <td className="border border-gray-400 px-4 py-2 sticky left-[770px] z-10 font-bold text-right bg-sky-50 whitespace-nowrap">{row.sumQty.toLocaleString("en-US", {
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

