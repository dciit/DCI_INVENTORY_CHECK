import { APIGetCommitInfo } from '@/service/invsave.service';
import { Button, Modal } from 'antd'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface PropModalCommitInfo {
    open: boolean;
    wcno: string | number;
    close: Function;
}
interface PropInfos {
    [key: string]: any;
    ivSetCode: string;
    ym: string;
    wcno: string;
    tagno: string;
    partno: string;
    cm: string;
    partname: string;
    whum: string;
    stdcost: number;
    balqty: number;
    balamt: number;
    bkqty: number;
    bkamt: number;
    phyqty: number;
    phyamt: number;
    auditorQty: number;
    auditorAMT: number;
    diffQty: number;
    diffAMT: number;
}
function ModalCommitInfo(props: PropModalCommitInfo) {
    const { open, close, wcno } = props;
    const redux = useSelector((state: any) => state.reducer);
    const [infos, setInfos] = useState<PropInfos[]>([]);
    useEffect(() => {
        init();
    }, [open])
    const init = async () => {
        if (typeof redux.authen != 'undefined' && typeof redux.authen.mSetInfo != 'undefined' && typeof redux.authen.mSetInfo.setCode != 'undefined' && redux.authen.mSetInfo.setCode != '') {
            let RESLoadCommitInfo = await APIGetCommitInfo(
                {
                    "ivSetCode": 'SET20250217WPDC3U608341659000001',
                    "paramYM": '202502',
                    "paramWCNO": wcno
                }
            );
            setInfos(RESLoadCommitInfo);
        }
    }
    const formattedNumber = (value: string | number) => {
        return parseFloat(Number(value).toFixed(2)).toLocaleString(
            "en"
        );
    };

    const FnSummary = (field: string, condition?: 'negative' | 'positive'): number => {
        let sum = infos.reduce((acc, o) => {
            let value = Number(o[field]) || 0;
            if (condition === 'negative' && value >= 0) return acc;
            if (condition === 'positive' && value <= 0) return acc;
            return acc + value;
        }, 0);

        return parseFloat(sum.toFixed(2));
    };





    return (
        <Modal open={open} onClose={() => close(false)} onCancel={() => close(false)} footer={<></>} width='75%'>
            <head className='flex'>
                <p className='text-lg font-bold'>หน้ารายละเอียด</p>
            </head>
            <body className='m-3'>
                <div className='overflow-x-auto max-h-[700px]'>
                    <table className='border-separate border-spacing-0 border border-gray-100 table-fixed'>
                        <thead>
                            <tr className='font-semibold bg-white'>
                                <td colSpan={2} className='w-[28%] border pl-[16px] bg-gray-100 sticky top-0' >
                                    <div className='font-bold text-lg '>
                                        <span>WCNO : </span>
                                        <span>{wcno}</span>
                                    </div>
                                </td>
                                <td className='border text-center bg-gray-100 py-3 w-[12%]  sticky top-0 z-[9999]' colSpan={2}>IN HOUSE</td>
                                <td className='border text-center bg-gray-100 sticky top-0 z-[999]' colSpan={9}>ALPHA</td>
                            </tr>
                            <tr className='bg-gray-400/5 font-semibold  sticky top-[46.5px] z-[9999]'>
                                <td className='border text-center w-[5%] bg-gray-50' rowSpan={2}>No.</td>
                                <td className='border pl-[8px]  w-[20%] bg-gray-50' rowSpan={2} >Part</td>
                                <td className='border text-center w-[12%] bg-yellow-100' colSpan={2}>QRCODE<br />SYSTEM</td>
                                <td className='border text-center w-[12%] bg-blue-200' colSpan={2}>COUNT (AMT)</td>
                                <td className='border text-center w-[12%] bg-sky-400' colSpan={2}>BOOK (AMT)</td>
                                <td className='border text-center w-[12%] bg-red-100' colSpan={2}>Variance (-)</td>
                                <td className='border text-center w-[12%] bg-red-200' colSpan={2}>Variance (+)</td>
                                <td className='border text-center w-[12%] bg-orange-200' rowSpan={2}>Total</td>
                            </tr>
                            <tr className='bg-gray-400/5 font-semibold sticky top-[92.5px] z-[9999] border border-gray-200'>
                                <td className='border text-center bg-yellow-100 font-semibold w-[5%]'>QTY</td>
                                <td className='border text-center bg-yellow-100 font-semibold w-[5%]'>AMT</td>
                                <td className='border text-center bg-blue-200 font-semibold w-[5%]'>QTY</td>
                                <td className='border text-center bg-blue-200 font-semibold w-[5%]'>AMT</td>
                                <td className='border text-center bg-sky-400 font-semibold w-[5%]'>QTY</td>
                                <td className='border text-center bg-sky-400 font-semibold w-[5%]'>AMT</td>
                                <td className='border text-center bg-red-100 font-semibold w-[5%]'>QTY</td>
                                <td className='border text-center bg-red-100 font-semibold w-[5%]'>AMT</td>
                                <td className='border text-center bg-red-200 font-semibold w-[5%]'>QTY</td>
                                <td className='border text-center bg-red-200 font-semibold w-[5%]'>AMT</td>
                            </tr>
                        </thead>


                        <tbody>
                            {
                                infos.map((o: PropInfos, i: number) => {
                                    return < tr className='cursor-pointer select-none' >
                                        <td className='border text-center py-[8px] bg-gray-50'>{i + 1}</td>
                                        <td className='border text-start pl-[8px]'>
                                            <div className='flex flex-col '>
                                                <span>{o.partno}</span>
                                                <strong>{o.partname}</strong>
                                            </div>
                                        </td>
                                        <td className={`text-end drop-shadow-md pr-[8px] border font-semibold `}>{Number(o.auditorQty) != 0 ? formattedNumber(o.auditorQty) : ''}</td>
                                        <td className={`text-end drop-shadow-md pr-[8px] border font-semibold `}>{Number(o.auditorAMT) != 0 ? formattedNumber(o.auditorAMT) : ''}</td>
                                        <td className={`text-end drop-shadow-md pr-[8px] border font-semibold `}>{Number(o.phyqty) != 0 ? formattedNumber(o.phyqty) : ''}</td>
                                        <td className={`text-end drop-shadow-md pr-[8px] border font-semibold `}>{Number(o.phyamt) != 0 ? formattedNumber(o.phyamt) : ''}</td>
                                        <td className={`text-end drop-shadow-md pr-[8px] border font-semibold `}>{Number(o.bkqty) != 0 ? formattedNumber(o.bkqty) : ''}</td>
                                        <td className={`text-end drop-shadow-md pr-[8px] border font-semibold `}>{Number(o.bkamt) != 0 ? formattedNumber(o.bkamt) : ''}</td>
                                        <td className='border text-end pr-[8px]  font-semibold drop-shadow-lg '>{Number(o.diffQty) < 0 ? formattedNumber(o.diffQty) : ''}</td>
                                        <td className='border text-end pr-[8px]  font-semibold drop-shadow-lg '>{Number(o.diffAMT) < 0 ? formattedNumber(o.diffAMT) : ''}</td>
                                        <td className='border text-end pr-[8px]  font-semibold drop-shadow-lg '>{Number(o.diffQty) > 0 ? formattedNumber(o.diffQty) : ''}</td>
                                        <td className='border text-end pr-[8px]  font-semibold drop-shadow-lg '>{Number(o.diffAMT) > 0 ? formattedNumber(o.diffAMT) : ''}</td>
                                        <td className='border text-end pr-[8px] '></td>
                                    </tr>
                                })
                            }
                            {infos.length > 0 ? (
                                <tr className='font-bold bg-gray-50 text-sm whitespace-nowrap'>
                                    <td colSpan={2} className='border font-bold pl-[16px] py-4 '>Total</td>
                                    <td className='text-end pr-[4px] border bg-yellow-50'>{FnSummary('auditorQty').toLocaleString('en')}</td>
                                    <td className='text-end pr-[4px] border bg-yellow-50'>{FnSummary('auditorAMT').toLocaleString('en')}</td>
                                    <td className='text-end pr-[4px] border bg-blue-100'>{FnSummary('phyqty').toLocaleString('en')}</td>
                                    <td className='text-end pr-[4px] border bg-blue-100'>{FnSummary('phyamt').toLocaleString('en')}</td>
                                    <td className='text-end pr-[4px] border bg-sky-100'>{FnSummary('bkqty').toLocaleString('en')}</td>
                                    <td className='text-end pr-[4px] border bg-sky-100'>{FnSummary('bkamt').toLocaleString('en')}</td>

                                    <td className='text-end pr-[4px] border bg-red-50'>
                                        {FnSummary('diffQty', 'negative') !== 0 ? FnSummary('diffQty', 'negative').toLocaleString('en') : ""}
                                    </td>
                                    <td className='text-end pr-[4px] border bg-red-50'>
                                        {FnSummary('diffAMT', 'negative') !== 0 ? FnSummary('diffAMT', 'negative').toLocaleString('en') : ""}
                                    </td>

                                    <td className='text-end pr-[4px] border bg-red-100'>
                                        {FnSummary('diffQty', 'positive') !== 0 ? FnSummary('diffQty', 'positive').toLocaleString('en') : ""}
                                    </td>
                                    <td className='text-end pr-[4px] border bg-red-100'>
                                        {FnSummary('diffAMT', 'positive') !== 0 ? FnSummary('diffAMT', 'positive').toLocaleString('en') : ""}
                                    </td>

                                    <td className='text-end pr-[4px] border bg-orange-50'> </td>
                                </tr>
                            ) : (
                                <tr>
                                    <td className='text-red-500/75 font-semibold text-center py-3 border bg-gray-50' colSpan={13}>ไม่พบข้อมูล</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </body>
            <footer className='mt-3'>
                <div className='text-end mr-5'>
                    <Button onClick={() => close(false)}>ปิดหน้าต่าง</Button>
                </div>
            </footer>

        </Modal >
    )
}

export default ModalCommitInfo