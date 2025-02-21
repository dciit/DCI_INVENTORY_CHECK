import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { InventoryInfo, Valueinvcheck } from '@/interface/inventorycheck.interface';
import { Alert, Input, InputRef } from 'antd';
import { API_TAG_RECORD_AUDITEE, API_TEG_SELECT_QR } from '@/service/gentag.service';
import { ReduxInterface } from '@/interface/main.interface';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function AuditeeScanData() {

    const oAccount: ReduxInterface = useSelector((state: any) => state.reducer)

    const [valuesData, setValuesData] = useState<Valueinvcheck>({
        qty: 0,
    });

    const [showAlert, setShowAlert] = useState(false);
    const refQty = useRef<InputRef>(null);

    const [scannedData, setScannedData] = useState<string | null>(null);

    const [selectedInfo, setSelectedInfo] = useState<InventoryInfo[]>([]);

    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);



    const notifyErr = (msg: string) => {
        toast.error(`Err : ${msg}`);
    };

    const notifyOk = (msg: string) => {
        toast.success(`Ok : ${msg}`);
    };


    useEffect(() => {
        if (isScanning) {
            scannerRef.current = new Html5QrcodeScanner(
                "qr-scanner",
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                false
            );

            scannerRef.current.render(
                (qrCodeMessage) => {
                    handleScan(qrCodeMessage);
                    setIsScanning(false);
                },
                (errorMessage) => {
                    console.warn("QR Scan Error: ", errorMessage);
                }
            );
        }

        return () => {
            scannerRef.current?.clear();
        };
    }, [isScanning]);



    const handleScan = (result: string) => {
        const cleanedStr = result.replace(/^"|"$/g, '');
        setScannedData(cleanedStr);
    };

    const fetchQR = async () => {

        const param = {
            ivSetCode: oAccount.authen.mSetInfo?.setCode!,
            paramYM: oAccount.authen.mSetInfo?.ym!,
            QrCode: scannedData!
        }

        const qrItem = await API_TEG_SELECT_QR(param);

        if (qrItem) {
            setSelectedInfo(qrItem);
        } else {
            setSelectedInfo([]);
        }
    }

    useEffect(() => {
        fetchQR();
    }, [scannedData])


    const handleInputData = async () => {
        if (!valuesData.qty) {
            refQty.current?.focus();
            setShowAlert(true);
            return;
        }

        const clonedArray = selectedInfo.map(item => ({
            ...item,
            auditeeQty: valuesData.qty ? Number(valuesData.qty) : undefined,
            auditeeBy: oAccount.authen.sName || "Unknown"
        }));

        try {
            for (const item of clonedArray) {
                const submitInfoQR = await API_TAG_RECORD_AUDITEE(
                    item.ivSetCode,
                    item.ym,
                    item.wcno,
                    item.partNo,
                    item.cm,
                    item.qrCode,
                    item.auditeeQty ?? 0,
                    item.auditeeBy
                );

                if (!submitInfoQR) {
                    throw new Error("API call failed for some records.");

                }
            }

            notifyOk("Data saved successfully");
            setSelectedInfo([]);
            setScannedData(null);
            setValuesData({ qty: 0 });

        } catch (error) {
            notifyErr("You couldn't Enter QTY");
        }
        setShowAlert(false);
    };



    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-xl font-bold mb-4">QR Code Scanner</h1>
            {isScanning && (
                <div id="qr-scanner" style={{ width: '150px', height: '150px', border: '1px solid gray' }}></div>
            )}
            <br />
            <button
                onClick={() => setIsScanning(!isScanning)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
            >
                Start Scanner
            </button>


            {/* {scannedData && ( */}
            <div className="mt-4 p-2 bg-green-200 text-green-800 rounded"  >
                Scanned QR: {scannedData}
            </div>
            {/* )} */}

            {selectedInfo && selectedInfo.length > 0 ? (
                selectedInfo.map((item, idx: number) => (
                    <div className="flex flex-col  items-center justify-center gap-3 w-[50%] mt-2" key={idx}> {/* Add a key prop for list rendering */}
                        <div className="container w-[70%] rounded-xl border border-black shadow-lg p-10 text-center bg-[#FBFBFB]">
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-row justify-end">
                                    <div className="w-52 p-3 border border-black rounded-md bg-[#FFF5D7] text-lg text-black font-semibold text-start">
                                        NAME: {oAccount.authen.sName}
                                    </div>
                                </div>
                                <div className="flex flex-row mt-3 gap-5">
                                    <span className="w-[50%] p-3 border border-black rounded-md bg-[#FFF5D7] text-lg text-black font-semibold items-center">
                                        YYYYMM
                                    </span>
                                    <div className="bg-[#E8F9FF] p-3 border border-black rounded-md text-xl text-black font-semibold text-start w-full">{item.ym}</div>
                                </div>
                                <div className="flex flex-row mt-3 gap-5">
                                    <span className="w-[50%] p-3 border border-black rounded-md bg-[#FFF5D7] text-lg text-black font-semibold items-center">WC</span>
                                    <div className="bg-[#E8F9FF] p-3 border border-black rounded-md text-xl text-black font-semibold text-start w-full">{item.wcno}</div>
                                </div>
                                <div className="flex flex-row mt-3 gap-5">
                                    <span className="w-[50%] p-3 border border-black rounded-md bg-[#FFF5D7] text-lg text-black font-semibold items-center">LINE</span>
                                    <div className="bg-[#E8F9FF] p-3 border border-black rounded-md text-lg text-black font-semibold text-start w-full">
                                        {
                                            (item.lineType == "MAIN" || item.lineType == "FINAL") ? `${item.lineType} LINE ${item.wcno.substring(2, 3)}` : item.wcnO_NAME
                                        }
                                    </div>
                                </div>
                                <div className="flex flex-row gap-5 mt-3">
                                    <div className="w-[50%] items-center p-3 border border-black rounded-md bg-[#FFF5D7] text-lg text-black font-semibold">
                                        DRAWING NO
                                    </div>
                                    <div className="bg-[#E8F9FF] p-3 border border-black rounded-md text-xl text-black font-semibold text-start w-3/4">{item.partNo}</div>
                                    <div className="w-1/5 items-start p-3 border rounded-md bg-[#D7E5CA] text-lg text-black font-semibold">
                                        {item.cm}
                                    </div>
                                </div>
                                <div className="flex flex-row mt-3 gap-5">
                                    <span className="w-[50%] p-3 border border-black rounded-md bg-[#FFF5D7] text-lg text-black font-semibold items-center">PART NAME</span>
                                    <div className="bg-[#E8F9FF] p-3 border border-black rounded-md text-xl text-black font-semibold text-start w-full">{item.partName}</div>
                                </div>
                                {/* auditee check */}
                                <div className="flex flex-row mt-4 gap-5">
                                    <div className="w-[50%] items-center p-3 border border-black rounded-md bg-[#FFF5D7] text-lg text-black font-semibold">
                                        QTY
                                    </div>
                                    <Input
                                        ref={refQty}
                                        type="number"
                                        id="qty"
                                        placeholder="Enter QTY to your inspect"
                                        className="w-3/4 border border-black hover:border-black"
                                        value={valuesData.qty}
                                        autoFocus
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            setValuesData({ qty: inputValue ? Number(inputValue) : "" });
                                        }}
                                    />
                                    <div className="w-1/5 items-start p-3 border rounded-md bg-[#D7E5CA] text-lg text-black font-semibold">
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
                                <Alert className='mt-5 h-7' message="Enter tho total number before saving" type="warning" showIcon />
                                <div id="action" className="flexitems-center justify-center pt-[10px] mt-6">
                                    <button
                                        onClick={handleInputData}
                                        type="submit"
                                        className="text-black bg-[#D4EBF8] hover:bg-[#D4EBF8] focus:ring-2 focus:outline-none focus:ring-[#D4EBF8] font-semibold rounded-lg border-black text-lg w-full sm:w-auto px-36 py-3 text-center dark:bg-blue-900 dark:hover:bg-blue-900 dark:focus:ring-blue-900"
                                    >
                                        SAVE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : scannedData ? (
                <p className="mt-4 text-red-500">Product not found</p>
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
    );
};

export default AuditeeScanData;
