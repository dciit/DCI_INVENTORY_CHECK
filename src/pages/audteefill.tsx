import { Button, Input } from "antd"

function AuditeeFill() {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="container rounded border shadow-xl p-14 bg-white justify-center">
                <div className="flex flex-row gap-3">
                    <span className="w-1/6 p-2 bg-blue-900 border-4 border-black text-2xl text-white font-semibold items-center">AUDITEE</span>
                    <p className="w-3/6 text-2xl font-semibold text-center items-center underline">Finished Goods: Compressor (Assembly Line)</p>
                    <div className="flex flex-col gap-2">
                        <span className="p-2 bg-green-500 border text-lg text-white font-semibold items-center">YYYYMM</span>
                        <div className="p-2 border border-black text-lg text-white font-semibold items-center">123123</div>
                    </div>
                    <div className="flex flex-1 flex-col gap-2 ml-10 items-end">
                        <div className="flex flex-row gap-2 justify-end w-full">
                            <span className="p-2 bg-green-500 border text-lg text-white font-semibold">Vision:</span>
                            <div className="p-2 border border-black text-lg text-white font-semibold w-40"></div>
                        </div>
                        <div className="flex flex-row gap-2 justify-end w-full">
                            <span className="p-2 bg-green-500 border text-lg text-white font-semibold">Name:</span>
                            <div className="p-2 border border-black text-lg text-white font-semibold w-40"></div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row gap-3">
                    <div className="flex justify-between gap-2">
                        <div className="mt-7 flex justify-between gap-2">
                            <span className="p-3 bg-green-500 border text-lg text-white font-semibold items-center">W/C:</span>
                            <Input type="text" id="wc" className="p-2.5 border border-black hover:border-black" />
                        </div>
                        <div className="mt-7 flex justify-between gap-2">
                            <span className="p-3 bg-green-500 border text-lg text-white font-semibold items-center">Model Name:</span>
                            <Input type="text" id="modelname" className="w-56 p-2.5 border border-black hover:border-black" />
                        </div>
                        <div className="mt-7 flex justify-between gap-2">
                            <span className="p-3 bg-green-500 border text-lg text-white font-semibold items-center">Code Model:</span>
                            <Input type="text" id="codemodel" className="w-56 p-2.5 border border-black hover:border-black" />
                        </div>
                    </div>

                    <div id="search" className="flex flex-1 justify-end mt-7">
                        <Button className="text-black bg-blue-300 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-700 font-medium rounded-lg text-lg px-7 py-7 text-center dark:bg-blue-900 dark:hover:bg-blue-900 dark:focus:ring-blue-900">
                            Search
                        </Button>
                    </div>
                </div>

                <div className="flex flex-row gap-3 justify-end">
                    <div id="adjust" className="mt-7">
                        <Button className="text-black bg-yellow-200 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-700 font-medium rounded-lg text-lg px-7 py-7 text-center dark:bg-yellow-900 dark:hover:bg-yellow-900 dark:focus:ring-yellow-900">
                            Adjust
                        </Button>
                    </div>
                    <div id="clear" className="mt-7">
                        <Button className="text-black bg-rose-500 hover:bg-rose-700 focus:ring-4 focus:outline-none focus:ring-rose-700 font-medium rounded-lg text-lg px-7 py-7 text-center dark:bg-rose-900 dark:hover:bg-rose-900 dark:focus:ring-rose-900">
                            Clear
                        </Button>
                    </div>
                    <div id="save" className="mt-7">
                        <Button className="text-black bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none focus:green-rose-700 font-medium rounded-lg text-lg px-7 py-7 text-center dark:bg-green-900 dark:hover:bg-green-900 dark:focus:ring-green-900">
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default AuditeeFill