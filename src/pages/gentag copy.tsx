import React, { useState } from 'react'

interface DataTag {
    wc: number;
    drawno: number;
    cm: string;
    location: string;
    model: string;
    des: string;
    unit: string;
}


function GenTag() {

    const initialData: DataTag[] = [
        { wc: 901, drawno: 123, cm: "B", location: "Fac2", model: "2P581209-2-", des: "PIPE ASSY", unit: "PCS" },
        { wc: 901, drawno: 124, cm: "B", location: "Fac2", model: "2P584919-2A", des: "PIPE ASSY", unit: "SET" },
        { wc: 901, drawno: 125, cm: "B", location: "Fac2", model: "2PD03210-1B", des: "ACCUMULATOR ASSY", unit: "PCS" },
        { wc: 901, drawno: 126, cm: "B", location: "Fac4", model: "2P581209-2-2", des: "ACCUMULATOR ASSY", unit: "PCS" },
        { wc: 901, drawno: 127, cm: "B", location: "Fac2", model: "2PD04447-1D", des: "PIPE ASSY", unit: "PCS" },
        { wc: 901, drawno: 128, cm: "B", location: "Fac2", model: "2P581209-2-", des: "PIPE ASSY", unit: "PCS" },
        { wc: 901, drawno: 129, cm: "B", location: "Fac2", model: "2P581202-2-", des: "PIPE ASSY", unit: "PCS" },
        { wc: 901, drawno: 121, cm: "B", location: "Fac2", model: "2P581209-2-", des: "PIPE ASSY", unit: "PCS" },
    ];

    console.log(initialData);
    const [Data, setTableData] = useState<DataTag[]>(initialData);

    // const valuesLength = tableData.length > 0 ? tableData[0].wc.

    return (
        <div className="w-[210mm] h-[297mm] border mx-auto">
            {[...Array(Math.ceil(Data.length / 4))].map((_, pageIndex) => (
                <div key={pageIndex} className="page h-full">
                    <div className="grid grid-rows-4 border h-full">
                        {/* Loop for 4 items per page */}
                        {Data.slice(pageIndex * 4, (pageIndex + 1) * 4).map((item, rowIndex) => (
                            <div key={rowIndex} className="bg-white flex items-center justify-center border border-gray-300">
                                <div className="flex flex-col border gap-0 h-full w-full">
                                    <div className="flex flex-row justify-end gap-0">
                                        <div className="flex gap-2">
                                            <p className="text-black text-sm font-light">DCI</p>
                                            <p className="text-black text-sm font-light">PHYSICAL</p>
                                        </div>
                                    </div>

                                    {/* Displaying data for each row */}
                                    <div>
                                        <p className="text-black text-start font-bold">WC : {item.wc} TAG : 00001</p>
                                        <div className="flex flex-row justify-between gap-0">
                                            <div className="flex gap-2">
                                                <p className="text-black text-sm font-light">DRAWING N0.</p>
                                                <div className="flex flex-1 justify-end gap-3">
                                                    <p className="text-black text-sm font-light">CM</p>
                                                    <p className="text-black text-sm font-light">LOCATION:</p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-black text-start font-bold">{item.model}</p>
                                        <p className="text-black text-sm font-light">DES : {item.des}</p>
                                        <p className="text-black text-sm font-light">UNIT : {item.unit}</p>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <p className="text-black text-sm font-light mt-8">............................................</p>
                                        <p className="text-black text-sm font-light mt-2">ผู้ตรวจสอบ DWG/ </p>
                                        <p className="text-black text-sm font-light mt-2">CM ใน TAG ให้ตรง</p>
                                        <p className="text-black text-sm font-light mt-1">กับ PART (FM,LD) </p>
                                    </div>
                                </div>
                                <div className='flex flex-col border gap-0 h-full w-full'>
                                    <div className='flex flex-row justify-staer ml-2'>
                                        <div className='flex gap-2'>
                                            <p className='text-black text-sm font-light'>INVENTORY</p>
                                            <p className='text-black text-sm font-light'>TAG</p>
                                        </div>
                                    </div>
                                    <p className='text-black text-sm font-light mt-6'>{item.location}</p>
                                    <div className='flex flex-col items-center mt-24'>
                                        <div className="flex flex-row items-center space-x-2">
                                            <div className="flex border">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className="w-6 h-6 border border-gray-300"></div>
                                                ))}
                                            </div>
                                            <p className="text-black text-sm font-light">.</p>
                                            <div className="flex border">
                                                {[...Array(2)].map((_, i) => (
                                                    <div key={i} className="w-6 h-6 border border-gray-300"></div>
                                                ))}
                                            </div>
                                        </div>
                                        <p className='text-black text-sm font-light mt-2'>จำนวนครั้งที่นับได้ครั้งที่1</p>
                                        <p className='text-black text-sm font-light mt-3'>...............................</p>
                                        <p className='text-black text-sm font-light'>ผู้ตรวจสอบครั้งที่1</p>
                                    </div>

                                </div>
                                <div className='flex flex-col border gap-0 h-full w-full'>
                                    <div className='flex flex-col items-center mt-40'>
                                        <div className="flex flex-row items-center space-x-2">
                                            <div className="flex border">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className="w-6 h-6 border border-gray-300"></div>
                                                ))}
                                            </div>
                                            <p className="text-black text-sm font-light">.</p>
                                            <div className="flex border">
                                                {[...Array(2)].map((_, i) => (
                                                    <div key={i} className="w-6 h-6 border border-gray-300"></div>
                                                ))}
                                            </div>
                                        </div>
                                        <p className='text-black text-sm font-light mt-2'>จำนวนครั้งที่นับได้ครั้งที่2</p>
                                        <p className='text-black text-sm font-light mt-3'>...............................</p>
                                        <p className='text-black text-sm font-light'>ผู้ตรวจสอบครั้งที่2</p>
                                    </div>
                                </div>
                                <div className='flex flex-col border gap-0 h-full w-full'>
                                    <div className='flex flex-col items-center mt-40'>
                                        <div className="flex flex-row items-center space-x-2">
                                            <div className="flex border">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className="w-6 h-6 border border-gray-300"></div>
                                                ))}
                                            </div>
                                            <p className="text-black text-sm font-light">.</p>
                                            <div className="flex border">
                                                {[...Array(2)].map((_, i) => (
                                                    <div key={i} className="w-6 h-6 border border-gray-300"></div>
                                                ))}
                                            </div>
                                        </div>
                                        <p className='text-black text-sm font-light mt-2'>จำนวนที่นับได้</p>
                                        <p className='text-black text-sm font-light mt-3'>...............................</p>
                                        <p className='text-black text-sm font-light'>ผู้ตรวจสอบ</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* This will insert a page break after every 4 items */}
                        {((pageIndex + 1) % 4) === 0 && <div className="page-break"></div>}
                    </div>
                </div>
            ))}
        </div>

    )

}


export default GenTag
