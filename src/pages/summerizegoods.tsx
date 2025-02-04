import { PrinterOutlined } from "@ant-design/icons"
import imgReact from "../assets/excelpic.png"
import { Button, Input } from "antd"
import { useState } from "react";

interface RowData{
    no: number;
    wc: string;
    partno: string;
    cm: string | null
    partname: string;
    qtytotle: number;
    date: string;
    model: string;
    values: number[]
}

function SummerizeGoods() {

    const initialData: RowData[] = [
        { no: 1, wc: "901", partno: "2P575813-1", cm: "", partname: "PIPE ASSY", qtytotle: 0, date: "04022025", model: "1YC13AXD", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { no: 2, wc: "901", partno: "2P581209-1", cm: "", partname: "PIPE ASSY", qtytotle: 0, date: "05022025", model: "1YC15AXD", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { no: 3, wc: "901", partno: "2P581209-2", cm: "", partname: "PIPE ASSY", qtytotle: 0, date: "04022025", model: "1YC20eXD", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { no: 4, wc: "901", partno: "2PD03210-1", cm: "B", partname: "ACCUMULATOR ASSY", qtytotle: 0, date: "05022025", model: "1YC20EXD#A", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { no: 5, wc: "901", partno: "2PD04447-1", cm: "D", partname: "ACCUMULATOR ASSY", qtytotle: 0, date: "05022025", model: "1YC20GXD", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { no: 6, wc: "901", partno: "2P575813-1", cm: "", partname: "PIPE ASSY", qtytotle: 0, date: "04022025", model: "1YC13AXD", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { no: 7, wc: "901", partno: "2P581209-1", cm: "", partname: "PIPE ASSY", qtytotle: 0, date: "05022025", model: "1YC15AXD", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { no: 8, wc: "901", partno: "2P581209-2", cm: "", partname: "PIPE ASSY", qtytotle: 0, date: "04022025", model: "1YC20eXD", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { no: 9, wc: "901", partno: "2PD03210-1", cm: "B", partname: "ACCUMULATOR ASSY", qtytotle: 0, date: "05022025", model: "1YC20EXD#A", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { no: 10, wc: "901", partno: "2PD04447-1", cm: "D", partname: "ACCUMULATOR ASSY", qtytotle: 0, date: "05022025", model: "1YC20GXD", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { no: 11, wc: "901", partno: "2P575813-1", cm: "", partname: "PIPE ASSY", qtytotle: 0, date: "04022025", model: "1YC13AXD", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { no: 12, wc: "901", partno: "2P581209-1", cm: "", partname: "PIPE ASSY", qtytotle: 0, date: "05022025", model: "1YC15AXD", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { no: 13, wc: "901", partno: "2P581209-2", cm: "", partname: "PIPE ASSY", qtytotle: 0, date: "04022025", model: "1YC20eXD", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { no: 14, wc: "901", partno: "2PD03210-1", cm: "B", partname: "ACCUMULATOR ASSY", qtytotle: 0, date: "05022025", model: "1YC20EXD#A", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { no: 15, wc: "901", partno: "2PD04447-1", cm: "D", partname: "ACCUMULATOR ASSY", qtytotle: 0, date: "05022025", model: "1YC20GXD", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { no: 16, wc: "901", partno: "2P575813-1", cm: "", partname: "PIPE ASSY", qtytotle: 0, date: "04022025", model: "1YC13AXD", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { no: 17, wc: "901", partno: "2P581209-1", cm: "", partname: "PIPE ASSY", qtytotle: 0, date: "05022025", model: "1YC15AXD", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { no: 18, wc: "901", partno: "2P581209-2", cm: "", partname: "PIPE ASSY", qtytotle: 0, date: "04022025", model: "1YC20eXD", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { no: 19, wc: "901", partno: "2PD03210-1", cm: "B", partname: "ACCUMULATOR ASSY", qtytotle: 0, date: "05022025", model: "1YC20EXD#A", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { no: 20, wc: "901", partno: "2PD04447-1", cm: "D", partname: "ACCUMULATOR ASSY", qtytotle: 0, date: "05022025", model: "1YC20GXD", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    ];

    const [tableData, setTableData] = useState(initialData);

    

    return (
        <head className="flex flex-col px-8 py-8">
            <div className="flex flex-row justify-between items-center">
                <span className="w-1/6 p-6 bg-blue-900 border-4 border-black text-2xl text-white font-semibold text-center">
                    AUDITEE
                </span>
                <p className="text-3xl font-bold text-center underline">สรุปรายการ Part ของ Finshed Goods (Assembly Line)</p>
                <div className="flex flex-col gap-3">
                    <span className="pt-3 px-12 border border-black bg-gray-400 text-2xl text-black font-bold text-center flex items-center justify-center gap-2">
                        <PrinterOutlined style={{ fontSize: '50px' }} />
                        Print
                    </span>
                    <span className="pt-3 px-12  border border-black bg-white text-2xl text-black font-bold text-center flex items-center justify-center gap-2">
                        <img src={imgReact} alt="" className="w-12 h-12" />
                        Excel
                    </span>
                </div>
            </div>
            <div className="flex flex-row w-full gap-3 mt-5">
                <div className=" flex justify-start gap-2">
                    <span className="p-3 border bg-green-500 text-lg text-white font-semibold text-start w-24">
                        Factory:
                    </span>
                    <Input className="p-3 border border-black text-lg text-black font-semibold text-start w-60"></Input>
                </div>
            </div>
            <div className="flex flex-row w-full gap-3 mt-3">
                <div className="flex justify-start gap-2">
                    <span className="p-3 border bg-green-500 text-lg text-white font-semibold text-start w-24">
                        W/C:
                    </span>
                    <Input className="p-3 border border-black text-lg text-black font-semibold text-start w-60"></Input>
                    <div id="search" className="flex flex-1 justify-end">
                        <Button className="text-black bg-blue-300 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-700 font-medium rounded-lg text-lg px-7 py-7 text-center dark:bg-blue-900 dark:hover:bg-blue-900 dark:focus:ring-blue-900">
                            Search
                        </Button>
                    </div>
                </div>
            </div>
            <body className="mt-8">
                <div className="overflow-x-auto p-4 mt-6">
                    <table className="border-collapse border border-gray-400 w-full">
                        {/* Header */}
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-400 px-4 py-2" rowSpan={2}>NO</th>
                                <th className="border border-gray-400 px-4 py-2" rowSpan={2}>WC</th>
                                <th className="border border-gray-400 px-4 py-2" rowSpan={2}>Part No</th>
                                <th className="border border-gray-400 px-4 py-2" rowSpan={2}>CM</th>
                                <th className="border border-gray-400 px-4 py-2" rowSpan={2}>PART NAME</th>
                                <th className="border border-gray-400 px-4 py-2 whitespace-nowrap" colSpan={1}>Last Update</th>
                                {tableData.map((row, rowindex) => (
                                    <th key={rowindex} className="border border-gray-400 px-2 py-1 text-center">{row.date}</th>
                                ))}
                            </tr>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-400 px-4 py-2">Totle</th>
                                {tableData.map((row, rowIndex) => (
                                    <th key={rowIndex} className="border border-gray-400 px-2 py-1 text-center">{row.model}</th>
                                ))}
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody>
                            {tableData.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-100">
                                    <td className="border border-gray-400 px-4 py-2 text-center">{row.no}</td>
                                    <td className="border border-gray-400 px-4 py-2">{row.wc}</td>
                                    <td className="border border-gray-400 px-4 py-2 text-center whitespace-nowrap">{row.partno}</td>
                                    <td className="border border-gray-400 px-4 py-2 text-center">{row.cm}</td>
                                    <td className="border border-gray-400 px-4 py-2 text-center whitespace-nowrap">{row.partname}</td>
                                    <td className="border border-gray-400 px-4 py-2 text-center">{row.qtytotle}</td>
                                    {row.values.map((value, i) => (
                                        <td key={i} className="border border-gray-400 px-2 py-1 text-center">{value}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </body>
        </head>

    )
}

export default SummerizeGoods