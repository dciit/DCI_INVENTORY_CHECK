import ModalCommitSyncConfirm from '@/components/summary/modal.commit.sync.confirm';
import { APIGetCommitGetHeader } from '@/service/invsave.service';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import { useEffect, useState } from 'react'
import { IoMdSync } from "react-icons/io";
import { useSelector } from 'react-redux';
import Navbar from '@/components/main/navbar';
import Table, { ColumnsType } from 'antd/es/table';
import ModalCommitInfoReview from '@/components/summary/modal.commitinfo';

interface PropGrp {
    grpCode: string;
    grpName: string;
}
// interface PropGrpDatas {
//     grpCode: string;
//     grpInfo: any[];
// }
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
        { grpCode: 'TOTAL', grpName: '' },
        { grpCode: 'C000', grpName: 'PD Fac ODM ODM' },
        { grpCode: '1000', grpName: 'PD Fac 2   1YC' },
        { grpCode: '2100', grpName: 'PD Fac 2   2YC' },
        { grpCode: '2200', grpName: 'PD Fac 2   SCROLL' },
        { grpCode: '2300', grpName: 'PD Fac 2   MOTOR' },
        { grpCode: '3100', grpName: 'PD Fac 3   1YC' },
        { grpCode: '3200', grpName: 'PD Fac 3   2YC' }
    ]
    const [grpSelected, _setGrpSelected] = useState<PropGrp>({
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
                            "ivSetCode": 'SET20250217WPDC3U608341659000001',
                            "paramYM": '202502',
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
            // console.log(grpDatas)
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


    const calculateTotals = () => {
        let TotalTag: number = 0;
        let TotalPhy: number = 0;
        let TotalBk: number = 0;
        let TotalMinus: number = 0;
        let TotalPlus: number = 0;

        GrpHeaders.map((n) => {
            n.grpInfo.map((nn: any) => {
                TotalTag += Number(nn.auditorAMT);
                TotalPhy += Number(nn.phyamt);
                TotalBk += Number(nn.bkamt);
                TotalMinus -= Number(nn.diffAMT) < 0 ? Number(Math.abs(nn.diffAMT)) : 0;
                TotalPlus += Number(nn.diffAMT) > 0 ? Number(Math.abs(nn.diffAMT)) : 0;
            })
        });

        return {
            TotalTag,
            TotalPhy,
            TotalBk,
            TotalMinus,
            TotalPlus
        }
    }

    const totals = calculateTotals();

    const columns: ColumnsType<{}> = [
        {
            dataIndex: 'lable',
            key: 'lable',
            align: 'left' as 'left',
            render: () => 'ผลรวมทั้งหมด',
            className: 'text-lg font-bold',
            width: '25%'
        },
        {
            dataIndex: 'TotalTag',
            key: 'TotalTag',
            align: 'right' as 'right',
            render: () => Number(totals.TotalTag.toFixed(2)).toLocaleString('en'),
            width: '10%',
            className: 'bg-yellow-100 font-bold text-lg',
        },
        {
            dataIndex: 'TotalPhy',
            key: 'Totalphy',
            render: () => Number(totals.TotalPhy.toFixed(2)).toLocaleString('en'),
            width: '12.5%',
            align: 'right' as 'right',
            className: 'bg-blue-100 font-bold text-lg'
        },
        {
            dataIndex: 'TotalBk',
            key: 'TotalBk',
            render: () => Number(totals.TotalBk.toFixed(2)).toLocaleString('en'),
            width: '10.5%',
            align: 'right' as 'right',
            className: 'bg-blue-300 font-bold text-lg',
        },
        {
            dataIndex: 'TotalMinus',
            key: 'TotalMinus',
            render: () => (Number(totals.TotalMinus) < 0 ? Number(totals.TotalMinus.toFixed(2)).toLocaleString('en') : ''),
            width: '10.5%',
            align: 'right' as 'right',
            className: 'bg-red-100 font-bold text-lg'
        },
        {
            dataIndex: 'TotalPlus',
            key: 'TotalPlus',
            render: () => (Number(totals.TotalPlus) > 0 ? Number(totals.TotalPlus.toFixed(2)).toLocaleString('en') : ''),
            width: '11%',
            align: 'right' as 'right',
            className: 'bg-green-200 font-bold text-lg'
        },
        {
            dataIndex: 'Total',
            key: 'NetTotal',
            align: 'right' as 'right',
            className: 'bg-orange-200 text-lg font-bold',
            width: '10%',
            render: () => {
                return Number(
                    (
                        (Number(totals.TotalMinus) < 0 ? Number(totals.TotalMinus) : 0) +
                        (Number(totals.TotalPlus) > 0 ? Number(totals.TotalPlus) : 0)
                    ).toFixed(2)
                ).toLocaleString('en')
            }
        },
        {
            className: 'w-[20%]'
        }
    ]

    const data = [
        {
            key: '1',
            TotalTag: totals.TotalTag,
            TotalPhy: totals.TotalPhy,
            TotalBk: totals.TotalBk,
            TotalMinus: totals.TotalMinus,
            TotalPlus: totals.TotalPlus,
            NetTotal: totals.TotalMinus + totals.TotalPlus,
        },
    ];

    const columnsbody = [
        {
            title: 'NO',
            dataIndex: 'no',
            key: 'no',
            className: 'border text-lg',
            align: 'center' as 'center',
            render: (_text: string, recode: any, index: number) => {
                return (
                    <span
                        onClick={() => setWcnoSelected(recode.wcno)}
                        className='cursor-pointer'
                    >
                        {index + 1}
                    </span>
                );
            },
            // sorter: (a: any, b: any) => (a.index || 0) - (b.index || 0)
        },
        {
            title: 'WC',
            dataIndex: 'wcno',
            key: 'wcno',
            className: 'border text-lg',
            align: 'center' as 'center',
            render: (_text: string, record: any, _index: number) => {
                return (
                    <span
                        onClick={() => setWcnoSelected(record.wcno)}
                        className='cursor-pointer'
                    >
                        {record.wcno}
                    </span>
                )
            },
            sorter: (a: any, b: any) => (a.wcno - b.wcno)
        },
        {
            title: <div className='text-center'>LINE NAME</div>,
            dataIndex: 'wcnO_NAME',
            key: 'wcnO_NAME',
            className: 'border text-lg',
            align: 'left' as 'left',
            width: '15%',
            render: (_text: string, record: any, _index: number) => {
                return (
                    <span
                        onClick={() => setWcnoSelected(record.wcno)}
                        className='cursor-pointer'
                    >
                        {record.wcnO_NAME}
                    </span>
                )
            }
        },
        {
            title: 'IN HOUSE',
            className: 'border text-lg',
            align: 'center' as 'center',
            children: [
                {
                    title: <div className='text-center'>QRCODE SYSTEM(AMT)</div>,
                    dataIndex: 'auditorAMT',
                    key: 'auditorAMT',
                    align: 'right' as 'right',
                    sorter: (a: any, b: any) => a.auditorAMT - b.auditorAMT,
                    render: (_text: any, record: any) => (
                        <div
                            className="text-right px-2 cursor-pointer"
                            onClick={() => setWcnoSelected(record.wcno)}
                        >
                            {Number(record.auditorAMT) !== 0
                                ? Number((record.auditorAMT).toFixed(2)).toLocaleString('en')
                                : ''}
                        </div>
                    ),
                    width: '10%',
                    className: 'border text-lg bg-yellow-100',
                }

            ]
        },
        {
            title: 'ALPHA',
            className: 'border text-lg',
            align: 'center' as 'center',
            children: [
                {
                    title: 'COUNT (AMT)',
                    dataIndex: 'phyamt',
                    key: 'phyamt',
                    className: 'border text-lg bg-blue-100',
                    align: 'center' as 'center',
                    sorter: (a: any, b: any) => a.phyamt - b.phyamt,
                    render: (_text: any, record: any) => (
                        <div
                            style={{ display: 'flex', justifyContent: 'flex-end' }}
                            onClick={() => setWcnoSelected(record.wcno)}
                        >
                            {Number(record.phyamt) !== 0
                                ? Number((record.phyamt).toFixed(2)).toLocaleString('en')
                                : ''}
                        </div>
                    )
                },


                {
                    title: 'BOOK (AMT)',
                    dataIndex: 'bkamt',
                    key: 'bkamt',
                    className: 'border text-lg bg-blue-200',
                    align: 'center' as 'center',
                    sorter: (a: any, b: any) => a.bkamt - b.bkamt,
                    render: (_text: any, record: any) => (
                        <div
                            style={{ display: 'flex', justifyContent: 'flex-end' }}
                            onClick={() => setWcnoSelected(record.wcno)}
                        >
                            {Number(record.bkamt) !== 0
                                ? Number((record.bkamt).toFixed(2)).toLocaleString('en')
                                : ''}
                        </div>
                    )
                },
                {
                    title: 'VARIANCE',
                    className: 'border text-lg',
                    align: 'center' as 'center',
                    children: [
                        {
                            title: 'Variance(-)',
                            dataIndex: 'diffAMT',
                            key: 'varianceMinus',
                            className: 'border text-lg bg-red-100',
                            align: 'center' as 'center',
                            sorter: (a: any, b: any) => a.diffAMT - b.diffAMT,
                            render: (_text: any, record: any) => (
                                <div
                                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                                    onClick={() => setWcnoSelected(record.wcno)}
                                >
                                    {Number(record.diffAMT) < 0
                                        ? formattedNumber(record.diffAMT)
                                        : 0}
                                </div>
                            )
                        },
                        {
                            title: 'Variance(+)',
                            dataIndex: 'diffAMT',
                            key: 'variancePlus',
                            className: 'border text-lg bg-green-200',
                            align: 'center' as 'center',
                            sorter: (a: any, b: any) => a.diffAMT - b.diffAMT,
                            render: (_text: any, record: any) => (
                                <div
                                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                                    onClick={() => setWcnoSelected(record.wcno)}
                                >
                                    {Number(record.diffAMT) > 0
                                        ? formattedNumber(record.diffAMT)
                                        : 0}
                                </div>
                            )
                        },
                        {
                            title: 'Total',
                            dataIndex: 'diffAMT',
                            key: 'varianceTotal',
                            className: 'border text-lg bg-orange-200',
                            align: 'center' as 'center',
                            sorter: (a: any, b: any) => a.diffAMT - b.diffAMT,
                            render: (_text: any, record: any) => (
                                <div
                                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                                    onClick={() => setWcnoSelected(record.wcno)}
                                >
                                    {Number(record.diffAMT) < 0 && formattedNumber(record.diffAMT)}
                                    {Number(record.diffAMT) > 0 && formattedNumber(record.diffAMT)}
                                </div>
                            )
                        },
                        {
                            key: 'sync',
                            align: 'center',
                            render: (_: any, _record: any) => (
                                <Button
                                    type="primary"
                                    size="small"
                                    icon={<IoMdSync />}
                                    onClick={() => setSyncInfo({
                                        ivSetCode: 'SET20250217WPDC3U608341659000001',
                                        paramYM: '202502',
                                        paramWCNO: 'WC001',
                                        paramBy: 'ANUTHIDA>W'
                                    })}
                                >
                                    Sync ALPHA
                                </Button>
                            ),
                        },
                    ]
                }
            ]
        }
    ]

    return (
        <div className=' h-full w-full'>
            {
                load ? <div className='flex flex-col justify-center items-center gap-[16px] h-full w-full bg-gray-50 '>
                    <Spin indicator={<LoadingOutlined spin />} size="large" />
                    <span>กำลังโหลดข้อมูล</span>
                </div> :
                    <div>
                        <Navbar />
                        <Table
                            columns={columns}
                            dataSource={data}
                            pagination={false}
                            bordered
                        />

                        {oMasterGrp.filter(g => g.grpCode !== 'TOTAL').map((group) => {
                            // Aggregate the totals for each group
                            let TotalTag: number = 0;
                            let TotalPhy: number = 0;
                            let TotalBk: number = 0;
                            let TotalVarianceMinus: number = 0;
                            let TotalVariancePlus: number = 0;

                            const dataSource = GrpHeaders
                                .filter(n => n.grpCode === group.grpCode)
                                .flatMap(o => o.grpInfo.map((info: any, i: number) => {
                                    const auditorAMT = Number(info.auditorAMT);
                                    const phyamt = Number(info.phyamt);
                                    const bkamt = Number(info.bkamt);
                                    const diffAMT = Number(info.diffAMT);

                                    // Sum up the totals
                                    TotalTag += auditorAMT;
                                    TotalPhy += phyamt;
                                    TotalBk += bkamt;
                                    TotalVarianceMinus += diffAMT < 0 ? diffAMT : 0;
                                    TotalVariancePlus += diffAMT > 0 ? diffAMT : 0;

                                    return {
                                        key: i.toString(),
                                        rowSpan: i === 0 ? o.grpInfo.length : 0,
                                        grpName: group.grpName,
                                        index: i + 1,
                                        wcno: info.wcno,
                                        wcnO_NAME: info.wcnO_NAME,
                                        auditorAMT,
                                        phyamt,
                                        bkamt,
                                        diffAMT
                                    };
                                }));

                            return (
                                <div key={group.grpCode} className="mt-10 mb-16">
                                    <h2 className="text-lg font-semibold border border-gray-300 text-center py-4 bg-gray-300">
                                        {group.grpName}
                                    </h2>

                                    {/* Table to display data */}
                                    <Table
                                        columns={columnsbody}
                                        dataSource={dataSource}
                                        bordered
                                        pagination={false}
                                        summary={() => (
                                            <Table.Summary.Row className="text-lg text-right font-bold">
                                                {/* Total label */}
                                                <Table.Summary.Cell colSpan={3} index={0}>
                                                    Total
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={0} className='bg-yellow-200'>
                                                    {TotalTag > 0 ? TotalTag.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={0} className='bg-blue-200'>
                                                    {TotalPhy > 0 ? TotalPhy.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={0} className='bg-blue-300'>
                                                    {TotalBk > 0 ? TotalBk.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={0} className={`font-semibold bg-red-200 ${TotalVarianceMinus < 0 && 'text-red-600 drop-shadow-lg'}`}>
                                                    {TotalVarianceMinus < 0 ? TotalVarianceMinus.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={0} className={`font-bold bg-green-300 ${TotalVariancePlus > 0 && 'text-green-700 drop-shadow-lg'}`}>
                                                    {TotalVariancePlus > 0 ? TotalVariancePlus.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={0} className={`font-bold bg-orange-300 ${TotalVariancePlus > 0 ? 'drop-shadow-lg' : ''}`}>
                                                    {((TotalVarianceMinus < 0 ? TotalVarianceMinus : 0) + (TotalVariancePlus > 0 ? TotalVariancePlus : 0))
                                                        .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                        )}
                                    />

                                </div>
                            );
                        })}
                    </div>

            }

            <ModalCommitInfoReview open={openModal} close={setOpenModel} wcno={wcnoSelected} />
            <ModalCommitSyncConfirm open={openModalSync} close={setOpenModalSync} data={SyncInfo} load={initDatas} />
        </div>
    )
}

export default Commit