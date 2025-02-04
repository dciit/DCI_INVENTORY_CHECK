import { Button, Input } from "antd"
import { ChangeEvent, useState } from "react";

interface RowData {
    amout: number;
    partnumber: string;
    description: string;
    qtytotle: number; // ใช้ number สำหรับผลรวม
    values: number[];

}

function AuditeeFill() {

    const initialData: RowData[] = [
        { amout: 1, partnumber: "M1YC15AXD#A", description: "MECHASSY", qtytotle: 0, values: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { amout: 1, partnumber: "3PD06369-1", description: "ROTOR ASSY", qtytotle: 0, values: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { amout: 1, partnumber: "3PD06368-1", description: "STATOR ASSY", qtytotle: 0, values: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { amout: 1, partnumber: "3PD06360-1", description: "PIPE ASSY", qtytotle: 0, values: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { amout: 1, partnumber: "4PD04133-1", description: "INLET TUBE-SUC", qtytotle: 0, values: [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0] }
    ];

    // ใช้ useState เพื่อจัดการค่าของแต่ละช่อง
    const [tableData, setTableData] = useState<RowData[]>(initialData);

    const valuesLength = tableData.length > 0 ? tableData[0].values.length : 0;

    const [headerValues, setHeaderValues] = useState<number[]>(Array(valuesLength).fill(0));

    // คำนวณผลรวมของ header inputs
    const headerSum = headerValues.reduce((acc, val) => acc + val, 0);

    // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงค่าใน body (ไม่เกี่ยวกับ header)
    const handValueChange = (
        rowIndex: number,
        valueIndex: number,
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const newValue = Number(e.target.value) || 0;
        setTableData((prevData) => {
            const newData = [...prevData];
            const row = { ...newData[rowIndex] };
            const newValues = [...row.values];
            newValues[valueIndex] = newValue;
            row.values = newValues;
            // คำนวณผลรวมของค่าใน row.values
            const sum = newValues.reduce((acc, val) => acc + (val || 0), 0);
            row.qtytotle = sum;
            newData[rowIndex] = row;
            return newData;
        });
    };



    return (
        <head className="flex flex-col px-8 py-8">
            <div className="flex flex-row justify-between items-center">
                <span className="w-1/6 p-6 bg-blue-900 border-4 border-black text-2xl text-white font-semibold text-center">AUDITEE</span>
                <p className="w-3/6 text-4xl font-bold text-center items-center underline">Finished Goods: Compressor (Assembly Line)</p>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-4">
                        <span className="p-2 w-1/2 bg-green-500 border text-lg text-white font-semibold items-center">YYYYMM</span>
                        <span className="p-2 bg-green-500 border text-lg text-white font-semibold">Vision:</span>
                        <div className="p-2 border border-black text-lg text-white font-semibold w-40"></div>
                    </div>
                    <div className="flex flex-row gap-4">
                        <div className="p-2 w-1/2 border border-black text-lg text-white font-semibold items-center">123123</div>
                        <span className="p-2 bg-green-500 border text-lg text-white font-semibold">Name:</span>
                        <div className="p-2 border border-black text-lg text-white font-semibold w-40"></div>
                    </div>
                </div>
            </div>
            <div className="flex flex-row gap-3">
                <div className="flex justify-between gap-2">
                    <div className="mt-7 flex justify-between gap-2">
                        <span className="p-3 bg-green-500 border text-lg text-white font-semibold items-center">W/C:</span>
                        <Input type="text" id="wc" className="p-2.5 border border-black hover:border-black" />
                    </div>
                    <div className="mt-7 flex justify-between gap-2">
                        <span className="p-3 bg-green-500 border text-lg text-white font-semibold items-center">Model Name:</span>
                        <Input type="text" id="modelname" className="w-56 p-2.5 border border-black hover:border-black" />
                    </div>
                    <div className="mt-7 flex justify-between gap-2">
                        <span className="p-3 bg-green-500 border text-lg text-white font-semibold items-center">Code Model:</span>
                        <Input type="text" id="codemodel" className="w-56 p-2.5 border border-black hover:border-black" />
                    </div>
                </div>

                <div id="search" className="flex flex-1 justify-end mt-7">
                    <Button className="text-black bg-blue-300 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-700 font-medium rounded-lg text-lg px-7 py-7 text-center dark:bg-blue-900 dark:hover:bg-blue-900 dark:focus:ring-blue-900">
                        Search
                    </Button>
                </div>
            </div>
            <div className="flex flex-row">
                <p className="text-red-600 font-semibold mt-1">*โปรดใส่ Model name หรือ Code model ก่อนทำการค้นหา</p>
            </div>

            <body className="mt-10">
                {/*process to produce*/}
                <div className="container rounded-2xl border-2 border-blue-800 p-10 ml-3 bg-white justify-start w-[25%]">
                    <p className="text-lg text-black font-semibold">Process to produce</p>

                </div>
                {/* Table */}
                <div className="overflow-x-auto p-4">
                    <table className="border-collapse border border-gray-400 w-full">
                        {/* Header */}
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-400 px-4 py-2" rowSpan={2}>จำนวน Part ประกอบ</th>
                                <th className="border border-gray-400 px-4 py-2" colSpan={1}>CASE 1-29</th>
                                <th className="border border-gray-400 px-4 py-2" colSpan={1}>Qty Total</th>
                                {Array.from({ length: valuesLength }, (_, i) => (
                                    <th key={i} className="border border-gray-400 px-2 py-1 text-center">
                                        {i + 1}
                                    </th>
                                ))}
                            </tr>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-400 px-4 py-2">จำนวนCASEที่นับได้</th>
                                <th className="border border-gray-400 px-4 py-2">{headerSum}</th>
                                {Array.from({ length: valuesLength }, (_, i) => (
                                    <th key={i} className="border border-gray-400 px-2 py-2 text-center">
                                        {/* Input สำหรับแก้ไขค่า header ซึ่งจะใช้ state headerValues */}
                                        <Input
                                            type="text"
                                            className="bg-yellow-50"
                                            value={headerValues[i]}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                const newVal = Number(e.target.value) || 0;
                                                setHeaderValues((prev) => {
                                                    const newHeaderValues = [...prev];
                                                    newHeaderValues[i] = newVal;
                                                    return newHeaderValues;
                                                });
                                            }}
                                        />
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody>
                            {tableData.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-100">
                                    <td className="border border-gray-400 px-4 py-2 text-center">{row.amout}</td>
                                    <td className="border border-gray-400 px-4 py-2">{row.partnumber}</td>
                                    <td className="border border-gray-400 px-4 py-2 text-center">{row.qtytotle}</td>
                                    {row.values.map((value, colIndex) => (
                                        <td key={colIndex} className="border border-gray-400 text-center">
                                            <div
                                                className={`w-full h-full text-center mt-1 ${value === 0 ? "bg-gray-600" : value === 1 ? "bg-white" : ""}`}
                                            />
                                            {value === 1 ? "" : value}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-row gap-3 justify-end">
                    <div id="adjust" className="mt-7">
                        <Button
                            className="text-black bg-yellow-200 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-700 font-medium rounded-lg text-lg px-7 py-7 text-center dark:bg-yellow-900 dark:hover:bg-yellow-900 dark:focus:ring-yellow-900">
                            Adjust
                        </Button>
                    </div>
                    <div id="clear" className="mt-7">
                        <Button
                            className="text-black bg-rose-500 hover:bg-rose-700 focus:ring-4 focus:outline-none focus:ring-rose-700 font-medium rounded-lg text-lg px-7 py-7 text-center dark:bg-rose-900 dark:hover:bg-rose-900 dark:focus:ring-rose-900">
                            Clear
                        </Button>
                    </div>
                    <div id="save" className="mt-7">
                        <Button
                            className="text-black bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:green-rose-700 font-medium rounded-lg text-lg px-7 py-7 text-center dark:bg-green-900 dark:hover:bg-green-900 dark:focus:ring-green-900">
                            Save
                        </Button>
                    </div>
                </div>
            </body>
        </head>

    )
}

export default AuditeeFill