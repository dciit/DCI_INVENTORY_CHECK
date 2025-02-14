import { Valueinvcheck } from "@/interface/inventorycheck.interface"
import { Alert, Button, Input, InputRef } from "antd"
import { useRef, useState } from "react"


function InventoryCheck() {

    const [valuesData, setValuesData] = useState<Valueinvcheck>({
        qty: '',
    })
    const [showAlert, setShowAlert] = useState(false);
    const refQty = useRef<InputRef>(null)


    const hadleInputData = async () => {
        if (!valuesData.qty) {
            refQty.current?.focus();
            setShowAlert(true)
        } else {
            setShowAlert(false)
        }
        

        if (valuesData.qty) {
            setValuesData({ qty: ""});
            console.log(valuesData);
        }
    }
    return (
        <div className="flex items-center justify-center h-full bg-[#D4EBF8]">
            <div className="flex flex-col gap-3 w-[50%]">
                <div className="container w-full rounded-lg border border-black shadow-lg p-14 text-center bg-white">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-row justify-end">
                            <div className="w-1/3 p-3 border border-black rounded-md bg-[#FFF5D7] text-lg text-black font-semibold text-start">NAME:</div>
                        </div>
                        <div className="flex flex-row  mt-3 gap-5">
                            <span className="w-1/4 p-3 border border-black rounded-md bg-[#FFF5D7] text-lg text-black font-semibold items-center">YYYYMM</span>
                            <div className="p-3 border border-black rounded-md text-xl text-black font-semibold text-center w-full">202409</div>
                        </div>
                        <div className="flex flex-row mt-3 gap-5">
                            <span className="w-1/4 p-3 border border-black rounded-md bg-[#FFF5D7] text-lg text-black font-semibold items-center">WC</span>
                            <div className="p-3 border border-black rounded-md text-xl text-black font-semibold text-center w-full">901</div>
                        </div>
                        <div className="flex flex-row gap-5 mt-3">
                            <div className="w-1/4 items-center p-3 border border-black rounded-md bg-[#FFF5D7] text-xl text-black font-semibold">
                                DRAWING NO
                            </div>
                            <div className="p-3 border border-black rounded-md text-xl text-white font-semibold items-start w-3/4"></div>
                            <div className="w-1/5 items-start p-3 border border-black rounded-md text-lg text-black font-semibold">

                            </div>
                        </div>
                        <div className="flex flex-row mt-3 gap-5">
                            <span className="w-1/4 p-3 border border-black rounded-md bg-[#FFF5D7] text-lg text-black font-semibold items-center">PART NAME</span>
                            <div className="p-3 border border-black rounded-md text-xl text-white font-semibold items-start w-full"></div>
                        </div>
                        <div className="flex flex-row mt-8 gap-5">
                            <div className="w-1/4 items-center p-3 border border-black rounded-md bg-[#FFF5D7] text-xl text-black font-semibold">
                                QTY
                            </div>
                            <Input
                                ref={refQty}
                                type="number"
                                id="qty"
                                placeholder="Enter QTY to your inspect"
                                className="w-3/4 border border-black hover:border-black"
                                value={valuesData.qty}
                                autoFocus onChange={(e) => setValuesData({ qty: e.target.value })}
                            />
                            <div className="w-1/5 items-start p-3 border border-black rounded-md text-lg text-black font-semibold">

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
                        <div id="action" className='flexitems-center justify-center pt-[10px] mt-6'>
                            <button
                                onClick={hadleInputData}
                                type="submit"
                                className =' text-black bg-[#D4EBF8] hover:bg-[#D4EBF8] focus:ring-2 focus:outline-none focus:ring-[#D4EBF8] font-semibold rounded-lg border-black text-lg w-full sm:w-auto px-5 py-3 text-center dark:bg-blue-900 dark:hover:bg-blue-900 dark:focus:ring-blue-900'>
                                SAVE
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default InventoryCheck