import { PrinterOutlined } from "@ant-design/icons"
import imgReact from "../assets/excelpic.png"

function SummerizeGoods() {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="container rounded border shadow-xl p-14 bg-white justify-center">
                <div className="flex flex-row justify-between w-full gap-3">
                    <div className="flex justify-start flex-1">
                        <p className="text-2xl font-semibold text-center underline">
                            สรุปรายการ Part ของ Finished Goods (Assembly Line)
                        </p>
                    </div>
                    <div className="flex justify-end flex-1 flex-row w-full">
                        <span className="pt-3 px-12 border border-black bg-gray-400 text-2xl text-black font-bold text-center flex items-center justify-center gap-2">
                            <PrinterOutlined style={{ fontSize: '50px' }} />
                            Print
                        </span>
                    </div>
                </div>
  
                <div className="flex flex-row w-full gap-3 mt-5">
                    <div className=" flex justify-start gap-2">
                        <span className="p-3 border bg-green-500 text-lg text-white font-semibold text-start w-24">
                            Factory:
                        </span>
                        <div className="p-3 border border-black text-lg text-black font-semibold text-start w-60"></div>
                    </div>
                    <span className="w-1/6 p-2 bg-blue-900 border-4 border-black text-2xl text-white font-semibold text-center">
                        AUDITEE
                    </span>
                    <div className="flex flex-1 justify-end">
                        <span className="pt-3 px-12  border border-black bg-white text-2xl text-black font-bold text-center flex items-center justify-center gap-2">
                            <img src={imgReact} alt="" className="w-12 h-12"/>
                            Excel 
                        </span>
                    </div>
                </div>

                <div className="flex flex-row w-full gap-3 mt-3">
                    <div className="flex justify-start gap-2">
                        <span className="p-3 border bg-green-500 text-lg text-white font-semibold text-start w-24">
                            W/C:
                        </span>
                        <div className="p-3 border border-black text-lg text-black font-semibold text-start w-60"></div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default SummerizeGoods