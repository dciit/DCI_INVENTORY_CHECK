
import { HistoryAuditor } from "@/interface/summarypart.interface";
import { Modal } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

interface Props {
    open: boolean;
    close: any;
    history: HistoryAuditor[];
}

function TagHistoryAuditor(props: Props) {
    const { open, close, history } = props;


    if (!history) {
        return <p>No data available.</p>;
    }

    const columns: ColumnsType<HistoryAuditor> = [
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
            key: 'tagNo',
            align: 'center' as 'center',
            width: 200
        },
        {
            title: <div className="text-center">PART</div>,
            dataIndex: 'partNo',
            key: 'PartNo',
            render: (_text: any, row: { partNo: string, partName: string}) => {
                return (
                    <span>
                        {row.partNo} <br /> {row.partName}
                    </span>
                )
            }
        },
        {
            title: <div className="text-center">AUDITOR QTY</div>,
            dataIndex: 'auditorQty',
            key: 'auditorQty',
            align: 'right' as 'right',
            sorter: (a: any, b: any) => a.auditorQty - b.auditorQty,
            render: (_text: any, row: { auditorQty: number }) => {
                return row.auditorQty.toLocaleString();
            }
        },
        {
            title: <div className="text-center">AUDITOR</div>,
            dataIndex: 'auditorBy',
            key: 'auditorBy',
            render: (_text: any, row: { auditorBy: string, auditorDate: string }) => {
                return (
                    <span>
                        {row.auditorBy} <br /> ({dayjs(row.auditorDate).format('DD/MMM/YYYY HH:mm')})
                    </span>
                )
            }
        }
    ]


    return (
        <>
            <Modal open={open} onCancel={() => close(false)} onClose={() => close(false)} footer={<></>} width='90%' height='80%' >
                <head className="flex flex-col px-8 py-8">
                    <div className="flex flex-row justify-center items-cente mt-3">
                        <p className="w-full mr-4 py-8 border border-gray-500 rounded-2xl bg-[#D4EBF8] text-3xl text-black font-bold text-center">
                            ประวัติการบันทึกรายการนับวัตถุดิบของแต่ละสายการผลิต (Auditor)
                        </p>
                    </div>
                </head >
                <body className="flex w-full py-4 px-8 justify-center mt-5">
                    <div className="overflow-x-auto max-h-[700px]">

                        <Table<HistoryAuditor>
                            columns={columns}
                            dataSource={history}
                            rowKey={(recode: { wcno: any }) => recode.wcno}
                            pagination={false}
                            scroll={{ y: 500 }}
                        />
                    </div>
                </body>
            </Modal>
        </>
    )
}

export default TagHistoryAuditor