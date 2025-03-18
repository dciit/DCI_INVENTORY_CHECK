import { APIGetCommitInfo } from '@/service/invsave.service';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Modal, Spin, Table } from 'antd'
import { ColumnsType } from 'antd/es/table';
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
function ModalCommitInfoReview(props: PropModalCommitInfo) {
    const { open, close, wcno } = props;
    const redux = useSelector((state: any) => state.reducer);
    const [infos, setInfos] = useState<PropInfos[]>([]);
    const [load, setLoad] = useState<boolean>(true);

    useEffect(() => {
        init();
    }, [open])

    const init = async () => {
        setLoad(true)
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
        setLoad(false)
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


    const columns: ColumnsType<PropInfos> = [
        {
            title: `WCNO: ${wcno}`,
            dataIndex: 'wcno',
            key: 'wcno',
            className: 'border text-sm',
            children: [
                {
                    title: 'NO.',
                    dataIndex: 'no',
                    key: 'no',
                    className: 'border text-sm',
                    align: 'center' as 'center',
                    width: 5,
                    render: (_text: string, _recode: any, index: number) => {
                        return (
                            <span>{index + 1}</span>
                        )
                    },
                    sorter: (a: any, b: any) => (a.index || 0) - (b.index || 0),
                },
                {
                    title: <div className='text-center'>PART</div>,
                    dataIndex: 'partno',
                    key: 'partno',
                    className: 'border text-sm',
                    render: (_text: string, recode: any) => {
                        return (
                            <span>{recode.partno} <br /> {recode.partname}</span>
                        )
                    }

                },
            ],
        },
        {
            title: 'IN HOUSE',
            className: 'border text-lg',
            align: 'center',
            children: [
                {
                    title: <div className='text-center'>QRCODE SYSTEM(AMT)</div>,
                    dataIndex: 'auditorAMT',
                    key: 'auditorAMT',
                    align: 'right',
                    className: 'border',
                    children: [
                        {
                            title: 'QTY',
                            dataIndex: 'auditorQty',
                            key: 'auditorQty',
                            className: 'border border-gray-300 bg-yellow-50',
                            sorter: (a, b) => a.auditorQty - b.auditorQty,
                            render: (_text: string, reocde: any) => (
                                <div className='text-right px-2 cursor-pointer'>
                                    {
                                        Number(reocde.auditorQty) != 0
                                            ? Number((reocde.auditorQty).toFixed(2)).toLocaleString('en')
                                            : ''
                                    }
                                </div>
                            )
                        },
                        {
                            title: 'AMT',
                            dataIndex: 'auditorAMT',
                            key: 'auditorAMT',
                            className: 'border border-gray-300 bg-yellow-50',
                            sorter: (a, b) => a.auditorAMT - b.auditorAMT,
                            render: (_ext: string, recode: any) => (
                                <div className='text-right px-2 cursor-pointer'>
                                    {
                                        Number(recode.auditorAMT) != 0
                                            ? Number((recode.auditorAMT).toFixed(2)).toLocaleString('en')
                                            : ''
                                    }
                                </div>
                            )
                        },
                    ],
                },
            ],
        },
        {
            title: 'ALPHA',
            className: 'border text-lg',
            align: 'center',
            children: [
                {
                    title: 'COUNT(AMT)',
                    align: 'center',
                    className: 'border',
                    children: [
                        {
                            title: 'QTY',
                            dataIndex: 'phyqty',
                            key: 'phyqty',
                            className: 'border border-gray-300 bg-blue-50',
                            sorter: (a, b) => a.phyqty - b.phyqty,
                            render: (_text: string, recode: any) => (
                                <div className='text-right px-2 cursor-pointer'>
                                    {
                                        Number(recode.phyqty) != 0
                                            ? Number((recode.phyqty).toFixed(2)).toLocaleString('en')
                                            : ''
                                    }
                                </div>
                            ),
                        },
                        {
                            title: 'AMT',
                            dataIndex: 'phyamt',
                            key: 'phyamt',
                            className: 'border border-gray-300 bg-blue-50',
                            sorter: (a, b) => a.phyamt - b.phyamt,
                            render: (_text: string, recode: any) => (
                                <div className='text-right px-2 cursor-pointer'>
                                    {
                                        Number(recode.phyamt) != 0
                                            ? Number((recode.phyamt).toFixed(2)).toLocaleString('en')
                                            : ''
                                    }
                                </div>
                            ),
                        },
                    ],
                },
                {
                    title: 'BOOK(AMT)',
                    align: 'center',
                    className: 'border',
                    children: [
                        {
                            title: 'QTY',
                            dataIndex: 'bkqty',
                            key: 'bkqty',
                            className: 'border border-gray-300 bg-sky-100',
                            sorter: (a, b) => a.bkqty - b.bkqty,
                            render: (_text: string, recode: any) => (
                                <div className='text-right px-2 cursor-pointer'>
                                    {
                                        Number(recode.bkqty) != 0
                                            ? Number((recode.bkqty).toFixed(2)).toLocaleString('en')
                                            : ''
                                    }
                                </div>
                            ),
                        },
                        {
                            title: 'AMT',
                            dataIndex: 'bkamt',
                            key: 'bkamt',
                            className: 'border border-gray-300 bg-sky-100',
                            sorter: (a, b) => a.bkamt - b.bkamt,
                            render: (_text: string, recode: any) => (
                                <div className='text-right px-2 cursor-pointer'>
                                    {
                                        Number(recode.bkamt) != 0
                                            ? Number((recode.bkamt).toFixed(2)).toLocaleString('en')
                                            : ''
                                    }
                                </div>
                            ),

                        },
                    ],
                },
                {
                    title: 'VARIANCE',
                    align: 'center',
                    className: 'border',
                    children: [
                        {
                            title: 'Variance(-)',
                            className: 'border',
                            children: [
                                {
                                    title: 'QTY',
                                    dataIndex: 'diffQty',
                                    key: 'diffQty',
                                    className: 'border border-gray-300 bg-red-50',
                                    sorter: (a, b) => a.diffQty - b.diffQty,
                                    render: (_text: string, recode: any) => (
                                        <div className='text-right px-2 cursor-pointer'>
                                            {
                                                Number(recode.diffQty) < 0
                                                    ? formattedNumber(recode.diffQty)
                                                    : ''
                                            }
                                        </div>
                                    )
                                },
                                {
                                    title: 'AMT',
                                    dataIndex: 'diffAMT',
                                    key: 'diffAMT',
                                    className: 'border border-gray-300 bg-red-50',
                                    sorter: (a, b) => a.diffAMT - b.diffAMT,
                                    render: (_text: string, recode: any) => (
                                        <div className='text-right px-2 cursor-pointer'>
                                            {
                                                Number(recode.diffAMT) < 0
                                                    ? formattedNumber(recode.diffAMT)
                                                    : ''
                                            }
                                        </div>
                                    )
                                },
                            ],
                        },
                        {
                            title: 'Variance(+)',
                            className: 'border',
                            children: [
                                {
                                    title: 'QTY',
                                    dataIndex: 'diffQty',
                                    key: 'diffQty',
                                    className: 'border border-gray-300 bg-red-100',
                                    sorter: (a, b) => a.diffQty - b.diffQty,
                                    render: (_text: string, recode: any) => (
                                        <div className='text-right px-2 cursor-pointer'>
                                            {
                                                Number(recode.diffQty) > 0
                                                    ? formattedNumber(recode.diffQty)
                                                    : ''
                                            }
                                        </div>
                                    )
                                },
                                {
                                    title: 'AMT',
                                    dataIndex: 'diffAMT',
                                    key: 'diffAMT',
                                    className: 'border border-gray-300 bg-red-100',
                                    sorter: (a, b) => a.diffAMT - b.diffAMT,
                                    render: (_text: string, recode: any) => (
                                        <div className='text-right px-2 cursor-pointer'>
                                            {
                                                Number(recode.diffAMT) > 0
                                                    ? formattedNumber(recode.diffAMT)
                                                    : ''
                                            }
                                        </div>
                                    )
                                },
                            ],
                        },
                        {
                            title: 'Total',
                            align: 'center',
                            className: 'border',
                            children: [
                                {
                                    title: 'QTY',
                                    dataIndex: 'diffQty',
                                    key: 'diffQty',
                                    className: 'border border-gray-300 bg-orange-50',
                                    sorter: (a, b) => a.diffQty - b.diffQty,
                                    render: (_text: string, recode: any) => (
                                        <div className='text-right px-2 cursor-pointer'>
                                            {formattedNumber(recode.diffQty)}
                                        </div>
                                    )
                                },
                                {
                                    title: 'AMT',
                                    dataIndex: 'diffAMT',
                                    key: 'diffAMT',
                                    className: 'border border-gray-300 bg-orange-50',
                                    sorter: (a, b) => a.diffAMT - b.diffAMT,
                                    render: (_text: string, recode: any) => (
                                        <div className='text-right px-2 cursor-pointer'>
                                            {formattedNumber(recode.diffAMT)}
                                        </div>
                                    )
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ];







    return (
        load ? (
            <div className="flex flex-col justify-center items-center gap-[16px] h-full w-full bg-gray-50">
                <Spin indicator={<LoadingOutlined spin />} size="large" />
                <span>กำลังโหลดข้อมูล</span>
            </div>
        ) : (
            < Modal open={open} onClose={() => close(false)
            } onCancel={() => close(false)} footer={<></>} width='75%' >
                <head className='flex'>
                    <p className='text-lg font-bold'>หน้ารายละเอียด</p>
                </head>
                <body className='m-3'>
                    <div className='overflow-x-auto max-h-[700px]'>
                        
                        <Table
                            columns={columns}
                            dataSource={infos}
                            bordered
                            pagination={false}
                            summary={() => (
                                <Table.Summary.Row className='text-right font-bold border border-gray-300'>
                                    <Table.Summary.Cell colSpan={2} index={0}>
                                        Total
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={0} className='bg-yellow-100 border border-gray-300'>
                                        {FnSummary('auditorQty').toLocaleString('en')}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={0} className='bg-yellow-100 border border-gray-300'>
                                        {FnSummary('auditorAMT').toLocaleString('en')}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={0} className='bg-blue-100 border border-gray-300'>
                                        {FnSummary('phyqty').toLocaleString('en')}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={0} className='bg-blue-100 border border-gray-300'>
                                        {FnSummary('phyamt').toLocaleString('en')}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={0} className='bg-sky-200 border border-gray-300'>
                                        {FnSummary('bkqty').toLocaleString('en')}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={0} className='bg-sky-200 border border-gray-300'>
                                        {FnSummary('bkamt').toLocaleString('en')}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={0} className='bg-red-100 border border-gray-300'>
                                        {FnSummary('diffQty', 'negative') != 0 ? FnSummary('diffQty', 'negative').toLocaleString('en') : ''}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={0} className='bg-red-100 border border-gray-300'>
                                        {FnSummary('diffAMT', 'negative') != 0 ? FnSummary('diffAMT', 'negative').toLocaleString('en') : ''}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={0} className='bg-red-200 border border-gray-300'>
                                        {FnSummary('diffQty', 'positive') != 0 ? FnSummary('diffQty', 'positive').toLocaleString('en') : ''}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={0} className='bg-red-200 border border-gray-300'>
                                        {FnSummary('diffAMT', 'positive') != 0 ? FnSummary('diffAMT', 'positive').toLocaleString('en') : ''}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={0} className='bg-orange-100 border border-gray-300'>
                                        {FnSummary('diffQty').toLocaleString('en')}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={0} className='bg-orange-100 border border-gray-300'>
                                        {FnSummary('diffAMT').toLocaleString('en')}
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            )}
                        />
                    </div>
                </body>
                <footer className='mt-3'>
                    <div className='text-end mr-5'>
                        <Button onClick={() => close(false)}>ปิดหน้าต่าง</Button>
                    </div>
                </footer>

            </Modal >
        )

    )
}

export default ModalCommitInfoReview