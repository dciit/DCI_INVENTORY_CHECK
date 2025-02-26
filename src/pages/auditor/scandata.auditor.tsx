import { useEffect, useRef, useState } from 'react';
import { InventoryInfo } from '@/interface/inventorycheck.interface';
import { Alert, Input, Select, Tabs } from 'antd';
import { API_PERSON_HISTORY_AUDITOR, API_TAG_RECORD_AUDITOR, API_TEG_SELECT_QR } from '@/service/tag.service';
import { ReduxInterface } from '@/interface/main.interface';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/main/navbar';
import Icon from '@ant-design/icons';
import { Wcno } from '@/interface/compressorcheck';
import { API_SELECT_WCNO } from '@/service/partlist.service';
import dayjs from 'dayjs';
import { HistoryPersonAuditor } from '@/interface/gentag.interface';


function AuditorScanData() {

    const navigate = useNavigate();
    const oAccount: ReduxInterface = useSelector((state: any) => state.reducer);
    const [isInitial, setisInitial] = useState<boolean>(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const [scannedData, setScannedData] = useState<string | null>(null);
    const [selectedInfo, setSelectedInfo] = useState<InventoryInfo[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);

    const [arWCNO, setarWCNO] = useState<Wcno[]>([]);
    const [srcWCNO, setSrcWCNO] = useState<string>("");
    const [srcPartNo, setSrcPartNo] = useState<string>("");
    const [srcCM, setSrcCM] = useState<string>("");
    const [history, setHistory] = useState<HistoryPersonAuditor[]>([]);

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

                } else if (oAccount.authen.role === "AUDITEE") {
                    navigate('/home');
                } else if (oAccount.authen.role === "AUDITOR") {
                    // navigate(`/home`);
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
                    name: 'Main Assembly L1'
                }, {
                    wcno: '901-FINAL',
                    sname: 'AFI1',
                    name: 'Final Line L1'
                }, {
                    wcno: '901-EXP',
                    sname: 'EXP1',
                    name: 'แตก Part L1'
                },
                {
                    wcno: '902-MAIN',
                    sname: 'AMA2',
                    name: 'Main Assembly L2'
                }, {
                    wcno: '902-FINAL',
                    sname: 'AFI2',
                    name: 'Final Line L2'
                }, {
                    wcno: '902-EXP',
                    sname: 'EXP2',
                    name: 'แตก Part L2'
                },
                {
                    wcno: '903-MAIN',
                    sname: 'AMA3',
                    name: 'Main Assembly L3'
                }, {
                    wcno: '903-FINAL',
                    sname: 'AFI3',
                    name: 'Final Line L3'
                }, {
                    wcno: '903-EXP',
                    sname: 'EXP3',
                    name: 'แตก Part L3'
                },
                {
                    wcno: '904-MAIN',
                    sname: 'AMA4',
                    name: 'Main Assembly L4'
                }, {
                    wcno: '904-FINAL',
                    sname: 'AFI4',
                    name: 'Final Line L4'
                }, {
                    wcno: '904-EXP',
                    sname: 'EXP4',
                    name: 'แตก Part L4'
                },
                {
                    wcno: '905-MAIN',
                    sname: 'AMA5',
                    name: 'Main Assembly L5'
                }, {
                    wcno: '905-FINAL',
                    sname: 'AFI5',
                    name: 'Final Line L5'
                }, {
                    wcno: '905-EXP',
                    sname: 'EXP5',
                    name: 'แตก Part L5'
                },
                {
                    wcno: '906-MAIN',
                    sname: 'AMA6',
                    name: 'Main Assembly L6'
                }, {
                    wcno: '906-FINAL',
                    sname: 'AFI6',
                    name: 'Final Line L6'
                }, {
                    wcno: '906-EXP',
                    sname: 'EXP6',
                    name: 'แตก Part L6'
                },
                {
                    wcno: '907-MAIN',
                    sname: 'AMA7',
                    name: 'Main Assembly L7'
                }, {
                    wcno: '907-FINAL',
                    sname: 'AFI7',
                    name: 'Final Line L7'
                }, {
                    wcno: '907-EXP',
                    sname: 'EXP7',
                    name: 'แตก Part L7'
                },
                {
                    wcno: '908-MAIN',
                    sname: 'AMA8',
                    name: 'Main Assembly L8'
                }, {
                    wcno: '908-FINAL',
                    sname: 'AFI8',
                    name: 'Final Line L8'
                }, {
                    wcno: '908-EXP',
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
            const codeReader = new BrowserMultiFormatReader();
            let stream: MediaStream | null = null;

            navigator.mediaDevices
                .getUserMedia({ video: { facingMode: "environment" } })
                .then((s) => {
                    stream = s;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.play();
                    }

                    codeReader.decodeFromVideoDevice(null, videoRef.current!, (result, err) => {
                        if (result) {
                            handleScan(result.getText(), stream, codeReader);
                        }
                        if (err && !(err instanceof NotFoundException)) setError(err.message);
                    });
                })
                .catch((err) => setError(err.message));

            return () => {
                if (stream) {
                    stream.getTracks().forEach((track) => track.stop());
                }
                codeReader.reset();
            };
        }
    }, [isScanning]);

    const handleScan = (result: string, stream: MediaStream | null, codeReader: BrowserMultiFormatReader) => {
        const cleanedStr = result.replace(/^"|"$/g, '');
        setScannedData(cleanedStr);
        setIsScanning(false);

        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        codeReader.reset();
    };


    const fetchQR = async () => {
        const param = {
            ivSetCode: oAccount.authen.mSetInfo?.setCode!,
            paramYM: oAccount.authen.mSetInfo?.ym!,
            QrCode: scannedData!
        };

        const qrItem = await API_TEG_SELECT_QR(param);

        console.log(typeof qrItem);

        if (typeof qrItem == 'object' && qrItem.length) {
            setSelectedInfo(qrItem);


            if (qrItem[0].auditeeQty > 0) {
                const auditorBy = qrItem[0].auditorBy ? qrItem[0].auditorBy : "Unknown user";
                const auditorDate = qrItem[0].auditorDate ? new Date(qrItem[0].auditorDate) : null;

                const auditeeDateFormatted = auditorDate && !isNaN(auditorDate.getTime())
                    ? auditorDate.toLocaleString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                    })
                    : "Invalid date";

                setAlertMessage(`This QR code has already been scanned by ${auditorBy} on ${auditeeDateFormatted}`);
            } else {
                setAlertMessage(null);
            }
        } else {
            setSelectedInfo([]);
            setAlertMessage("Product not found");
        }
    };

    useEffect(() => {
        fetchQR();
    }, [scannedData])


    const handelSearch = () => {
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

        const tempQr = `${oAccount.authen.mSetInfo?.setCode}|${oAccount.authen.mSetInfo?.ym}|${wcno}|${line}|${srcPartNo}|${srcCM}`;

        setScannedData(tempQr);
    };

    const handleInputData = async () => {
        if (selectedInfo.length > 0) {
            if (!selectedInfo[0].auditorQty) {
                setShowAlert(true);
                return;
            }
        }

        const clonedArray = selectedInfo.map(item => ({
            ...item,
            auditorQty: selectedInfo.length > 0 ? selectedInfo[0].auditorQty : 0,
            auditorBy: oAccount.authen.sName || "Unknown",
        }));

        try {
            for (const item of clonedArray) {
                const submitInfoQR = await API_TAG_RECORD_AUDITOR(
                    item.ivSetCode,
                    item.ym,
                    item.wcno,
                    item.partNo,
                    item.cm,
                    item.qrCode,
                    item.auditorQty ?? 0,
                    item.auditorBy
                );

                if (!submitInfoQR) {
                    throw new Error("API call failed for some records.");
                }
            }


            // load history
            handlePersonHistory();


            notifyOk("Data saved successfully");
            setSelectedInfo([]);
            setScannedData(null);

        } catch (error) {
            notifyErr("You couldn't Enter QTY");
        }
    };

    const onTabClick = () => {
        setSrcWCNO('');
        setSrcPartNo('');
        setSrcCM('');
        handelSearch();
    };


    const handlePersonHistory = async () => {
    
            const param = {
                ivSetCode: oAccount.authen.mSetInfo?.setCode!,
                paramYM: oAccount.authen.mSetInfo?.ym!,
                paramBy: oAccount.authen.sName!
            }
    
            const oResHistory = await API_PERSON_HISTORY_AUDITOR(param);
    
            if (Array.isArray(oResHistory) && oResHistory.length) {
                setHistory(oResHistory);
                console.log(oResHistory);
            } else {
                setHistory([]);
                setAlertMessage("ไม่พบประวัติการสแกนนี้ในระบบ");
            }
        };

    const tabs = [{
        label: `QRCode`, key: '0', children:
            <div className='flex flex-col justify-center'>
                {isScanning && (
                    <div className='flex justify-center'>
                        <video ref={videoRef} style={{ width: "70%" }} />
                        {error && <p style={{ color: "red" }}>Error: {error}</p>}
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
                <div className='flex flex-row justify-center mt-2'>
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
                    <div>
                        <Input
                            type="text"
                            id="srcPartNo"
                            placeholder="Part No"
                            className="w-3/4 border border-black hover:border-black bg-[#FFF5D7] hover:bg-[#FFF5D7]"
                            value={srcPartNo}
                            autoFocus
                            onChange={(e) => setSrcPartNo(e.target.value.toUpperCase())}
                        />
                    </div>
                </div>
                <div className='flex flex-row justify-center mt-1'>
                    <div className='w-1/3 text-center font-semibold'>CM</div>
                    <div>
                        <Input
                            type="text"
                            id="srcCM"
                            placeholder="CM"
                            className="w-3/4 border border-black hover:border-black bg-[#FFF5D7] hover:bg-[#FFF5D7]"
                            value={srcCM}
                            autoFocus
                            onChange={(e) => setSrcCM(e.target.value.toUpperCase())}
                        />
                    </div>
                </div>
                <div className='text-center mt-2 '>
                    <button
                        onClick={handelSearch}
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4 w-48"
                    >
                        ค้นหา
                    </button>
                </div>
            </div>, icon: <Icon />
    }, {
            label: `ประวัติ (History)`, key: '3', children:
                <div className='flex-col px-8 py-8'>
                    <div className="overflow-x-auto max-h-[700px]">
                        <span className='text-md'>จำนวนทั้งหมด {history.length} รายการ</span>
                        <table className="border-separate border-spacing-0 border border-gray-400 w-full table-fixed">
                            <thead>
                                <tr className="bg-[#F9F5EB]">
                                    <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2 shadow-md" >WC</th>
                                    <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2 shadow-sm" >Part</th>
                                    <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2 shadow-sm" >Qty</th>
                                    <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2 shadow-sm" >By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history && history.map((item, index) => (
                                    // oLineTyps.map((ln) => (
                                    <tr key={index} style={{ cursor: 'pointer' }}
                                        className="border-gray-200 hover:bg-gray-100 bg-white ">
                                        <td className="border border-gray-600 px-4 py-2 text-center">{item.wcno}</td>
                                        <td className="border border-gray-600 px-4 py-2 text-left">{item.partNo} {item.cm} ({item.tagNo})<br/>{item.partName}</td>
                                        <td className="border border-gray-600 px-4 py-2 text-right">{item.auditorQty}</td>
                                        <td className="border border-gray-600 px-4 py-2 text-center">{
                                            item.auditorBy != "" ? (
                                                <>
                                                    {item.auditorBy}<br />{dayjs(item.auditorDate).format("YYYY-MM-DD HH:mm")}
                                                </>
                                            ) : ``}
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
            <div className="flex flex-col min-h-screen p-2 bg-green-100">
                <div className='text-center text-md font-bold'>
                    AUDITOR บันทึกข้อมูล
                </div>
                <Tabs
                    defaultActiveKey="0"
                    centered
                    items={tabs}
                    onTabClick={onTabClick}
                />
                <hr className='py-3' />

                {selectedInfo && selectedInfo.length > 0 ? (
                    selectedInfo.map((item, idx) => (
                        <div className="flex flex-col items-center justify-center gap-3 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mt-2" key={idx}>
                            <div className="container w-full rounded-xl border border-black shadow-lg p-2 text-center bg-[#FBFBFB]">
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
                                            type="number"
                                            id="qty"
                                            placeholder="Enter QTY to inspect"
                                            className="w-3/4 border border-black hover:border-black bg-[#FFF5D7] hover:bg-[#FFF5D7]"
                                            value={item.auditeeQty}
                                            autoFocus
                                            onChange={(e) => {
                                                const inputValue = e.target.value.trim();
                                                let clone: InventoryInfo[] = selectedInfo;
                                                clone[0].auditeeQty = Number(inputValue);

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
                                            onClick={handleInputData}
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

export default AuditorScanData;
