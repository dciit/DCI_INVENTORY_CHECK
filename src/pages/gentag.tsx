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


function GenTags() {

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

    //const valuesLength = tableData.length > 0 ? tableData[0].wc.

    return (
        <div className="w-[210mm] h-[297mm] border border-gray-400 mx-auto break-after-page">
            {
                [...Array(14)].map((_, i: number) => {
                    return <>
                        {/* {
                            ((i+1) % 4) == 1 && <div className="w-[210mm] h-[297mm] border border-gray-400 mx-auto break-after-page">
                        } */}
                        <div className='h-[74.20mm] flex  border gap-0 w-full'>
                            <div key={i} className="flex bg-white items-center justify-center border border-gray-300">
                                <div className='flex flex-col border gap-0 h-full w-full'>
                                    <div className='flex flex-row justify-end gap-0'>
                                        <div className='flex gap-2'>
                                            <p className='text-black text-sm font-light'>DCI</p>
                                            <p className='text-black text-sm font-light'>PHYSICAL</p>
                                        </div>
                                    </div>
                                    {Data[i] && (
                                        <div> {/* Show data only if it exists for that row */}
                                            <p className="text-black text-start font-bold">WC : {Data[i].wc} TAG : 00001</p>
                                            <div className="flex flex-row justify-between gap-0">
                                                <div className="flex gap-6">
                                                    <p className="text-black text-sm font-light">{Data[i].drawno}</p>
                                                    <div className="flex flex-1 gap-1">
                                                        <p className="text-black text-sm font-light">{Data[i].cm}</p>
                                                        <p className="text-black text-sm font-light">LOCATION: {Data[i].location}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-black text-start font-bold">{Data[i].model}</p>
                                            <p className="text-black text-sm font-light">DES : {Data[i].des}</p>
                                            <p className="text-black text-sm font-light">UNIT : {Data[i].unit}</p>
                                        </div>
                                    )}
                                    <div className='flex flex-col items-center'>
                                        <p className='text-black text-sm font-light mt-8'>............................................</p>
                                        <p className='text-black text-sm font-light mt-2'>ผู้ตรวจสอบ DWG/ </p>
                                        <p className='text-black text-sm font-light mt-2'>CM ใน TAG ให้ตรง</p>
                                        <p className='text-black text-sm font-light mt-1'>กับ PART (FM,LD) </p>
                                    </div>

                                </div>
                                <div className='flex flex-col border gap-0 h-full w-full'>
                                    <div className='flex flex-row justify-staer ml-2'>
                                        <div className='flex gap-2'>
                                            <p className='text-black text-sm font-light'>INVENTORY</p>
                                            <p className='text-black text-sm font-light'>TAG</p>
                                        </div>
                                    </div>
                                    <p className='text-black text-sm font-light mt-6'>.</p>
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
                        </div>
                        {
                            ((i + 1) % 4) == 0 && <div className="break-before-page"></div>
                        }
                    </>
                })
            }
        </div >
        // <div className="w-[210mm] h-[297mm] border border-gray-400 mx-auto break-after-page">
        //     <div className='page h-full'>
        //         <div className="grid grid-rows-4 border h-full">
        //             {[...Array(4)].map((_, i) => (
        //                 <div key={i} className="bg-white flex items-center justify-center border border-gray-300">
        //                     <div className='flex flex-col border gap-0 h-full w-full'>
        //                         <div className='flex flex-row justify-end gap-0'>
        //                             <div className='flex gap-2'>
        //                                 <p className='text-black text-sm font-light'>DCI</p>
        //                                 <p className='text-black text-sm font-light'>PHYSICAL</p>
        //                             </div>
        //                         </div>
        //                         {Data[i] && (
        //                             <div> {/* Show data only if it exists for that row */}
        //                                 <p className="text-black text-start font-bold">WC : {Data[i].wc} TAG : 00001</p>
        //                                 <div className="flex flex-row justify-between gap-0">
        //                                     <div className="flex gap-16">
        //                                         <p className="text-black text-sm font-light">{Data[i].drawno}</p>
        //                                         <div className="flex flex-1 gap-1">
        //                                             <p className="text-black text-sm font-light">{Data[i].cm}</p>
        //                                             <p className="text-black text-sm font-light">LOCATION: {Data[i].location}</p>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                                 <p className="text-black text-start font-bold">{Data[i].model}</p>
        //                                 <p className="text-black text-sm font-light">DES : {Data[i].des}</p>
        //                                 <p className="text-black text-sm font-light">UNIT : {Data[i].unit}</p>
        //                             </div>
        //                         )}
        //                         <div className='flex flex-col items-center'>
        //                             <p className='text-black text-sm font-light mt-8'>............................................</p>
        //                             <p className='text-black text-sm font-light mt-2'>ผู้ตรวจสอบ DWG/ </p>
        //                             <p className='text-black text-sm font-light mt-2'>CM ใน TAG ให้ตรง</p>
        //                             <p className='text-black text-sm font-light mt-1'>กับ PART (FM,LD) </p>
        //                         </div>

        //                     </div>
        //                     <div className='flex flex-col border gap-0 h-full w-full'>
        //                         <div className='flex flex-row justify-staer ml-2'>
        //                             <div className='flex gap-2'>
        //                                 <p className='text-black text-sm font-light'>INVENTORY</p>
        //                                 <p className='text-black text-sm font-light'>TAG</p>
        //                             </div>
        //                         </div>
        //                         <p className='text-black text-sm font-light mt-6'>.</p>
        //                         <div className='flex flex-col items-center mt-24'>
        //                             <div className="flex flex-row items-center space-x-2">
        //                                 <div className="flex border">
        //                                     {[...Array(5)].map((_, i) => (
        //                                         <div key={i} className="w-6 h-6 border border-gray-300"></div>
        //                                     ))}
        //                                 </div>
        //                                 <p className="text-black text-sm font-light">.</p>
        //                                 <div className="flex border">
        //                                     {[...Array(2)].map((_, i) => (
        //                                         <div key={i} className="w-6 h-6 border border-gray-300"></div>
        //                                     ))}
        //                                 </div>
        //                             </div>
        //                             <p className='text-black text-sm font-light mt-2'>จำนวนครั้งที่นับได้ครั้งที่1</p>
        //                             <p className='text-black text-sm font-light mt-3'>...............................</p>
        //                             <p className='text-black text-sm font-light'>ผู้ตรวจสอบครั้งที่1</p>
        //                         </div>

        //                     </div>
        //                     <div className='flex flex-col border gap-0 h-full w-full'>
        //                         <div className='flex flex-col items-center mt-40'>
        //                             <div className="flex flex-row items-center space-x-2">
        //                                 <div className="flex border">
        //                                     {[...Array(5)].map((_, i) => (
        //                                         <div key={i} className="w-6 h-6 border border-gray-300"></div>
        //                                     ))}
        //                                 </div>
        //                                 <p className="text-black text-sm font-light">.</p>
        //                                 <div className="flex border">
        //                                     {[...Array(2)].map((_, i) => (
        //                                         <div key={i} className="w-6 h-6 border border-gray-300"></div>
        //                                     ))}
        //                                 </div>
        //                             </div>
        //                             <p className='text-black text-sm font-light mt-2'>จำนวนครั้งที่นับได้ครั้งที่2</p>
        //                             <p className='text-black text-sm font-light mt-3'>...............................</p>
        //                             <p className='text-black text-sm font-light'>ผู้ตรวจสอบครั้งที่2</p>
        //                         </div>
        //                     </div>
        //                     <div className='flex flex-col border gap-0 h-full w-full'>
        //                         <div className='flex flex-col items-center mt-40'>
        //                             <div className="flex flex-row items-center space-x-2">
        //                                 <div className="flex border">
        //                                     {[...Array(5)].map((_, i) => (
        //                                         <div key={i} className="w-6 h-6 border border-gray-300"></div>
        //                                     ))}
        //                                 </div>
        //                                 <p className="text-black text-sm font-light">.</p>
        //                                 <div className="flex border">
        //                                     {[...Array(2)].map((_, i) => (
        //                                         <div key={i} className="w-6 h-6 border border-gray-300"></div>
        //                                     ))}
        //                                 </div>
        //                             </div>
        //                             <p className='text-black text-sm font-light mt-2'>จำนวนที่นับได้</p>
        //                             <p className='text-black text-sm font-light mt-3'>...............................</p>
        //                             <p className='text-black text-sm font-light'>ผู้ตรวจสอบ</p>
        //                         </div>
        //                     </div>
        //                 </div>
        //             ))}
        //         </div>
        //     </div>
        //     {/* <div className="break-before-page"></div> */}
        // </div>
    )
}


export default GenTags
