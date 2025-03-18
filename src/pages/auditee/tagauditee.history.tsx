
import { HistoryAuditee } from "@/interface/summarypart.interface";
import { LoadingOutlined } from "@ant-design/icons";
import { Modal, Spin } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useEffect, useState } from "react";


interface Props {
    open: boolean;
    close: any;
    history: HistoryAuditee[];
}

function TagHistoryAuditee(props: Props) {

    const { open, close, history } = props;
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        if (!history) {
            setLoading(false)
        }
    }, [history])


    const columns: ColumnsType<HistoryAuditee> = [
        {
            title: 'WC',
            dataIndex: 'wcno',
            key: 'wcno',
            align: 'center' as 'center',
            width: 120
        },
        {
            title: <div className="text-center">TAG NO</div>,
            dataIndex: 'tagNo',
            key: 'tagno',
            align: 'center' as 'center',
            width: 200
        },
        {
            title: <div className="text-center">PART</div>,
            dataIndex: 'partNo',
            key: 'partNo',
            render: (_text: any, row: { partNo: string, partName: string }) => {
                return (
                    <span>
                        {row.partNo} <br /> {row.partName}
                    </span>
                )
            }
        },
        {
            title: <div className="text-center">ANUDITEE QTY</div>,
            dataIndex: 'auditeeQty',
            key: 'auditeeQty',
            align: 'right' as 'right',
            sorter: (a: any, b: any) => a.auditeeQty - b.auditeeQty,
            render: (_text: any, row: { auditeeQty: number }) => {
                return row.auditeeQty.toLocaleString();
            }
        },
        {
            title: <div className="text-center">AUDITEE</div>,
            dataIndex: 'auditeeBy',
            key: 'auditeeBy',
            render: (_text: any, row: { auditeeBy: string, auditeeDate: string }) => {
                return (
                    <span>
                        {row.auditeeBy} <br /> ({dayjs(row.auditeeDate).format('DD/MMM/YYYY HH:mm')})
                    </span>
                )
            }
        },
    ]

    return (
        <>
            {loading && open && (
                <Modal open={open} onCancel={() => close(false)} onClose={() => close(false)} footer={<></>} width='80%' height='80%' >
                    <head className="flex flex-col px-8 py-8">
                        <div className="flex flex-row justify-center items-cente mt-3">
                            <p className="w-full mr-4 py-8 border border-gray-500 rounded-2xl bg-[#D4EBF8] text-3xl text-black font-bold text-center">
                                ประวัติการบันทึกรายการนับวัตถุดิบของแต่ละสายการผลิต (Auditee)
                            </p>
                        </div>
                    </head >
                    <body className="flex w-full py-4 px-9 justify-center mt-5">
                        <div className="overflow-x-auto max-h-[700px]">
                            {
                                history && history.length > 0 ? (
                                    <Table<HistoryAuditee>
                                        columns={columns}
                                        dataSource={history}
                                        rowKey={(recode: { wcno: any }) => recode.wcno}
                                        pagination={false}
                                        scroll={{ y: 500 }}
                                    />
                                ) : (
                                    <div className="flex flex-col justify-center h-full w-full">
                                        <Spin indicator={<LoadingOutlined spin />} size='large'/>
                                        <span>กำลังโหลดข้อมูล</span>
                                    </div>
                                )
                            }

                        </div>
                    </body>
                </Modal>
            )
            }

        </>
    )
}

export default TagHistoryAuditee