import { BOMInfo, Master, MasterData, MasterInterface, PartListQtyInfo, PropPartUsed } from "@/interface/compressorcheck";
import { API_MASTER_CHECK_INVENTORY } from "@/service/master.service";
import { API_PARTLIST_CHECK_INVENTORY } from "@/service/partlist.service";
import { SearchOutlined } from "@ant-design/icons";
import { Alert, Button, Input, InputRef } from "antd"
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import "../index.css";
import "../assets/fonts/Nunito/Nunito-Regular.ttf"

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
    const [ProcessParts, setProcessPartsData] = useState<PropPartUsed[]>([]);

    const [oPartList, setPartList] = useState<PartListQtyInfo[]>([]);
    //const [isInitial, setIsInitial] = useState<boolean>(false);


    const refWCNO = useRef<InputRef>(null)
    const refModel = useRef<InputRef>(null);

    // const wcnoOptions = ["901", "902", "903"]



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

        if (searchData.paramWCNO || searchData.paramModel) {
            setSearchData({ paramWCNO: "", paramModel: "" });
        }

        // Clear data
        //setPartList([]);
        let resSearch = await API_MASTER_CHECK_INVENTORY(searchData.paramWCNO, searchData.paramModel);

        if (Array.isArray(resSearch) && resSearch.length > 0) {
            setTableData(resSearch);
        } else {
            setTableData([]);
        }

        let groupByPartlist: PropPartUsed[] = [];
        let resPartlist = await API_PARTLIST_CHECK_INVENTORY();
        // console.log('Data PartList:', resPartlist)
        const arPartList: PartListQtyInfo[] = [];
        resPartlist.map((oItem: BOMInfo) => {
            const data = { wcno: oItem.wcno, model: oItem.model, proc_Code: oItem.proc_Code, partNo: oItem.partNo, cm: oItem.cm, usageQty: oItem.usageQty, calQty: 0 };
            arPartList.push(data);

            // setPartList([ ...oPartList, ...[{ wcno: oItem.wcno, model: oItem.model, proc_Code: oItem.proc_Code, partNo: oItem.partNo, cm: oItem.cm, usageQty: oItem.usageQty, calQty: 0 }] ]);

            let indexOfProcName: number = groupByPartlist.findIndex((x: any) => x.procName == oItem.proc_Name)
            if (indexOfProcName != -1) {
                groupByPartlist[indexOfProcName].partNo = groupByPartlist[indexOfProcName].partNo.concat(oItem.partNo);
            } else {
                groupByPartlist.push({
                    procCode: oItem.proc_Code,
                    procName: oItem.proc_Name,
                    partNo: [oItem.partNo],
                    cm: [oItem.cm]
                })
            }
        });

        setPartList(arPartList);
        setProcessPartsData(groupByPartlist)
    }

    const [headerValues, setHeaderValues] = useState<number[]>(Array(ProcessParts.length).fill(0));
    const headerSum = headerValues.reduce((acc, val) => acc + val, 0);


    const handleChange = (index: number, procode: string, event: ChangeEvent<HTMLInputElement>) => {
        setHeaderValues(prev => {
            const newHeaderValues = [...prev];
            newHeaderValues[index] = parseInt(event.target.value) || 0;
            return newHeaderValues;
        })

        let ClonePartList = [...oPartList]
        console.log(ClonePartList)
        const _val: number = parseInt(event.target.value) || 0;
        const oFindPartLists = oPartList.filter((x) => x.proc_Code === procode)

        oFindPartLists.forEach((item: PartListQtyInfo) => {
            const _calQty: number = item.usageQty * _val;

            const _idxData = oPartList.findIndex((x) => x.wcno === item.wcno && x.model === item.model && x.proc_Code == procode && x.partNo === item.partNo && x.cm === item.cm);
            console.log(_idxData)
            ClonePartList[_idxData].calQty = _calQty;

        })
        setPartList(ClonePartList)
    }

    const handleClear = async () => {
        if (headerValues) {
            setHeaderValues([]);
        }
    }

    useEffect(() => {

    }, [headerValues, tableData, ProcessParts, oPartList]);





    return (
        <head className="flex flex-col px-8 py-8">
            <div>
                <div className="flex flex-row justify-between items-center">
                    {/* <span className="w-1/6 p-6 bg-blue-900 border-4 border-black text-2xl text-white font-semibold text-center">AUDITEE</span> */}
                    <p className="w-3/6 py-5 border rounded-2xl bg-[#1C3879] text-3xl text-white font-bold text-center">
                        Finished Goods: Compressor (Assembly Line)
                        <hr className="mx-28 mt-2" />
                        <p className=" mt-2 text-2xl font-light">(Auditee)</p>
                    </p>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-4">
                            <span className="p-2 w-1/2 bg-[#F9F5EB] border border-black rounded-xl text-lg text-black font-semibold text-center">YYYYMM</span>
                            <span className="p-2 bg-[#F9F5EB] border border-black rounded-lg text-lg text-black font-semibold">Vision:</span>
                            <div className="p-2 border border-black rounded-lg text-lg text-black font-semibold w-40"></div>
                        </div>
                        <div className="flex flex-row gap-4">
                            <div className="p-2 w-1/2 border border-black rounded-lg text-lg text-black font-semibold text-center">123123</div>
                            <span className="p-2 bg-[#F9F5EB] border border-black rounded-lg text-lg text-black font-semibold">Name:</span>
                            <div className="p-2 border border-black rounded-lg text-lg text-black font-semibold w-40"></div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row gap-3">
                    <div className="flex justify-between gap-2">
                        <div className="mt-7 flex justify-between gap-2">
                            <span className="p-3  bg-[#607EAA] border border-black rounded-md text-lg text-white font-semibold text-center">W/C</span>
                            <Input
                                ref={refWCNO}
                                type="text"
                                id="wc"
                                className="p-2.5 border border-black hover:border-black"
                                value={searchData.paramWCNO}
                                autoFocus onChange={(e) => setSearchData({ ...searchData, paramWCNO: e.target.value })}
                            />
                        </div>
                        <div className="mt-7 flex justify-between gap-2">
                            <span className="p-3 bg-[#607EAA] border border-black rounded-md text-lg text-white font-semibold items-center">Model Name</span>
                            <Input
                                ref={refModel}
                                type="text"
                                id="model"
                                className="w-56 p-2.5 border border-black hover:border-black"
                                value={searchData.paramModel}
                                autoFocus onChange={(e) => setSearchData({ ...searchData, paramModel: e.target.value })}
                            />
                        </div>
                        <div className="mt-7 flex justify-between gap-2">
                            <span className="p-3 bg-[#607EAA] border border-black rounded-md text-lg text-white font-semibold items-center">Code Model</span>
                            <Input
                                type="text"
                                id="codemodel"
                                className="w-56 p-2.5 border border-black hover:border-black"
                                value={codeModel}
                                onChange={(e) => setCodeModel(e.target.value)}
                            />
                        </div> <div id="search" className="flex flex-1 justify-end mt-7">
                            <Button
                                onClick={handleSearchData}
                                htmlType="submit"
                                className="text-black focus:ring-4 focus:outline-none font-medium rounded-lg text-lg  py-7 flex items-center gap-2"
                            >
                                <SearchOutlined className="text-xl" />
                                Search
                            </Button>
                        </div>
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
                            <tr className="bg-[#F9F5EB]">
                                <th className="border border-gray-400 px-4 py-2" rowSpan={2}>จำนวน Part ประกอบ</th>
                                <th className="border border-gray-400 px-4 py-2" rowSpan={2}>Process</th>
                                <th className="border border-gray-400 px-4 py-2" colSpan={1}>Qty Total</th>
                                {Array.from({ length: ProcessParts.length }, (_, i) => (
                                    <th key={i} className="border border-gray-400 px-2 py-1 text-center">
                                        {i + 1}
                                    </th>
                                ))}
                            </tr>
                            <tr className="bg-[#F9F5EB]">
                                <th className="border border-gray-400 px-4 py-2">{headerSum}</th>
                                {
                                    ProcessParts.map((oItem: PropPartUsed, idx: number) => {
                                        return (<th key={idx} className="border border-gray-400 px-2 py-2 text-center">
                                            <Input
                                                type="text"
                                                className="bg-[#EAE3D2]"
                                                data-process={oItem.procCode}
                                                data-partno={oItem.partNo}
                                                data-cm={oItem.cm}
                                                value={headerValues[idx]}
                                                onChange={(e) => {
                                                    handleChange(idx, oItem.procCode, e)
                                                }}
                                            />
                                        </th>);
                                    })
                                }
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
                                    <td className="border border-gray-400 px-4 py-2 text-center">
                                        {
                                            ProcessParts.reduce((total, oItem) => {
                                                const oDatas = Array.isArray(oPartList)
                                                    ? oPartList.filter((c) =>
                                                        c.wcno === row.wcno &&
                                                        c.model === row.model &&
                                                        c.proc_Code === oItem.procCode &&
                                                        c.partNo === row.partNo &&
                                                        c.cm === row.cm
                                                    )
                                                    : [];
                                                return total + oDatas.reduce((sum, item) => sum + (item.calQty || 0), 0);
                                            }, 0)
                                        }
                                    </td>
                                    {
                                        ProcessParts.map((oItem: PropPartUsed, idx: number) => {

                                            // const oDatas = Array.isArray(oPartList.data) ?
                                            const oDatas: PartListQtyInfo[] = Array.isArray(oPartList) ? oPartList.filter((c) => c.wcno === row.wcno
                                                && c.model === row.model && c.proc_Code === oItem.procCode
                                                && c.partNo === row.partNo && c.cm === row.cm) : [];
                                            return (
                                                <td key={idx} className="border border-gray-400 text-center">
                                                    <div
                                                        className={`w-full h-full text-center mt-1 ${oDatas.length > 0 ? "bg-green-500" : "bg-white"}`}
                                                    />
                                                    {oDatas.length > 0 ? oDatas[0].calQty : ""}
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

                <div className="flex flex-row gap-3 justify-end">
                    {/* <div id="adjust" className="mt-7">
                        <Button
                            className="text-black bg-yellow-200 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-700 font-medium rounded-lg text-lg px-7 py-7 text-center dark:bg-yellow-900 dark:hover:bg-yellow-900 dark:focus:ring-yellow-900">
                            Adjust
                        </Button>
                    </div> */}
                    <div id="clear" className="mt-7">
                        <button
                            onClick={handleClear}
                            type="submit"
                            className="text-white bg-[#B8001F] hover:bg-[#B8001F]  focus:outline-none focus:ring-rose-700 font-medium rounded-lg text-lg px-3 py-2 text-center  dark:bg-rose-900 dark:hover:bg-rose-900 dark:focus:ring-rose-900">
                            Clear
                        </button>
                    </div>
                    <div id="save" className="mt-7">
                        <button
                            className="text-white bg-green-600 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-600 font-medium rounded-lg text-lg px-3 py-2 text-center dark:bg-green-900 dark:hover:bg-green-900 dark:focus:ring-green-900">
                            Save
                        </button>
                    </div>
                </div>
            </body>
        </head>

    )
}

export default AuditeeFill