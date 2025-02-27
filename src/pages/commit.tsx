import ModalCommitInfo from '@/components/modal.commit.info';
import ModalCommitSyncConfirm from '@/components/modal.commit.sync.confirm';
import { APIGetCommitGetHeader } from '@/service/invsave.service';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Select, Spin } from 'antd';
import { useEffect, useState } from 'react'
import { IoMdSync } from "react-icons/io";
import { useSelector } from 'react-redux';
import Navbar from '@/components/main/navbar';

interface PropGrp {
    grpCode: string;
    grpName: string;
}
interface PropGrpDatas {
    grpCode: string;
    grpInfo: any[];
}
export interface ParamSync {
    ivSetCode: string;
    paramYM: string;
    paramWCNO: string;
    paramBy: string;
}
function Commit() {
    let once = true;
    const redux = useSelector((state: any) => state.reducer)
    const [SyncInfo, setSyncInfo] = useState<ParamSync>({
        ivSetCode: '',
        paramBy: '',
        paramWCNO: '',
        paramYM: ''
    })
    // const navigate = useNavigate();
    const [openModal, setOpenModel] = useState<boolean>(false);
    const [openModalSync, setOpenModalSync] = useState<boolean>(false);
    const [wcnoSelected, setWcnoSelected] = useState<string>('');
    const [load, setLoad] = useState<boolean>(true);
    const oMasterGrp: PropGrp[] = [
        { grpCode: 'C000', grpName: 'PD Fac ODM ODM' },
        { grpCode: '1000', grpName: 'PD Fac 2   1YC' },
        { grpCode: '2100', grpName: 'PD Fac 2   2YC' },
        { grpCode: '2200', grpName: 'PD Fac 2   SCROLL' },
        { grpCode: '2300', grpName: 'PD Fac 2   MOTOR' },
        { grpCode: '3100', grpName: 'PD Fac 3   1YC' },
        { grpCode: '3200', grpName: 'PD Fac 3   2YC' }
    ]
    const [grpSelected, setGrpSelected] = useState<PropGrp>({
        grpCode: '', grpName: ''
    })
    const [GrpHeaders, setGrpHeaders] = useState<any[]>([])
    const oGrps: string[] = ['C000', '1000', '2100', '2200', '2300', '3100', '3200']
    useEffect(() => {
        if (once) {
            initDatas();
            once = !once;
        }
    }, [])

    useEffect(() => {
        if (openModal == false) {
            setWcnoSelected('');
        }
    }, [openModal])
    useEffect(() => {
        if (wcnoSelected != '') {
            setOpenModel(true);
        }
    }, [wcnoSelected])
    const initDatas = async () => {
        setLoad(true);
        if (typeof redux.authen != 'undefined' && typeof redux.authen.mSetInfo != 'undefined' && typeof redux.authen.mSetInfo.setCode != 'undefined' && redux.authen.mSetInfo.setCode != '') {
            let grpDatas: any[] = [];
            await Promise.all(
                oGrps.map(async (oGrp: any) => {
                    try {
                        let result = await APIGetCommitGetHeader({
                            "ivSetCode": redux.authen.mSetInfo.setCode,
                            "paramYM": redux.authen.mSetInfo.ym,
                            "paramGrpCode": oGrp
                        });
                        if (oGrp != undefined) {
                            let clone = grpDatas;
                            clone.push({
                                grpCode: oGrp,
                                grpInfo: result.sort((a: any, b: any) => Number(a.wcno) - Number(b.wcno))
                            })
                            grpDatas = clone;
                        }
                        return result && Array.isArray(result) ? result : [];
                    } catch (error) {
                        return [];
                    }
                })
            );
            setGrpHeaders(grpDatas);
        } else {
            alert(`ไม่พบ Set Code : ${JSON.stringify(redux)}`);
        }
    }
    useEffect(() => {
        if (SyncInfo.ivSetCode != '') {
            setOpenModalSync(true);
        } else {
            setOpenModalSync(false);
        }
    }, [SyncInfo])

    const formattedNumber = (value: string | number) => {
        return parseFloat(Number(value).toFixed(2)).toLocaleString(
            "en"
        );
    };
    useEffect(() => {
        if (GrpHeaders.length > 0) {
            setLoad(false);
        }
    }, [GrpHeaders])
    useEffect(() => {
        if (GrpHeaders.length) {

        }
    }, [grpSelected])
    return (
        <div className=' h-full w-full'>
            {
                load ? <div className='flex flex-col justify-center items-center gap-[16px] h-full w-full bg-gray-50 '>
                    <Spin indicator={<LoadingOutlined spin />} size="large" />
                    <span>กำลังโหลดข้อมูล</span>
                </div> : <div>
                    <div id='filter'>
                        {/* <div className='py-[16px]'>
                            <Button onClick={() => navigate(`../home`)} icon={<IoHomeOutline />}>กลับหน้าหลัก</Button>
                        </div> */}
                        <Navbar />
                        <div className='flex items-center gap-[8px] mt-6 pl-6'>
                            <strong>Group : </strong>
                            <Select className='min-w-[200px] w-fit' value={grpSelected.grpCode} onChange={(e: any) => setGrpSelected(e)}>
                                <Select.Option value="">ทั้งหมด</Select.Option>
                                {
                                    oMasterGrp.map((oMasterGrp: PropGrp) => {
                                        return <Select.Option value={oMasterGrp.grpCode}>{oMasterGrp.grpName} ({oMasterGrp.grpCode})</Select.Option>
                                    })
                                }
                            </Select>
                        </div>
                    </div>
                    {
                        oMasterGrp.map((oMasterGrp: PropGrp) => {
                            return GrpHeaders.filter(n => n.grpCode == oMasterGrp.grpCode).map((o: PropGrpDatas, i: number) => {
                                let TotalTag: number = 0;
                                let TotalPhy: number = 0;
                                let TotalBk: number = 0;
                                let TotalVarianceMinus: number = 0;
                                let TotalVariancePlus: number = 0;
                                return <div key={i} className={`shadow-md my-8`}>
                                    <table key={'table' + i} className='w-[100%] border-collapse'>
                                        <tr className='font-semibold'>
                                            <td colSpan={4} className='w-[52%]'></td>
                                            <td className='border text-center bg-gray-400/5 py-3 w-[8%]'>PROGRAM</td>
                                            <td className='border text-center bg-gray-400/5 w-[40%]' colSpan={5}>ALPHA</td>
                                        </tr>
                                        <tr className='bg-gray-400/5 font-semibold'>
                                            <td rowSpan={o.grpInfo.length + 2} className=' text-lg py-[16px] w-[10%] border writing-mode-vertical  text-center -rotate-90'> {
                                                // oMasterGrp.filter(x => x.grpCode == o.grpCode).length > 0 ? oMasterGrp.filter(x => x.grpCode == o.grpCode)[0].grpName : o.grpCode
                                                oMasterGrp.grpName
                                            }</td>
                                            <td className='border text-center w-[7.5%]'>No.</td>
                                            <td className='border text-center w-[7.5%]'>W/C</td>
                                            <td className='border pl-[8px]  w-[27%]'>Line Name</td>
                                            <td className='border text-center w-[8%] bg-yellow-100'>QRCODE<br />SYSTEM</td>
                                            <td className='border text-center w-[8%] bg-blue-200'>COUNT (AMT)</td>
                                            <td className='border text-center w-[8%] bg-blue-300/75'>BOOK (AMT)</td>
                                            <td className='border text-center w-[8%] bg-red-200'>Variance (-)</td>
                                            <td className='border text-center w-[8%] bg-green-200'>Variance (+)</td>
                                            <td className='border text-center w-[8%] bg-sky-400'>Total</td>
                                        </tr>
                                        {
                                            o.grpInfo.slice(0, o.grpInfo.length).map((oWcnoInfo: any, iWcnoInfo) => {
                                                // oWcnoInfo.diffQty = '-9999'
                                                TotalTag += Number(oWcnoInfo.auditorAMT);
                                                TotalPhy += Number(oWcnoInfo.phyamt);
                                                TotalBk += Number(oWcnoInfo.bkamt);
                                                TotalVarianceMinus -= Number(oWcnoInfo.diffAMT) < 0 ? Number(Math.abs(oWcnoInfo.diffAMT)) : 0;
                                                TotalVariancePlus += Number(oWcnoInfo.diffAMT) > 0 ? Number(Math.abs(oWcnoInfo.diffAMT)) : 0;
                                                return <tr className='cursor-pointer select-none' >
                                                    <td className='border text-center py-[8px]' onClick={() => setWcnoSelected(oWcnoInfo.wcno)}>{iWcnoInfo + 1}</td>
                                                    <td className='border text-center font-semibold' onClick={() => setWcnoSelected(oWcnoInfo.wcno)}>{oWcnoInfo.wcno}</td>
                                                    <td className='border text-start pl-[8px]' onClick={() => setWcnoSelected(oWcnoInfo.wcno)}>{oWcnoInfo.wcnO_NAME}</td>
                                                    <td className={`text-end drop-shadow-md pr-[8px] border font-semibold bg-yellow-50`} onClick={() => setWcnoSelected(oWcnoInfo.wcno)}>{Number(oWcnoInfo.auditorAMT) != 0 ? formattedNumber(oWcnoInfo.auditorAMT) : ''}</td>
                                                    <td className={`text-end  drop-shadow-md pr-[8px] border font-semibold bg-blue-100`} onClick={() => setWcnoSelected(oWcnoInfo.wcno)}>{Number(oWcnoInfo.phyamt) != 0 ? formattedNumber(oWcnoInfo.phyamt) : ''}</td>
                                                    <td className={`text-end  drop-shadow-md pr-[8px] border font-semibold bg-blue-100`} onClick={() => setWcnoSelected(oWcnoInfo.wcno)}>{Number(oWcnoInfo.bkamt) != 0 ? formattedNumber(oWcnoInfo.bkamt) : ''}</td>
                                                    <td className='border text-end pr-[8px] text-red-500 font-semibold drop-shadow-lg bg-red-100' onClick={() => setWcnoSelected(oWcnoInfo.wcno)}>{Number(oWcnoInfo.diffAMT) < 0 ? formattedNumber(oWcnoInfo.diffAMT) : ''}</td>
                                                    <td className='border text-end pr-[8px] text-green-600/75 font-semibold drop-shadow-lg bg-green-100' onClick={() => setWcnoSelected(oWcnoInfo.wcno)}>{Number(oWcnoInfo.diffAMT) > 0 ? formattedNumber(oWcnoInfo.diffAMT) : ''}</td>
                                                    <td className='border text-end pr-[8px] bg-blue-200' onClick={() => setWcnoSelected(oWcnoInfo.wcno)}></td>
                                                    <td className='px-3'><Button type='primary' size='small' icon={<IoMdSync />} onClick={() => setSyncInfo({ ivSetCode: redux.authen.mSetInfo.setCode, paramYM: redux.authen.mSetInfo.ym, paramWCNO: oWcnoInfo.wcno, paramBy: redux.authen.sName })} >Sync ALPHA</Button></td>
                                                </tr>
                                            })
                                        }
                                        <tr className='font-bold bg-gray-500/5'>
                                            <td colSpan={3} className='border py-[16px] pl-[16px] font-bold'>Total</td>
                                            <td className='border text-end pr-[8px] drop-shadow-md bg-yellow-200'>{Number(TotalTag) > 0 && formattedNumber(TotalTag)}</td>
                                            <td className='border text-end pr-[8px] drop-shadow-md bg-blue-200'>{Number(TotalPhy) > 0 && formattedNumber(TotalPhy)}</td>
                                            <td className='border text-end pr-[8px] drop-shadow-md bg-blue-200'>{Number(TotalBk) > 0 && formattedNumber(TotalBk)}</td>
                                            <td className={`border text-end pr-[8px] drop-shadow-md font-semibold bg-red-200 ${Number(TotalVarianceMinus) < 0 && 'text-red-600 drop-shadow-lg'}`}>{Number(TotalVarianceMinus) < 0 && formattedNumber(TotalVarianceMinus)}</td>
                                            <td className={`border text-end pr-[8px] font-bold drop-shadow-md bg-green-200 ${Number(TotalVariancePlus) > 0 && 'text-green-700/75 drop-shadow-lg'} `}>{Number(TotalVariancePlus) > 0 && formattedNumber(TotalVariancePlus)}</td>
                                            <td className='border bg-sky-400'></td>
                                        </tr>
                                    </table>
                                </div>
                            })
                        })
                    }
                </div>
            }

            <ModalCommitInfo open={openModal} close={setOpenModel} wcno={wcnoSelected} />
            <ModalCommitSyncConfirm open={openModalSync} close={setOpenModalSync} data={SyncInfo} load={initDatas} />
        </div>
    )
}

export default Commit