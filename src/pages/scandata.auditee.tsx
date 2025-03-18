import { useEffect, useRef, useState } from 'react';
import { InventoryInfo } from '@/interface/inventorycheck.interface';
import { Alert, Input, InputRef, Select, Tabs } from 'antd';
import { API_PERSON_HISTORY_AUDITEE, API_TAG_RECORD_AUDITEE, API_TEG_SELECT_QR } from '@/service/tag.service';
import { ReduxInterface } from '@/interface/main.interface';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
// import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { useNavigate } from 'react-router-dom';
import dayjs from "dayjs";
import Navbar from '@/components/main/navbar';
import Icon from '@ant-design/icons';
import { Wcno } from '@/interface/compressorcheck';
import { API_SELECT_WCNO } from '@/service/partlist.service';
import { HistoryPersonAuditee } from '@/interface/gentag.interface';
import { version } from '@/constants';
import QrScanner from "qr-scanner";


function AuditeeScanDatatest() {

    const navigate = useNavigate();
    const oAccount: ReduxInterface = useSelector((state: any) => state.reducer);
    const [isInitial, setisInitial] = useState<boolean>(false);


    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const refQty = useRef<InputRef>(null);

    const [scannedData, setScannedData] = useState<string | null>(null);
    const [selectedInfo, setSelectedInfo] = useState<InventoryInfo[]>([]);
    const [history, setHistory] = useState<HistoryPersonAuditee[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const videoRef = useRef(null);
    const [error, setError] = useState<string | null>(null);
    //  const videoElementRef = useRef(null);
    let qrScanner: QrScanner | null = null;

    const [arWCNO, setarWCNO] = useState<Wcno[]>([]);
    const [srcWCNO, setSrcWCNO] = useState<string>("");
    const [srcPartNo, setSrcPartNo] = useState<string>("");
    const [srcCM, setSrcCM] = useState<string>("");

    const unitNotDigit = ['SET', 'PCS', 'UN'];

    const notifyErr = (msg: string) => {
        toast.error(`Err : ${msg}`);
    };

    const notifyOk = (msg: string) => {
        toast.success(`Ok : ${msg}`);
    };


    useEffect(() => {
        if (!isInitial) {
            if (oAccount != null) {
                if (oAccount.authen.role === "ADMIN") {

                } else if (oAccount.authen.role === "MANAGEMENT") {

                } else if (oAccount.authen.role === "AUDITEE") {
                    // navigate('/home');
                } else if (oAccount.authen.role === "AUDITOR") {
                    navigate(`/home`);
                } else {
                    navigate(`/login`);
                }
            } else {
                navigate(`/login`);
            }

            // get wcno 
            const wcnodata = API_SELECT_WCNO();
            wcnodata.then((resdata) => {
                //setarWCNO(resdata);

                const oResWCNO = resdata.filter((wc: any) =>
                    !wc.wcno.startsWith("6") &&
                    !wc.wcno.startsWith("7") &&
                    !wc.wcno.startsWith("90") &&
                    !wc.wcno.startsWith("94")
                );

                const mergeWCNO = [...oResWCNO, ...[{
                    wcno: '901-MAIN',
                    sname: 'AMA1',
                    name: 'MAIN Assembly L1'
                }, {
                    wcno: '901-FINAL',
                    sname: 'AFI1',
                    name: 'FINAL Line L1'
                }, {
                    wcno: '901-EXPLODE',
                    sname: 'EXP1',
                    name: 'แตก Part L1'
                },
                {
                    wcno: '902-MAIN',
                    sname: 'AMA2',
                    name: 'MAIN Assembly L2'
                }, {
                    wcno: '902-FINAL',
                    sname: 'AFI2',
                    name: 'FINAL Line L2'
                }, {
                    wcno: '902-EXPLODE',
                    sname: 'EXP2',
                    name: 'แตก Part L2'
                },
                {
                    wcno: '903-MAIN',
                    sname: 'AMA3',
                    name: 'MAIN Assembly L3'
                }, {
                    wcno: '903-FINAL',
                    sname: 'AFI3',
                    name: 'FINAL Line L3'
                }, {
                    wcno: '903-EXPLODE',
                    sname: 'EXP3',
                    name: 'แตก Part L3'
                },
                {
                    wcno: '904-MAIN',
                    sname: 'AMA4',
                    name: 'MAIN Assembly L4'
                }, {
                    wcno: '904-FINAL',
                    sname: 'AFI4',
                    name: 'FINAL Line L4'
                }, {
                    wcno: '904-EXPLODE',
                    sname: 'EXP4',
                    name: 'แตก Part L4'
                },
                {
                    wcno: '905-MAIN',
                    sname: 'AMA5',
                    name: 'MAIN Assembly L5'
                }, {
                    wcno: '905-FINAL',
                    sname: 'AFI5',
                    name: 'FINAL Line L5'
                }, {
                    wcno: '905-EXPLODE',
                    sname: 'EXP5',
                    name: 'แตก Part L5'
                },
                {
                    wcno: '906-MAIN',
                    sname: 'AMA6',
                    name: 'MAIN Assembly L6'
                }, {
                    wcno: '906-FINAL',
                    sname: 'AFI6',
                    name: 'FINAL Line L6'
                }, {
                    wcno: '906-EXPLODE',
                    sname: 'EXP6',
                    name: 'แตก Part L6'
                },
                {
                    wcno: '907-MAIN',
                    sname: 'AMA7',
                    name: 'MAIN Assembly L7'
                }, {
                    wcno: '907-FINAL',
                    sname: 'AFI7',
                    name: 'FINAL Line L7'
                }, {
                    wcno: '907-EXPLODE',
                    sname: 'EXP7',
                    name: 'แตก Part L7'
                },
                {
                    wcno: '908-MAIN',
                    sname: 'AMA8',
                    name: 'MAIN Assembly L8'
                }, {
                    wcno: '908-FINAL',
                    sname: 'AFI8',
                    name: 'FINAL Line L8'
                }, {
                    wcno: '908-EXPLODE',
                    sname: 'EXP8',
                    name: 'แตก Part L8'
                }]]
                setarWCNO(mergeWCNO);


            });

            // load history 
            handlePersonHistory();


            setisInitial(true);
        }

    }, [])


    useEffect(() => {
        if (isScanning) {
            const video = videoRef.current;
            if (!video) return;

            qrScanner = new QrScanner(
                video,
                (result) => {
                    handleScan(result.data);
                },
                {
                    returnDetailedScanResult: true,
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                }
            );

            qrScanner
                .start()
                .catch((err) => setError(err.message));
        }

        return () => {
            if (qrScanner) {
                qrScanner.stop();
                qrScanner.destroy();
            }
        };
    }, [isScanning]);

    const handleScan = (result: string) => {
        const cleanedStr = result.replace(/^"|"$/g, '');
        setScannedData(cleanedStr);
        setIsScanning(false);
        console.log(cleanedStr)
    };




    const fetchQR = async () => {
        console.time("fetchQR Time"); 
        const param = {
            ivSetCode: 'SET20250217WPDC3U608341659000001',
            paramYM: '202502',
            QrCode: scannedData!
        };

        const qrItem = await API_TEG_SELECT_QR(param);
         console.timeEnd("fetchQR Time");

        if (typeof qrItem == 'object' && qrItem.length) {
            setSelectedInfo(qrItem);


            if (qrItem[0].auditeeQty > 0) {
                const auditeeBy = qrItem[0].auditeeBy ? qrItem[0].auditeeBy : "Unknown user";
                const auditeeDate = qrItem[0].auditeeDate ? new Date(qrItem[0].auditeeDate) : null;


                setAlertMessage(`บันทึกล่าสุดเมื่อ ${dayjs(auditeeDate).format("DD/MMM/YYYY HH:mm")} โดย ${auditeeBy}`);
            } else {
                setAlertMessage(null);
            }

        } else {
            setSelectedInfo([]);
            setAlertMessage("ไม่พบข้อมูล QrCode นี้ในระบบ");
        }
    };


    console.log(selectedInfo)

    useEffect(() => {
        if (scannedData) {
            fetchQR();
        }
    }, [scannedData]);


    const handleSearch = () => {
        let wcno = "";
        let line = "LINE";
        if (srcWCNO.startsWith("90")) {
            if (srcWCNO.includes('-')) {
                if ((srcWCNO.split('-')).length > 0) {
                    wcno = srcWCNO.split('-')[0];
                    line = srcWCNO.split('-')[1];
                }
            }
        } else {
            wcno = srcWCNO;
        }

        const tempQr = `'SET20250217WPDC3U608341659000001'|'202502'|${wcno}|${line}|${srcPartNo}|${srcCM}`;

        setScannedData(tempQr);
    };


    const handlePersonHistory = async () => {

        const param = {
            ivSetCode: oAccount.authen.mSetInfo?.setCode!,
            paramYM: oAccount.authen.mSetInfo?.ym!,
            paramBy: oAccount.authen.sName!
        }

        const oResHistory = await API_PERSON_HISTORY_AUDITEE(param);

        if (Array.isArray(oResHistory) && oResHistory.length) {
            setHistory(oResHistory);
            console.log(oResHistory);
        } else {
            setHistory([]);
            setAlertMessage("ไม่พบประวัติการสแกนนี้ในระบบ");
        }
    };



    const handleSaveData = async () => {
        if (selectedInfo.length > 0) {
            if (Number(selectedInfo[0].auditeeQty) < 0) {
                refQty.current?.focus();
                setShowAlert(true);
                return;
            }
        }

        const clonedArray = selectedInfo.map(item => ({
            ...item,
            auditeeQty: selectedInfo.length > 0 ? selectedInfo[0].auditeeQty : 0,
            auditeeBy: oAccount.authen.sName || "Unknown"
        }));
        try {
            for (const item of clonedArray) {

                // console.log(item)
                const submitInfoQR = await API_TAG_RECORD_AUDITEE(
                    item.ivSetCode,
                    item.ym,
                    item.wcno,
                    item.partNo,
                    item.cm,
                    item.qrCode,
                    item.auditeeQty,
                    item.auditeeBy
                );

                if (submitInfoQR.status.toUpperCase() == "TRUE") {

                    // load history 
                    handlePersonHistory();

                    notifyOk("บันทึกสำเร็จ");
                    setSelectedInfo([]);
                    setScannedData(null);
                } else {
                    notifyErr(submitInfoQR.message);

                }
            }




        } catch (error) {
            notifyErr("ไม่สามารถบันทึกในระบบได้");
        }
        setShowAlert(false);
    };

    const onTabClick = () => {
        setSrcWCNO('');
        setSrcPartNo('');
        setSrcCM('');
        handleSearch();
    };



    const tabs = [{
        label: `QRCode`, key: '0', children:
            <div className='flex flex-col justify-center'>
                {isScanning && (
                    <div className="flex justify-center">
                        <video ref={videoRef} style={{ width: "20%" }} />
                        {error && <p style={{ color: "red" }}>Error: {error}</p>}
                        <p className="scannedText">SCANNED: {scannedData}</p>
                    </div>
                )}
                <br />
                <button
                    onClick={() => {
                        setScannedData('');
                        setIsScanning(!isScanning);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
                >
                    {!isScanning ? `Start Camera (เปิดกล้อง)` : `Stop Camera (ปิดกล้อง)`}
                </button>
            </div>,
        icon: <Icon />
    }, {
        label: `Maual`, key: '1', children:
            <div className='border border-solid border-black rounded-md p-1'>
                <div className='flex flex-row justify-center mt-3'>
                    <div className='w-1/3 text-center font-semibold'>WCNO</div>
                    <div>
                        <Select
                            showSearch
                            placeholder="W/C"
                            optionFilterProp="label"
                            className="w-[185px] h-9 border border-black rounded-lg bg-[#FFF5D7] hover:bg-[#FFF5D7]"
                            value={srcWCNO}
                            onChange={(val) => setSrcWCNO(val)}
                            options={(arWCNO.length > 0) ? arWCNO.map((wc) => ({ value: wc.wcno, label: `${wc.wcno} : ${wc.name}` }))
                                : []}
                        />

                    </div>
                </div>
                <div className='flex flex-row justify-center mt-1'>
                    <div className='w-1/3 text-center font-semibold'>PART NO</div>
                    <div><Input
                        type="text"
                        id="srcPartNo"
                        placeholder="Part No"
                        className="w-3/4 border border-black hover:border-black bg-[#FFF5D7] hover:bg-[#FFF5D7]"
                        value={srcPartNo}
                        autoFocus
                        onChange={(e) => setSrcPartNo(e.target.value.toUpperCase())}
                    /></div>
                </div>
                <div className='flex flex-row justify-center mt-1'>
                    <div className='w-1/3 text-center font-semibold'>CM</div>
                    <div><Input
                        type="text"
                        id="srcCM"
                        placeholder="CM"
                        className="w-3/4 border border-black hover:border-black bg-[#FFF5D7] hover:bg-[#FFF5D7]"
                        value={srcCM}
                        autoFocus
                        onChange={(e) => setSrcCM(e.target.value.toUpperCase())}
                    /></div>
                </div>
                <div className='text-center mt-2 '>
                    <button
                        onClick={handleSearch}
                        type="button"
                        className="bg-blue-500 text-white px-8 py-2 rounded-lg mb-4 xs:w-full sm:w-full md:w-52 lg:w-52 xl:w-52"
                    >
                        ค้นหา
                    </button>
                </div>
            </div>, icon: <Icon />
    }, {
        label: `ประวัติ (History)`, key: '3', children:
            <div className="flex flex-col px-4 py-4">
                <div className="relative overflow-x-auto max-h-[700px] w-full">
                    <span className="text-md">จำนวนทั้งหมด {history.length} รายการ</span>
                    <table className="min-w-full text-sm border-separate border-spacing-0 border border-gray-400 table-fixed">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr className="bg-[#F9F5EB]">
                                <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-2 py-2 shadow-md">WC</th>
                                <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-2 py-2 shadow-sm">Part</th>
                                <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-2 py-2 shadow-sm">Qty</th>
                                <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-2 py-2 shadow-sm">By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history && history.map((item, index) => (
                                <tr key={index} className="border-gray-200 hover:bg-gray-100 bg-white">
                                    <td className="border border-gray-600 px-2 py-2 text-center whitespace-nowrap">{item.wcno}</td>
                                    <td className="border border-gray-600 px-2 py-2 text-left whitespace-nowrap">
                                        {item.partNo} {item.cm} ({item.tagNo})<br />{item.partName}
                                    </td>
                                    <td className="border border-gray-600 px-2 py-2 text-right whitespace-nowrap">{item.auditeeQty}</td>
                                    <td className="border border-gray-600 px-2 py-2 text-center whitespace-nowrap">
                                        {item.auditeeBy !== "" ? (
                                            <>
                                                {item.auditeeBy}<br />{dayjs(item.auditeeDate).format("YYYY-MM-DD HH:mm")}
                                            </>
                                        ) : ""}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

    }]

    return (
        <>
            <Navbar />
            <div className="flex flex-col min-h-screen p-2 bg-sky-50">
                <div className='text-center text-md font-bold'>
                    AUDITEE บันทึกข้อมูล V{version}
                </div>
                <Tabs
                    defaultActiveKey="0"
                    centered
                    items={tabs}
                    onTabClick={onTabClick}
                />
                <hr className='py-3 border-gray-300 mt-4' />

                <div className='flex justify-center items-center'>
                    {selectedInfo && selectedInfo.length > 0 ? (
                        selectedInfo.map((item, idx) => (
                            <div className="flex justify-center gap-3 w-full sm:w-3/4 md:w-2/3 lg:w-1/2" key={idx}>
                                <div className="container w-full mx-3 sm:w-[80%] md:w-[100%] rounded-xl border border-black shadow-lg p-2 text-center bg-[#FBFBFB]">
                                    <div className="flex flex-col gap-3">
                                        <div className="flex flex-row mt-3 gap-5">
                                            <span className="w-1/2 p-1 border border-black rounded-md bg-white text-md text-black font-semibold items-center">
                                                YYYYMM
                                            </span>
                                            <div className="bg-[#E8F9FF] p-1 border border-black rounded-md text-md text-black font-semibold text-start w-full">
                                                {item.ym}
                                            </div>
                                        </div>
                                        <div className="flex flex-row mt-3 gap-5">
                                            <span className="w-1/2 p-1 border border-black rounded-md bg-white text-md text-black font-semibold items-center">
                                                WC
                                            </span>
                                            <div className="bg-[#E8F9FF] p-1 border border-black rounded-md text-md text-black font-semibold text-start w-full">
                                                {item.wcno}
                                            </div>
                                        </div>
                                        <div className="flex flex-row mt-3 gap-5">
                                            <span className="w-1/2 p-1 border border-black rounded-md bg-white text-md text-black font-semibold items-center">
                                                LINE
                                            </span>
                                            <div className="bg-[#E8F9FF] p-1 border border-black rounded-md text-md text-black font-semibold text-start w-full">
                                                {item.lineType === "MAIN" || item.lineType === "FINAL"
                                                    ? `${item.lineType} LINE ${item.wcno.substring(2, 3)}`
                                                    : (item.lineType === "EXPLODE") ? `แตก Part LINE  ${item.wcno.substring(2, 3)}` : item.wcnO_NAME}
                                            </div>
                                        </div>
                                        <div className="flex flex-row gap-5 mt-3">
                                            <div className="w-1/2 items-center p-1 border border-black rounded-md bg-white text-md text-black font-semibold">
                                                DRAWING NO
                                            </div>
                                            <div className="bg-[#E8F9FF] p-1 border border-black rounded-md text-md text-black font-semibold text-start w-3/4">
                                                {item.partNo}
                                            </div>
                                            <div className="w-1/5 items-start p-1 border border-black rounded-md bg-[#E8F9FF] text-md text-black font-semibold">
                                                {item.cm}
                                            </div>
                                        </div>
                                        <div className="flex flex-row mt-3 gap-5">
                                            <span className="w-1/2 p-1 border border-black rounded-md bg-white text-md text-black font-semibold items-center">
                                                PART NAME
                                            </span>
                                            <div className="bg-[#E8F9FF] p-1 border border-black rounded-md text-md text-black font-semibold text-start w-full">
                                                {item.partName}
                                            </div>
                                        </div>

                                        <div className="flex flex-row mt-4 gap-5">
                                            <div className="w-1/2 items-center p-1 border border-black rounded-md bg-white text-md text-black font-semibold">
                                                QTY
                                            </div>
                                            <Input
                                                ref={refQty}
                                                type="number"
                                                id="qty"
                                                placeholder="Enter QTY to inspect"
                                                className="w-3/4 border border-black hover:border-black bg-[#FFF5D7] hover:bg-[#FFF5D7]"
                                                value={item.auditeeQty}
                                                autoFocus
                                                onChange={(e) => {
                                                    const inputValue = e.target.value.trim();
                                                    let clone: InventoryInfo[] = selectedInfo;
                                                    clone[0].auditeeQty = inputValue;

                                                    if (unitNotDigit.includes(item.whum.toUpperCase().trim())) {
                                                        if (inputValue.includes('.')) { return; }
                                                    } else {
                                                        if (inputValue.includes('.')) {

                                                            if (inputValue.split('.')[1].length > 2) {
                                                                return;
                                                            }

                                                            if (inputValue.split('.').length > 2) {
                                                                return;
                                                            }
                                                        }
                                                    }

                                                    if (Number(inputValue) > 1000000) { return; }

                                                    setSelectedInfo([...clone])
                                                }}
                                            />
                                            <div className="w-1/5 items-start p-1 border border-black rounded-md bg-[#E8F9FF] text-md text-black font-semibold">
                                                {item.whum}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {showAlert && (
                                            <Alert
                                                className="mt-4"
                                                message="Please input the values for this drawing"
                                                type="warning"
                                                showIcon
                                                closable
                                                onClose={() => setShowAlert(false)}
                                            />
                                        )}

                                        {alertMessage && (
                                            <Alert className="mt-5 h-10" message={alertMessage} type="warning" showIcon />
                                        )}

                                        <div id="action" className="flex items-center justify-center pt-[10px] mt-6">
                                            <button
                                                onClick={handleSaveData}
                                                type="submit"
                                                className="text-black bg-[#D4EBF8] hover:bg-[#D4EBF8] focus:ring-2 focus:outline-none focus:ring-[#D4EBF8] font-semibold rounded-lg border-black text-lg w-full sm:w-auto px-36 py-3 text-center dark:bg-blue-900 dark:hover:bg-blue-900 dark:focus:ring-blue-900"
                                            >
                                                บันทึก
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : scannedData ? (
                        <p className="mt-4 text-red-500">ไม่พบข้อมูล QrCode นี้ในระบบ</p>
                    ) : null}
                </div>

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
            </div >
        </>

    );
};

export default AuditeeScanDatatest;
