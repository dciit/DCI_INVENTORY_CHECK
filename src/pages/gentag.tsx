import { useEffect, useRef, useState } from 'react'
import imgprinter from "../assets/printer.jpg";
import { QRCode, RefSelectProps, Select } from 'antd';
import { useSelector } from 'react-redux';
import { ReduxInterface } from '@/interface/main.interface';
import { DataTag, TagInfo } from '@/interface/gentag.interface';
import { API_TEG_SELECT } from '@/service/gentag.service';
import { API_SELECT_WCNO } from '@/service/partlist.service';
import { Wcno } from '@/interface/compressorcheck';
import dayjs from 'dayjs';


function GenTag() {


    const oAccount: ReduxInterface = useSelector((state: any) => state.reducer);

    const [tagData, setTagData] = useState<TagInfo[]>([]);
    const [wcno, setWcno] = useState<Wcno[]>([]);

    const [loading, setLoading] = useState(false);

    const [searchData, setSearchData] = useState<DataTag>({
        paramWCNO: '',
    });




    const refWCNO = useRef<RefSelectProps>(null)

    useEffect(() => {
        const fetchWcno = async () => {
            const wcnodata = await API_SELECT_WCNO();
            if (wcnodata.status !== false) {
                setWcno(wcnodata);
                setLoading(false);
            } else {
                console.error("Error fetching wcno:", wcnodata.message);
            }
        };


        const fetchTag = async () => {
            const tagdata = await API_TEG_SELECT(oAccount.authen.mSetInfo?.setCode!,
                oAccount.authen.mSetInfo?.ym!,
                searchData.paramWCNO!);
            if (tagdata.status !== false) {
                setTagData(tagdata);
                console.log(tagdata)
            } else {
                console.log('Error fetching tag', tagdata);
            }
        };


        fetchWcno();
        setLoading(false)
        fetchTag();

    }, [searchData.paramWCNO]);

    if (loading) {
        return <p>...loading</p>;
    }



    return (
        <div>
            <div className='flex flex-row gap-2'>
                <a href="#" onClick={() => window.print()}>
                    <img src={imgprinter} alt="Print" className="mt-2 w-24 h-16 print:hidden" />
                </a>
                <div className="mt-2 flex justify-between gap-2 print:hidden">
                    <span className="p-2.5 bg-[#607EAA] border border-black rounded-md text-lg text-white font-semibold text-center">W/C</span>
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
            </div>

            <div className="w-[210mm] h-[297mm]  mx-auto">
                {[...Array(Math.ceil(tagData.length / 4))].map((_, pageIndex) => (
                    <div key={pageIndex} className="page h-full break-after-page">
                        <div className="grid grid-rows-[25%_25%_25%_25%]  h-full">
                            {tagData.slice(pageIndex * 4, (pageIndex + 1) * 4)
                                .filter((item) => item.wcno.startsWith(""))
                                .map((item, rowIndex) => (
                                    // oLineTyps.map((ln) => (
                                    <div key={rowIndex} className="bg-white flex border-b p-4 border-dashed items-center justify-center relative ">
                                        <div className="flex flex-col border-r border-dashed gap-0 h-full w-full  ">
                                            <div className="flex flex-row flex-none justify-end gap-0">
                                                <div className="flex gap-2">
                                                    <p className="text-black text-sm font-light">DCI</p>
                                                    <p className="text-black text-sm font-light">PHYSICAL</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col grow items-center mt-1"></div>
                                            <div className="flex flex-col flex-none items-center mt-1">
                                                <p className="text-black text-sm font-light mt-4">............................................</p>
                                                <p className="text-black text-sm font-light mt-2">ผู้ตรวจสอบ DWG/ </p>
                                                <p className="text-black text-sm font-light mt-2">CM ใน TAG ให้ตรง</p>
                                                <p className="text-black text-sm font-light mt-1">กับ PART (FM,LD) </p>
                                            </div>
                                        </div>
                                        <div className="absolute top-7 left-5" >
                                            <p className="text-black text-start font-bold">WC : {item.wcno} TAG : {item.tagNo}</p>
                                            <div className="flex flex-row justify-between gap-0">
                                                <div className="flex gap-2">
                                                    <p className="text-black text-sm font-light">DRAWING N0.</p>
                                                    <p className="text-black text-sm font-light">CM</p>
                                                </div>
                                            </div>
                                            <p className="text-black text-start font-bold">{item.partNo} {item.cm}</p>
                                            <div>
                                                <p className="text-black text-sm font-light">ชื่อชิ้นงาน: {item.partName}</p>
                                                {item.lineType === "MAIN" ? (
                                                    <p className="flex justify-between text-black text-sm font-light">
                                                        สายการผลิต: MAIN
                                                    </p>
                                                ) : (
                                                    <p className="text-black text-sm font-light text-">
                                                        สายการผลิต: FINAL
                                                    </p>
                                                )}
                                            </div>

                                            <p className="text-black text-sm font-light">หน่วย : {item.whum}</p>
                                        </div>
                                        <div className='flex flex-col border-r border-dashed gap-0 h-full w-full'>
                                            <div className='flex flex-row justify-staer ml-2'>
                                                <div className='flex flex-1 justify-between gap-1'>
                                                    <p className='text-black text-sm font-light'>INVENTORY</p>
                                                    <p className='textt-black text-sm font-light'>วันที่.</p>
                                                </div>
                                            </div>
                                            <p className='text-black text-sm font-light mt-6'>{item.loca1}</p>
                                            <div className='flex flex-col items-center mt-[98px]'>
                                                <div className="flex flex-row items-center">
                                                    <div className="flex border">
                                                        {[...Array(5)].map((_, i) => (
                                                            <div key={i} className="w-6 h-6 border border-gray-300"></div>
                                                        ))}
                                                    </div>
                                                    <p className="text-black text-2xl font-bold -mb-1">.</p>
                                                    <div className="flex border">
                                                        {[...Array(2)].map((_, i) => (
                                                            <div key={i} className="w-6 h-6 border border-gray-300"></div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className='text-black text-sm font-light mt-2'>จำนวนที่นับได้ครั้งที่1</p>
                                                <p className='text-black text-sm font-light mt-3'>...............................</p>
                                                <p className='text-black text-sm font-light'>ผู้ตรวจสอบครั้งที่1</p>
                                            </div>

                                        </div>
                                        <div className='flex flex-col border-r border-dashed w-full h-full'>
                                            <div className="flex flex-row justify-start">
                                                <p className="text-black text-sm font-light">{dayjs(item.crDate).format('YYYY-MM')}</p>
                                            </div>
                                            <div className='flex flex-col items-center mt-[122px]'>
                                                <div className="flex flex-row items-center">
                                                    <div className="flex border">
                                                        {[...Array(5)].map((_, i) => (
                                                            <div key={i} className="w-6 h-6 border border-gray-300"></div>
                                                        ))}
                                                    </div>
                                                    <p className="text-black text-2xl font-bold -mb-1">.</p>
                                                    <div className="flex border">
                                                        {[...Array(2)].map((_, i) => (
                                                            <div key={i} className="w-6 h-6 border border-gray-300"></div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className='text-black text-sm font-light mt-2'>จำนวนที่นับได้ครั้งที่2</p>
                                                <p className='text-black text-sm font-light mt-3'>...............................</p>
                                                <p className='text-black text-sm font-light'>ผู้ตรวจสอบครั้งที่2 (auditee)</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col gap-0 h-full w-full justify-between'>
                                            <div className="flex flex-row justify-end mt-5">
                                                <QRCode type="canvas" className='p-0' value={JSON.stringify(item.qrCode)} size={90}
                                                    color="#000" // Black QR code
                                                    bgColor="transparent" // Transparent background
                                                // style={{
                                                //     border: "none", // Ensure no border
                                                //     background: "none", // No background
                                                //     padding: 0, // Remove any padding
                                                //     boxShadow: "none", // Ensure no shadow
                                                // }}
                                                />
                                            </div>
                                            <div className='flex flex-col items-center mt-[33px]'>
                                                <div className="flex flex-row items-center">
                                                    <div className="flex border">
                                                        {[...Array(5)].map((_, i) => (
                                                            <div key={i} className="w-6 h-6 border border-gray-300"></div>
                                                        ))}
                                                    </div>
                                                    <p className="text-black text-2xl font-bold -mb-1">.</p>
                                                    <div className="flex border">
                                                        {[...Array(2)].map((_, i) => (
                                                            <div key={i} className="w-6 h-6 border border-gray-300"></div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className='text-black text-sm font-light mt-2'>จำนวนที่นับได้ครั้งที่3</p>
                                                <p className='text-black text-sm font-light mt-3'>...............................</p>
                                                <p className='text-black text-sm font-light'>ผู้ตรวจสอบครั้งที่3 (auditor)</p>
                                            </div>
                                        </div>
                                    </div>
                                )

                                )}
                            {tagData.length >= 4 && pageIndex < Math.ceil(tagData.length / 4) - 1 && <div className="page-break"></div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>

    )

}


export default GenTag