import { BOMInfo, Master, MasterData, MasterInterface, ModelList, PartListDetInfo, PartListQtyInfo, PropPartUsed, Wcno } from "@/interface/compressorcheck";
import { API_MASTER_CHECK_INVENTORY } from "@/service/master.service";
import { API_PARTLIST_CHECK_INVENTORY, API_SELECT_MODELLIST, API_SELECT_WCNO } from "@/service/partlist.service";
import { ClearOutlined, HomeOutlined, SearchOutlined } from "@ant-design/icons";
import { Alert, Button, Input, RefSelectProps, Select } from "antd"
import { ChangeEvent, useEffect, useRef, useState } from "react";
import "../index.css";
import "../assets/fonts/Nunito/Nunito-Regular.ttf"
import { API_EXPORTPARTLIST_SELECT, API_SAVE_INFO_INVENTORY } from "@/service/invsave.service";
import { useSelector } from "react-redux";
import { ReduxInterface } from "@/interface/main.interface";
import { toast, ToastContainer } from "react-toastify";
import Navbar from "@/components/main/navbar";
import { base } from "@/constants";


function AuditeeFill() {

    const redux: ReduxInterface = useSelector((state: any) => state.reducer)


    const [serach, setSearch] = useState<MasterInterface>({
        serach: false,
        load: false,
        message: '',
    })

    const [searchData, setSearchData] = useState<MasterData>({
        paramWCNO: '',
        paramModel: '',
        paramCodeModel: ''
    });


    const [tableData, setTableData] = useState<Master[]>([]);
    const [ProcessParts, setProcessPartsData] = useState<PropPartUsed[]>([]);
    const [oPartList, setPartList] = useState<PartListQtyInfo[]>([]);


    const [wcno, setWcno] = useState<Wcno[]>([]);
    const [modellist, setModelList] = useState<ModelList[]>([])

    const refWCNO = useRef<RefSelectProps>(null)
    const refModel = useRef<RefSelectProps>(null);
    const refCodemodel = useRef<RefSelectProps>(null);

    const [rev, setRev] = useState<string>("");


    const notifyErr = (msg: string) => {
        toast.error(`Err : ${msg}`);
    };

    const notifyOk = (msg: string) => {
        toast.success(`Ok : ${msg}`);
    };



    useEffect(() => {
        const fetchWcno = async () => {
            const wcnodata = await API_SELECT_WCNO();
            if (wcnodata.status !== false) {
                setWcno(wcnodata);
            } else {
                console.error("Error fetching wcno:", wcnodata.message);
            }
        };

        const fetchModellist = async () => {
            if (searchData.paramWCNO) {
                const modellistdata = await API_SELECT_MODELLIST(searchData.paramWCNO);
                console.log(modellist)
                if (modellistdata.status !== false) {
                    setModelList(modellistdata);
                } else {
                    console.error("Error fetching modellist:", modellistdata.message);
                }
            }
        };

        fetchWcno();
        fetchModellist();
    }, [searchData.paramWCNO]);



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

        //------------------ Get Master List
        let resSearch = await API_MASTER_CHECK_INVENTORY(searchData.paramWCNO, searchData.paramModel);

        if (Array.isArray(resSearch) && resSearch.length > 0) {
            setTableData(resSearch);
        } else {
            setTableData([]);
        }

        //------------------ Group By 
        let groupByPartlist: PropPartUsed[] = [];

        //------------------ Get Last Data
        let oLastPartListDatas = await API_EXPORTPARTLIST_SELECT(redux.authen.mSetInfo?.setCode!, searchData.paramWCNO, searchData.paramModel);

        //------------------ Set Part List Data
        let resPartlist = await API_PARTLIST_CHECK_INVENTORY(searchData.paramWCNO, searchData.paramModel);

        const arPartList: PartListQtyInfo[] = [];
        resPartlist.map((oItem: BOMInfo) => {




            let _calQty = 0;
            // ==== check have last data ====
            if (oLastPartListDatas != null) {

                const Lst: PartListDetInfo[] = oLastPartListDatas.filter((d: PartListDetInfo) =>
                    d.wcno == oItem.wcno && d.model == oItem.model && d.partNo == oItem.partNo && d.cm == oItem.cm && d.proc_Code == oItem.proc_Code);
                if (Lst.length > 0) {
                    _calQty = Lst[0].calQty;
                    // console.log(_calQty);

                    setRev(Lst[0].rev);
                }
            }
            // ==== check have last data ====

            // คำนวณค่าใหม่จาก _calQty และ usageQty
            let calculatedValue = 0;
            if (_calQty > 0 && oItem.usageQty > 0) {
                calculatedValue = _calQty / oItem.usageQty;
            }

            // Set part list 
            const data: PartListQtyInfo = {
                wcno: oItem.wcno, model: oItem.model, proc_Code: oItem.proc_Code, partNo: oItem.partNo, cm: oItem.cm, usageQty: oItem.usageQty, calQty: _calQty,
                ivSetCode: "",
                crBy: ""
            };
            arPartList.push(data);

            let indexOfProcName: number = groupByPartlist.findIndex((x: any) => x.procName == oItem.proc_Name);
            if (indexOfProcName != -1) {
                groupByPartlist[indexOfProcName].partNo = groupByPartlist[indexOfProcName].partNo.concat(oItem.partNo);
            } else {
                groupByPartlist.push({
                    procCode: oItem.proc_Code,
                    procName: oItem.proc_Name,
                    partNo: [oItem.partNo],
                    cm: [oItem.cm],
                    calculatedValue: calculatedValue // เก็บค่า calculatedValue ที่คำนวณแล้ว
                });
            }
        });

        // Set Part List data
        setPartList(arPartList);

        //------------------ Set Process Parts Data
        setProcessPartsData(groupByPartlist);

        //----------------- Set Header Values
        const calculatedHeaderValues = groupByPartlist.map((group) => {
            return group.calculatedValue || 0;
        });

        setHeaderValues(calculatedHeaderValues);
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
        // console.log(ClonePartList)
        const _val: number = parseInt(event.target.value) || 0;
        const oFindPartLists = oPartList.filter((x) => x.proc_Code === procode)

        oFindPartLists.forEach((item: PartListQtyInfo) => {
            const _calQty: number = item.usageQty * _val;

            const _idxData = oPartList.findIndex((x) => x.wcno === item.wcno && x.model === item.model && x.proc_Code == procode && x.partNo === item.partNo && x.cm === item.cm);
            // console.log(_idxData)
            ClonePartList[_idxData].calQty = _calQty;

        })
        setPartList(ClonePartList)
        // console.log("Data antire partlist:", oPartList)
    }

    const handleClear = async () => {
        if (headerValues) {
            setHeaderValues([]);
            setPartList([]);
            setTableData([])
            setSearchData({ paramWCNO: "", paramModel: "", paramCodeModel: "" })
            setProcessPartsData([])
        }
    }


    const handleSubmit = async () => {

        const clonedArray = oPartList.map(item => ({ ...item }));
        clonedArray.map((item) => {
            item.ivSetCode = redux.authen.mSetInfo?.setCode,
                item.crBy = redux.authen.sName
        })

        let submitinfo = await API_SAVE_INFO_INVENTORY(clonedArray)

        if (submitinfo != null) {
            notifyOk('Data Save Successfully')
        } else {
            notifyErr('The Infomation is incorrect')
        }

    }

    useEffect(() => {
    }, [headerValues, tableData, ProcessParts, oPartList]);


    return (
        <>
            <Navbar />
            <head className="flex flex-col px-8 py-8">
                <div>
                    <div className="flex flex-row justify-between items-center">
                        <p className="w-full mr-4 py-8 border border-gray-500 rounded-2xl bg-[#] text-3xl text-black font-bold text-center">
                            Finished Goods: Compressor (Assembly Line)
                            <hr className="mx-28 mt-2" />
                            <p className=" mt-2 text-2xl font-light">(Auditee)</p>
                        </p>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-4">
                                <span className="p-2 w-1/2 bg-[#F9F5EB] border border-black rounded-xl text-lg text-black font-semibold text-center">YYYYMM</span>
                                <div className="p-2 w-1/2 border border-black rounded-lg text-lg text-black font-semibold text-center">
                                    {redux.authen.mSetInfo?.ym}
                                </div>
                            </div>
                            <div className="flex flex-row gap-4">
                                <span className="p-2 bg-[#F9F5EB] border border-black rounded-lg text-lg text-black font-semibold">Vision</span>
                                <div className="p-2 border border-black rounded-lg text-lg text-black font-semibold w-40">
                                    {rev}
                                </div>
                            </div>
                            <div className="flex flex-row gap-4">
                                <span className="p-2 bg-[#F9F5EB] border border-black rounded-lg text-lg text-black font-semibold">Name</span>
                                <div className="p-2 border border-black rounded-lg text-lg text-black font-semibold w-40">
                                    {redux.authen.sName}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row gap-3">
                        <div className="flex justify-between gap-2">
                            <div className="mt-7 flex justify-between gap-2">
                                <span className="p-2.5 bg-[#607EAA] border border-black rounded-md text-lg text-white font-semibold text-center">W/C</span>
                                <Select
                                    ref={refWCNO}
                                    showSearch
                                    placeholder="Select W/C"
                                    optionFilterProp="label"
                                    className="w-52 h-14 border rounded-lg"
                                    value={searchData.paramWCNO}
                                    onChange={(value) => setSearchData({ ...searchData, paramWCNO: value, paramCodeModel: '', paramModel: '' })}
                                    options={wcno
                                        .filter((wc) =>
                                            (wc.wcno.startsWith("90") ||
                                                wc.wcno.startsWith("92")) &&
                                            wc.wcno !== '902' &&
                                            wc.wcno !== '926'
                                        )
                                        .map((wc) => ({ value: wc.wcno, label: wc.wcno }))
                                    }
                                />
                            </div>

                            <div className="mt-7 flex justify-between gap-2">
                                <span className="p-2.5 bg-[#607EAA] border border-black rounded-md text-lg text-white font-semibold items-center">Code Model</span>
                                <Select
                                    ref={refCodemodel}
                                    showSearch
                                    placeholder="Select Model"
                                    optionFilterProp="label"
                                    className="w-56 h-14 border rounded-lg"
                                    value={searchData.paramCodeModel}
                                    onChange={(value) => {
                                        const selectedCodeModel = modellist.find((mdl) => mdl.modelCode === value);
                                        setSearchData({ ...searchData, paramCodeModel: value, paramModel: selectedCodeModel?.model });
                                    }}
                                    options={modellist.map((mdl) => ({ value: mdl.modelCode, label: mdl.modelCode }))}
                                />
                            </div>
                            <div className="mt-7 flex justify-between gap-2">
                                <span className="p-2.5 bg-[#607EAA] border border-black rounded-md text-lg text-white font-semibold items-center">Model Name</span>
                                <Select
                                    ref={refModel}
                                    showSearch
                                    placeholder="Select Code Model"
                                    optionFilterProp="label"
                                    className="w-56 h-14 border rounded-lg"
                                    value={searchData.paramModel}
                                    onChange={(value) => {
                                        const selectModel = modellist.find((mdl) => mdl.model === value);
                                        setSearchData({ ...searchData, paramModel: value, paramCodeModel: selectModel?.modelCode })
                                    }}
                                    // onChange={(value) => setSearchData({ ...searchData, paramModel: value })}
                                    options={modellist.map((mdl) => ({ value: mdl.model, label: mdl.model }))}
                                />
                            </div>
                            <div id="search" className="flex flex-1 justify-end mt-7">
                                <Button
                                    onClick={handleSearchData}
                                    className="text-black focus:ring-4 focus:outline-none font-medium rounded-lg text-lg  py-7 flex items-center gap-2"
                                >
                                    <SearchOutlined className="text-xl" />
                                    Search
                                </Button>
                            </div>
                            <div id="clear" className="mt-7">
                                <button
                                    onClick={handleClear}
                                    type="submit"
                                    className="text-white bg-[#B8001F] hover:bg-[#B8001F]  focus:outline-none focus:ring-rose-700 font-medium rounded-lg text-lg px-5 py-3.5 text-center  dark:bg-rose-900 dark:hover:bg-rose-900 dark:focus:ring-rose-900">
                                    <ClearOutlined />
                                </button>
                            </div>
                        </div>
                    </div>
                    <Alert message="กรอกข้อมูลให้ครบก่อนทำการค้นหา" type="warning" className="w-[20%] mt-2" showIcon />
                </div>

                <body className="mt-10">

                    <div className="flex flex-row gap-3 justify-start mr-5">
                        <div id="clear" className="mt-9 ml-5">
                            <a
                                href={`/${base}/home`}
                                className="text-white bg-[#003092] hover:bg-[#003092]  focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-lg px-5 py-2.5 text-center  dark:bg-blue-900 dark:hover:bg-blue-900 dark:focus:ring-blue-900">
                                <HomeOutlined />
                            </a>
                        </div>
                        <div id="save" className="mt-7">
                            <button
                                onClick={handleSubmit}
                                className="text-white bg-green-600 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-600 font-medium rounded-lg text-lg px-5 py-2 text-center dark:bg-green-900 dark:hover:bg-green-900 dark:focus:ring-green-900">
                                Save
                            </button>
                        </div>
                    </div>
                    {/* <a href="/template/summerizegoods" className="text-blue-700 underline text-xl font-normal ml-5">Summary Part</a> */}
                    {/* Table */}
                    <div className="overflow-x-auto p-4">
                        <table className="border-collapse border border-gray-600 w-full">
                            {/* Header */}
                            <thead>
                                <tr className="bg-[#F9F5EB]">
                                    <th className="border border-gray-600 px-4 py-2" rowSpan={3}>จำนวน Part ประกอบ</th>
                                    <th className="border border-gray-600 px-4 py-2" rowSpan={3}>Drawing</th>
                                    <th className="border border-gray-600 px-4 py-2" rowSpan={3}>CM</th>
                                    <th className="border border-gray-600 px-4 py-2" rowSpan={3}>Part Name</th>
                                    <th className="border border-gray-600 px-4 py-2" rowSpan={2}>Qty Total</th>
                                    <th className="border border-gray-600 px-4 py-2" colSpan={ProcessParts.length}>Process</th>
                                </tr>
                                <tr className="bg-[#F9F5EB]">
                                    {ProcessParts.map((oItem: PropPartUsed, i: number) => (
                                        <th key={i} className="border border-gray-600 px-2 py-1 text-center text-sm">
                                            {i + 1} - {oItem.procName}
                                        </th>
                                    ))}
                                </tr>
                                <tr className="bg-[#F9F5EB]">
                                    <th className="border border-gray-600 px-4 py-2">{headerSum}</th>
                                    {ProcessParts.map((oItem: PropPartUsed, idx: number) => (
                                        <th key={idx} className="border border-gray-600 px-2 py-2 text-center">
                                            <Input
                                                type="text"
                                                className="bg-[#fbf6c0]"
                                                data-process={oItem.procCode}
                                                data-partno={oItem.partNo}
                                                data-cm={oItem.cm}
                                                value={headerValues[idx]}
                                                onChange={(e) => handleChange(idx, oItem.procCode, e)}
                                            />
                                        </th>
                                    ))}
                                </tr>
                            </thead>


                            {/* Body */}
                            <tbody>
                                {tableData.length > 0 ? (
                                    tableData.map((row, rowIndex) => (
                                        <tr key={rowIndex} className="hover:bg-gray-100">
                                            <td className="border border-gray-600 px-4 py-2 text-center">{row.usageQty}</td>
                                            <td className="border border-gray-600 px-4 py-4 w-30 whitespace-nowrap">{row.partNo}</td>
                                            <td className="border border-gray-600 px-4 py-4 w-20">{row.cm}</td>
                                            <td className="border border-gray-600 px-4 py-4 w-60">{row.partName}</td>
                                            <td className="border border-gray-600 px-4 py-2 text-center">
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
                                                    }, 0).toFixed(4)
                                                }
                                            </td>
                                            {
                                                ProcessParts.map((oItem: PropPartUsed, idx: number) => {
                                                    const oDatas: PartListQtyInfo[] = Array.isArray(oPartList) ? oPartList.filter((c) => c.wcno === row.wcno
                                                        && c.model === row.model && c.proc_Code === oItem.procCode
                                                        && c.partNo === row.partNo && c.cm === row.cm) : [];
                                                    return (
                                                        <td key={idx} className="border border-gray-600 text-center">
                                                            <div
                                                                className={`w-full h-full text-center mt-1 ${oDatas.length > 0 ? "bg-green-500" : "bg-white"}`}
                                                            />
                                                            {oDatas.length > 0 ? oDatas[0].calQty : ""}
                                                        </td>
                                                    )
                                                })
                                            }
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="border border-gray-400 px-4 py-2 text-center text-red-600"
                                        >
                                            ไม่พบข้อมูล ติดต่อคุณวรกานต์(เมย์) เบอร์ 208
                                        </td>
                                    </tr>

                                )}

                            </tbody>

                        </table>
                    </div>
                </body>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable={false}
                    pauseOnHover={false}
                    theme="light"
                />
            </head>
        </>


    )
}

export default AuditeeFill