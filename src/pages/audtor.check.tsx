import { BOMInfo, Master, MasterData, MasterInterface, ModelList, PartListDetInfo, PartListQtyInfo, PropPartUsed, Wcno } from "@/interface/compressorcheck";
import { ReduxInterface } from "@/interface/main.interface";
import { API_EXPORTPARTLIST_SELECT } from "@/service/invsave.service";
import { API_MASTER_CHECK_INVENTORY } from "@/service/master.service";
import { API_PARTLIST_CHECK_INVENTORY, API_SELECT_MODELLIST, API_SELECT_WCNO } from "@/service/partlist.service";
import { SearchOutlined } from "@ant-design/icons";
import { Alert, Button, Input, RefSelectProps, Select } from "antd"
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
// import Swal from "sweetalert2";


function AuditorFill() {

    const redux: ReduxInterface = useSelector((state: any) => state.reducer)

    const [serach, setSearch] = useState<MasterInterface>({
        serach: false,
        load: false,
        message: '',
    })

    const [searchData, setSearchData] = useState<MasterData>({
        paramWCNO: '',
        paramModel: '',
    })

    const [masterData, setMasterData] = useState<Master[]>([]);
    const [processParts, setProcessPartsData] = useState<PropPartUsed[]>([]);
    const [oPartList, setPartList] = useState<PartListQtyInfo[]>([]);


    const [wcno, setWcno] = useState<Wcno[]>([])
    const [modellist, setModelList] = useState<ModelList[]>([])

    const refWCNO = useRef<RefSelectProps>(null);
    const refModel = useRef<RefSelectProps>(null);


    // const notifyErr = (msg: string) => {
    //     toast.error(`Err : ${msg}`);
    // };

    // const notifyOk = (msg: string) => {
    //     toast.success(`Ok : ${msg}`);
    // };


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
            const modellistdata = await API_SELECT_MODELLIST();
            if (modellistdata.status !== false) {
                setModelList(modellistdata);
            } else {
                console.error("Error fetching modellist:", modellistdata.message);
            }
        };

        fetchWcno();
        fetchModellist();
    }, []);


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
            setMasterData(resSearch);
        } else {
            setMasterData([]);
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
                    console.log(_calQty);
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
                    calculatedValue: calculatedValue
                });
            }
        });

        // Set Part List data
        setPartList(arPartList);

        //------------------ Set Process Parts Data
        setProcessPartsData(groupByPartlist);

        //----------------- Set Header Values
        const calculatedHeaderValues = groupByPartlist.map((group) => {
            // ใช้ calculatedValue ที่ได้คำนวณไปก่อนหน้านี้
            // นำค่า calculatedValue ไปใช้แสดงใน input header
            return group.calculatedValue || 0;
        });

        setHeaderValues(calculatedHeaderValues);  // Update header with the calculated values
    }


    const [headerValues, setHeaderValues] = useState<number[]>(Array(processParts.length).fill(0));
    const headerSum = headerValues.reduce((acc, val) => acc + val, 0);


    const handleChange = (index: number, procode: string, event: ChangeEvent<HTMLInputElement>) => {
        setHeaderValues(prev => {
            const newHeaderValues = [...prev];
            newHeaderValues[index] = parseInt(event.target.value) || 0;
            return newHeaderValues;
        })

        let ClonePartList = [...oPartList]
        
        const _val: number = parseInt(event.target.value) || 0;
        const oFindPartLists = oPartList.filter((x) => x.proc_Code === procode)

        oFindPartLists.forEach((item: PartListQtyInfo) => {
            const _calQty: number = item.usageQty * _val;

            const _idxData = oPartList.findIndex((x) => x.wcno === item.wcno && x.model === item.model && x.proc_Code == procode && x.partNo === item.partNo && x.cm === item.cm);
            
            ClonePartList[_idxData].calQty = _calQty;

        })
        setPartList(ClonePartList)
    }

    // const handleClear = async () => {
    //     if (headerValues) {
    //         setHeaderValues([]);
    //         setPartList([]);
    //         setMasterData([])
    //         setSearchData({ paramWCNO: "", paramModel: "" })
    //         setProcessPartsData([])
    //     }
    // }


    // const handleSubmit = async () => {

    //     const clonedArray = oPartList.map(item => ({ ...item }));
    //     clonedArray.map((item) => {
    //         item.ivSetCode = redux.authen.mSetInfo?.setCode,
    //             item.crBy = redux.authen.sName
    //     })
    //     // console.log(clonedArray);

    //     let submitinfo = await API_SAVE_INFO_INVENTORY(clonedArray)

    //     if (submitinfo != null) {
    //         Swal.fire({
    //             icon: "success",
    //             title: "Your data has been saved",
    //             showConfirmButton: false,
    //             timer: 1500
    //         })
    //     } else {
    //         Swal.fire({
    //             icon: "error",
    //             title: "Your data hasn't been save",
    //             showConfirmButton: false,
    //             timer: 1500
    //         })
    //     }

    //     // console.log(submitinfo)
    // }

    useEffect(() => {
    }, [headerValues, masterData, processParts, oPartList])



    return (
        <head className="flex flex-col px-8 py-8">
            <div>
                <div className="flex flex-row justify-between items-center">
                    <p className="w-3/6 py-5 border rounded-2xl bg-[#1C3879] text-3xl text-white font-bold text-center">
                        Finished Goods: Compressor (Assembly Line)
                        <hr className="mx-28 mt-2" />
                        <p className=" mt-2 text-2xl font-light">(Auditor)</p>
                    </p>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-4">
                            <span className="p-2 w-1/2 bg-[#F9F5EB] border border-black rounded-xl text-lg text-black font-semibold text-center">YYYYMM</span>
                            <div className="p-2 w-1/2 border border-black rounded-lg text-lg text-black font-semibold text-center">123123</div>
                        </div>
                        <div className="flex flex-row gap-4">
                            <span className="p-2 bg-[#F9F5EB] border border-black rounded-lg text-lg text-black font-semibold">Vision</span>
                            <div className="p-2 border border-black rounded-lg text-lg text-black font-semibold w-40"></div>
                        </div>
                        <div className="flex flex-row gap-4">
                            <span className="p-2 bg-[#F9F5EB] border border-black rounded-lg text-lg text-black font-semibold">Name</span>
                            <div className="p-2 border border-black rounded-lg text-lg text-black font-semibold w-40"></div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row gap-3">
                    <div className="flex justify-between gap-2">
                        <div className="mt-7 flex justify-between gap-2">
                            <span className="p-3  bg-[#607EAA] border border-black rounded-md text-lg text-white font-semibold text-center">W/C</span>
                            <Select
                                ref={refWCNO}
                                showSearch
                                placeholder="Select a person"
                                optionFilterProp="label"
                                className="w-52 h-14 border rounded-lg"
                                value={searchData.paramWCNO}
                                onChange={(value) => setSearchData({ ...searchData, paramWCNO: value })}
                                options={wcno.map((wc) => ({ value: wc.wcno, label: wc.wcno }))}
                            />
                        </div>
                        <div className="mt-7 flex justify-between gap-2">
                            <span className="p-3 bg-[#607EAA] border border-black rounded-md text-lg text-white font-semibold items-center">Model Name</span>
                            <Select
                                ref={refModel}
                                showSearch
                                placeholder="เลือก Model"
                                optionFilterProp="label"
                                className="w-56 h-14 border rounded-lg"
                                value={searchData.paramModel}
                                onChange={(value) => setSearchData({ ...searchData, paramModel: value })}
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
                    </div>
                </div>
                <Alert message="กรอกข้อมูลให้ครบก่อนทำการค้นหา" type="warning" className="w-[20%] mt-2" showIcon />
            </div>

            <body className="mt-10">
                {/* Table */}
                <div className="overflow-x-auto p-4">
                    <table className="border-collapse border border-gray-400 w-full">
                        {/* Header */}
                        <thead>
                            <tr className="bg-[#F9F5EB]">
                                <th className="border border-gray-400 px-4 py-2" rowSpan={2}>จำนวน Part ประกอบ</th>
                                <th className="border border-gray-400 px-4 py-2" rowSpan={2}>Process</th>
                                <th className="border border-gray-400 px-4 py-2" colSpan={1}>Qty Total</th>
                                {Array.from({ length: processParts.length }, (_, i) => (
                                    <th key={i} className="border border-gray-400 px-2 py-1 text-center">
                                        {i + 1}
                                    </th>
                                ))}
                            </tr>
                            <tr className="bg-[#F9F5EB]">
                                <th className="border border-gray-600 px-4 py-2">{headerSum}</th>
                                {
                                    processParts.map((oItem: PropPartUsed, idx: number) => {
                                        return (
                                            <th key={idx} className="border border-gray-400 px-2 py-2 text-center">
                                                <Input
                                                    type="text"
                                                    className="bg-[#fbf6c0]"
                                                    data-process={oItem.procCode}
                                                    data-partno={oItem.partNo}
                                                    data-cm={oItem.cm}
                                                    value={headerValues[idx]}
                                                    onChange={(e) => {
                                                        handleChange(idx, oItem.procCode, e)
                                                    }}
                                                />
                                            </th>
                                        );
                                    })
                                }
                            </tr>
                        </thead>

                        {/* Body */}
                        <tbody>
                            {masterData.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-100">
                                    <td className="border border-gray-400 px-4 py-2 text-center">{row.usageQty}</td>
                                    <div className="flex flex-row">
                                        <td className="border px-4 py-4 w-1/2">{row.partNo}</td>
                                        <td className="border px-4 py-4 w-60">{row.proc_Name}</td>
                                    </div>
                                    <td className="border border-gray-400 px-4 py-2 text-center">
                                        {processParts.reduce((total, oItem) => {
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
                                        processParts.map((oItem: PropPartUsed, idx: number) => {
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



    )
}

export default AuditorFill