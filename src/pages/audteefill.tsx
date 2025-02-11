import { Master, MasterData, MasterInterface, Partlist, PropPartUsed } from "@/interface/compressorcheck";
import { API_MASTER_CHECK_INVENTORY } from "@/service/master.service";
import { API_PARTLIST_CHECK_INVENTORY } from "@/service/partlist.service";
import { Alert, Button, Input, InputRef } from "antd"
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";


function AuditeeFill() {

    const [serach, setSearch] = useState<MasterInterface>({
        serach: false,
        load: false,
        message: '',
    })

    const [searchData, setSearchData] = useState<MasterData>({
        paramWCNO: '',
        paramModel: ''
    });

    const [tableData, setTableData] = useState<Master[]>([]);
    const [codeModel, setCodeModel] = useState<string>("");
    const [partlistData, setPartlistData] = useState<PropPartUsed[]>([]);

    const refWCNO = useRef<InputRef>(null);
    const refModel = useRef<InputRef>(null);

    async function handleSearchData() {
        if (!searchData.paramWCNO || !searchData.paramModel) {
            if (!searchData.paramWCNO) {
                refWCNO.current?.focus();
                setSearch({ ...serach, load: false, message: 'กรุณากรอก W/C' });
                return;
            }
            if (!searchData.paramModel) {
                refModel.current?.focus();
                setSearch({ ...serach, load: false, message: 'กรุณากรอก model name' });
                return;
            }
        }

        let resSearch = await API_MASTER_CHECK_INVENTORY(searchData.paramWCNO, searchData.paramModel);
        console.log("ค่าที่ได้จาก API:", resSearch);
        console.log("ประเภทของ resSearch:", Array.isArray(resSearch) ? "Array" : typeof resSearch);

        if (Array.isArray(resSearch) && resSearch.length > 0) {
            setTableData(resSearch);
        } else {
            setTableData([]);
        }

        let groupByPartlist: PropPartUsed[] = [];
        let resPartlist = await API_PARTLIST_CHECK_INVENTORY();
        console.log('Data PartList:', resPartlist)

        resPartlist.map((acc: any) => {
            let indexOfProcName: number = groupByPartlist.findIndex((x: any) => x.procName == acc.proc_Name)
            if (indexOfProcName != -1) {
                groupByPartlist[indexOfProcName].partNo = groupByPartlist[indexOfProcName].partNo.concat(acc.partNo);
            } else {
                groupByPartlist.push({
                    procName: acc.proc_Name,
                    partNo: [acc.partNo]
                })
            }
        })
        console.log(groupByPartlist)
        setPartlistData(groupByPartlist)
    }

    const procNameLength = partlistData.length;
    const [headerValues, setHeaderValues] = useState<number[]>(Array(procNameLength).fill(0));
    const headerSum = headerValues.reduce((acc, val) => acc + val, 0);

    const handleHeaderInputChange = useCallback((index: number, event: ChangeEvent<HTMLInputElement>) => {
        setHeaderValues(prev => {
            const newHeaderValues = [...prev];
            newHeaderValues[index] = parseInt(event.target.value) || 0;
            return newHeaderValues;
        });
    }, []);

    // useEffect(() => {
    //     const updatePartlist = partlistData.map((partItem: any) => {
    //         const updatedPart = { ...partItem};

    //         tableData.forEach((tableRow, index) => {
    //             if (tableRow.partNo.includes(partItem.partNo)) {
    //                 updatedPart.usageQty = headerValues[index] * tableRow.usageQty
    //             }
    //         });

    //         return updatedPart;
    //     })

    //     setPartlistData(updatePartlist);
    // })

    useEffect(() => {
        console.log("ข้อมูลใน tableData อัปเดต:", tableData);
        console.log("ข้อมูลใน partlistData อัปเดต:", partlistData)
    }, [headerValues, tableData, partlistData]);



    return (
        <head className="flex flex-col px-8 py-8">
            <div>
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
                            <Input
                                ref={refWCNO}
                                type="text"
                                id="wc"
                                className="p-2.5 border border-black hover:border-black"
                                autoFocus onChange={(e) => setSearchData({ ...searchData, paramWCNO: e.target.value })}
                            />
                        </div>
                        <div className="mt-7 flex justify-between gap-2">
                            <span className="p-3 bg-green-500 border text-lg text-white font-semibold items-center">Model Name:</span>
                            <Input
                                ref={refModel}
                                type="text"
                                id="model"
                                className="w-56 p-2.5 border border-black hover:border-black"
                                autoFocus onChange={(e) => setSearchData({ ...searchData, paramModel: e.target.value })}
                            />
                        </div>
                        <div className="mt-7 flex justify-between gap-2">
                            <span className="p-3 bg-green-500 border text-lg text-white font-semibold items-center">Code Model:</span>
                            <Input
                                type="text"
                                id="codemodel"
                                className="w-56 p-2.5 border border-black hover:border-black"
                                value={codeModel}
                                onChange={(e) => setCodeModel(e.target.value)}
                            />
                        </div>
                    </div>

                    <div id="search" className="flex flex-1 justify-end mt-7">
                        <Button
                            onClick={handleSearchData}
                            htmlType="submit"
                            className="text-black bg-blue-300 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-700 font-medium rounded-lg text-lg px-7 py-7 text-center dark:bg-blue-900 dark:hover:bg-blue-900 dark:focus:ring-blue-900">
                            Search
                        </Button>
                    </div>
                </div>
                <Alert message="กรอกข้อมูลให้ครบก่อนทำการค้นหา" type="warning" className="w-[20%] mt-2" showIcon />
            </div>

            <body className="mt-10">
                {/*process to produce
                <div className="container rounded-2xl border-2 border-blue-800 p-10 ml-3 bg-white justify-start w-[25%]">
                    <p className="text-lg text-black font-semibold">Process to produce</p>

                </div>*/}
                {/* Table */}
                <div className="overflow-x-auto p-4">
                    <table className="border-collapse border border-gray-400 w-full">
                        {/* Header */}
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-400 px-4 py-2" rowSpan={2}>จำนวน Part ประกอบ</th>
                                <th className="border border-gray-400 px-4 py-2" colSpan={1}>Process</th>
                                <th className="border border-gray-400 px-4 py-2" colSpan={1}>Qty Total</th>
                                {Array.from({ length: procNameLength }, (_, i) => (
                                    <th key={i} className="border border-gray-400 px-2 py-1 text-center">
                                        {i + 1}
                                    </th>
                                ))}
                            </tr>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-400 px-4 py-2">จำนวนCASEที่นับได้</th>
                                <th className="border border-gray-400 px-4 py-2">{headerSum}</th>
                                {Array.from({ length: procNameLength }, (_, i) => (
                                    <th key={i} className="border border-gray-400 px-2 py-2 text-center">
                                        <Input
                                            type="text"
                                            className="bg-yellow-50"
                                            value={headerValues[i]}
                                            onChange={(e) => handleHeaderInputChange(i, e)}
                                        />
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody>
                            {tableData.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-100">
                                    <td className="border border-gray-400 px-4 py-2 text-center">{row.usageQty}</td>
                                    <div className="flex flex-row">
                                        <td className="border px-4 py-4 w-1/2">{row.partNo}</td>
                                        <td className="border px-4 py-4 w-60">{row.proc_Name}</td>
                                    </div>
                                    <td className="border border-gray-400 px-4 py-2 text-center">0</td>

                                    {/* เปรียบเทียบ procName กับ partlistData */}
                                    {partlistData.map((partItem, partIndex) => {
                                        const isMatch = partItem.partNo.includes(row.partNo);

                                        return (
                                            <td key={partIndex} className="border border-gray-400 text-center">
                                                <div
                                                    className={`w-full h-full text-center mt-1 ${isMatch ? "bg-green-500" : "bg-white"}`}
                                                />
                                                {isMatch ? 0 : ""}
                                            </td>
                                        );
                                    })}

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