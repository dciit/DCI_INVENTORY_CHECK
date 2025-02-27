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
                    "ivSetCode": redux.authen.mSetInfo.setCode,
                    "paramYM": redux.authen.mSetInfo.ym,
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
    const FnSummary = (field: string) => {
        let sum: number = 0;
        infos.map((o) => {
            console.log(o)
            sum += o[field]
        })
        return sum != 0 ? Number(sum.toFixed(2)).toLocaleString('en') : '';
    }
    return (
        <Modal title={'ÃÒÂÅÐàÍÕÂ´'} width={'75%'} open={open} onClose={() => close(false)} onCancel={() => close(false)} footer={<div>
            <Button onClick={() => close(false)}>ปิดหน้าต่าง</Button>
        </div>}>
            <div className='overflow-scroll h-[600px] p-[16px]'>
                <table className='w-[100%] max-h-[600px]'>
                    <tr className='font-semibold'>
                        <td colSpan={2} className='w-[28%] border pl-[16px] bg-gray-100  sticky top-0' >
                            <div className='font-bold text-lg '>
                                <span>WCNO : </span>
                                <span>{wcno}</span>
                            </div>
                        </td>
                        <td className='border text-center bg-gray-400/5 py-3 w-[12%]  sticky top-0 z-[9999]' colSpan={2}>PROGRAM</td>
                        <td className='border text-center bg-gray-400/5 sticky top-0 z-[9999]' colSpan={9}>ALPHA</td>
                    </tr>
                    <tr className='bg-gray-400/5 font-semibold  sticky top-[47.5px] z-[9999]'>
                        <td className='border text-center w-[5%] bg-gray-50' rowSpan={2}>No.</td>
                        <td className='border pl-[8px]  w-[23%] bg-gray-50' rowSpan={2} >Part</td>
                        <td className='border text-center w-[12%] bg-yellow-100' colSpan={2}>QRCODE<br />SYSTEM</td>
                        <td className='border text-center w-[12%] bg-blue-200' colSpan={2}>COUNT (AMT)</td>
                        <td className='border text-center w-[12%] bg-sky-400' colSpan={2}>BOOK (AMT)</td>
                        <td className='border text-center w-[12%] bg-red-100' colSpan={2}>Variance (-)</td>
                        <td className='border text-center w-[12%] bg-red-200' colSpan={2}>Variance (+)</td>
                        <td className='border text-center w-[12%] bg-orange-200' rowSpan={2}>Total</td>
                    </tr>
                    <tr>
                        <td className='border text-center bg-yellow-100 font-semibold w-[5%]'>QTY</td>
                        <td className='border text-center bg-yellow-100 font-semibold w-[5%]'>AMT</td>
                        <td className='border text-center bg-blue-200 font-semibold w-[5%]'>QTY</td>
                        <td className='border text-center bg-blue-200 font-semibold w-[5%]'>AMT</td>
                        <td className='border text-center bg-sky-300 font-semibold w-[5%]'>QTY</td>
                        <td className='border text-center bg-sky-300 font-semibold w-[5%]'>AMT</td>
                        <td className='border text-center bg-red-100 font-semibold w-[5%]'>QTY</td>
                        <td className='border text-center bg-red-100 font-semibold w-[5%]'>AMT</td>
                        <td className='border text-center bg-red-200 font-semibold w-[5%]'>QTY</td>
                        <td className='border text-center bg-red-200 font-semibold w-[5%]'>AMT</td>
                    </tr>
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
                                <td className={`text-end  drop-shadow-md pr-[8px] border font-semibold `}>{Number(o.phyqty) != 0 ? formattedNumber(o.phyqty) : ''}</td>
                                <td className={`text-end  drop-shadow-md pr-[8px] border font-semibold `}>{Number(o.phyamt) != 0 ? formattedNumber(o.phyamt) : ''}</td>
                                <td className={`text-end  drop-shadow-md pr-[8px] border font-semibold `}>{Number(o.bkqty) != 0 ? formattedNumber(o.bkqty) : ''}</td>
                                <td className={`text-end  drop-shadow-md pr-[8px] border font-semibold `}>{Number(o.bkamt) != 0 ? formattedNumber(o.bkamt) : ''}</td>
                                <td className='border text-end pr-[8px]  font-semibold drop-shadow-lg '>{Number(o.diffQty) < 0 ? formattedNumber(o.diffQty) : ''}</td>
                                <td className='border text-end pr-[8px]  font-semibold drop-shadow-lg '>{Number(o.diffAMT) < 0 ? formattedNumber(o.diffAMT) : ''}</td>
                                <td className='border text-end pr-[8px]  font-semibold drop-shadow-lg '>{Number(o.diffQty) > 0 ? formattedNumber(o.diffQty) : ''}</td>
                                <td className='border text-end pr-[8px]  font-semibold drop-shadow-lg '>{Number(o.diffAMT) > 0 ? formattedNumber(o.diffAMT) : ''}</td>
                                <td className='border text-end pr-[8px] '></td>
                            </tr>
                        })
                    }
                    {
                        infos.length && <tr className='font-bold bg-gray-50'>
                            <td colSpan={2} className='border font-bold pl-[16px] py-4 '>Total</td>
                            <td className='text-end pr-[4px] border bg-yellow-50'>{FnSummary('auditorQty')}</td>
                            <td className='text-end pr-[4px] border bg-yellow-50'>{FnSummary('auditorAMT')}</td>
                            <td className='text-end pr-[4px] border bg-blue-100'>{FnSummary('phyqty')}</td>
                            <td className='text-end pr-[4px] border bg-blue-100'>{FnSummary('phyamt')}</td>
                            <td className='text-end pr-[4px] border bg-sky-100'>{FnSummary('bkqty')}</td>
                            <td className='text-end pr-[4px] border bg-sky-100'>{FnSummary('bkamt')}</td>
                            <td className='text-end pr-[4px] border bg-red-50'>{Number(FnSummary('diffQty').replace(',', '')) < 0 && FnSummary('diffQty')}</td>
                            <td className='text-end pr-[4px] border bg-red-50'>{Number(FnSummary('diffAMT').replace(',', '')) < 0 && FnSummary('diffAMT')}</td>
                            <td className='text-end pr-[4px] border bg-red-100'>{Number(FnSummary('diffQty').replace(',', '')) > 0 && FnSummary('diffQty')}</td>
                            <td className='text-end pr-[4px] border bg-red-100'>{Number(FnSummary('diffAMT').replace(',', '')) > 0 && FnSummary('diffAMT')}</td>
                            <td className='text-end pr-[4px] border bg-orange-50'> </td>
                        </tr>
                    }
                </table>
            </div>

        </Modal >
    )
}

export default ModalCommitInfo