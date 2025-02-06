import { Button, Input } from "antd"

function InventoryCheck() {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="flex flex-col gap-3 w-[50%]">
                <div className="container w-full rounded border border-black shadow-lg p-14 text-center bg-white">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-row justify-end">
                            <div className="p-3 border bg-blue-900 text-lg text-white font-semibold items-center">NAME:</div>
                        </div>
                        <div className="flex flex-row  mt-3 gap-5">
                            <span className="w-1/4 p-3 border bg-blue-900 text-lg text-white font-semibold items-center">YYYYMM</span>
                            <div className="p-3 border bg-blue-900 text-xl text-white font-semibold items-start w-full">202409</div>
                        </div>
                        <div className="flex flex-row mt-3 gap-5">
                            <span className="w-1/4 p-3 border bg-blue-900 text-lg text-white font-semibold items-center">WC</span>
                            <div className="p-3 border bg-blue-900 text-xl text-white font-semibold items-start w-full"></div>
                        </div>
                        <div className="flex flex-row gap-5 mt-3">
                            <div className="w-1/4 items-center p-3 border bg-blue-900 text-xl text-white font-semibold">
                                DRAWING NO
                            </div>
                            <div className="p-3 border bg-blue-900 text-xl text-white font-semibold items-start w-3/4"></div>
                            <div className="w-1/5 items-start p-3 border rounded text-lg text-black font-semibold">
                                
                            </div>
                        </div>
                        <div className="flex flex-row mt-3 gap-5">
                            <span className="w-1/4 p-3 border bg-blue-900 text-lg text-white font-semibold items-center">PART NAME</span>
                            <div className="p-3 border bg-blue-900 text-xl text-white font-semibold items-start w-full"></div>
                        </div>
                        <div className="flex flex-row mt-8 gap-5">
                            <div className="w-1/4 items-center p-3 border bg-blue-900 text-xl text-white font-semibold">
                                QTY
                            </div>
                            <Input type="text" id="qty" placeholder="Enter QTY to your inspect" className="w-3/4 border border-black hover:border-black"/>
                            <div className="w-1/5 items-start p-3 border rounded text-lg text-black font-semibold">
                                
                            </div>
                        </div>
                    </div>
                    <div id="action" className='flexitems-center justify-center pt-[10px] mt-6'>
                        <Button className='text-white bg-blue-900 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-700 font-medium rounded-lg text-lg w-full sm:w-auto px-5 py-5 text-center dark:bg-blue-900 dark:hover:bg-blue-900 dark:focus:ring-blue-900'>SAVE</Button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default InventoryCheck