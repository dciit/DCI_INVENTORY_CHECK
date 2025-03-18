import dayjs from "dayjs";
import { API_TAG_HISTORY_AUDITEE } from "@/service/tag.service";
// import { ReduxInterface } from "@/interface/main.interface";
// import { useSelector } from "react-redux";
import { Button, Modal, Spin, Table } from "antd";
import { useEffect, useState } from "react";
// import { RiFileHistoryLine } from "react-icons/ri";
import TagHistoryAuditee from "./tagauditee.history";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { HistoryAuditee, TagData } from "@/interface/summarypart.interface";
import { ColumnsType } from "antd/es/table";
import { LoadingOutlined } from "@ant-design/icons";


interface Props {
    open: boolean;
    close: any
    tagData: TagData[];
}

function DetailSumAuditee(props: Props) {

    const { open, close, tagData } = props;
    // const oAccount: ReduxInterface = useSelector((state: any) => state.reducer);


    const [isModalHistory, setIsModalHistory] = useState<boolean>(false);
    const [HistoryData, setHistoryData] = useState<HistoryAuditee[]>([]);
    const [load, setLoad] = useState<boolean>(true);

    const handleModalHistory = async (data: TagData) => {
        setHistoryData([]);

        const resHistoryData = await API_TAG_HISTORY_AUDITEE(
            'SET20250217WPDC3U608341659000001',
            '202502',
            data.wcno.toString(),
            data.partNo,
            data.cm
        )
        setHistoryData(resHistoryData);
        setIsModalHistory(true);
    }

    const exportToExcel = (history: any[], fileName: string) => {

        const wb = XLSX.utils.book_new();

        let newobj: any = [];
        history.map((item: HistoryAuditee) => {

            newobj = [...newobj, ...[{
                wcno: item.wcno,
                tagNo: item.tagNo,
                partNo: item.partNo,
                cm: item.cm,
                partName: item.partName,
                auditeeBy: item.auditeeBy,
                auditeeQty: item.auditeeQty
            }]]
        });

        const ws1 = XLSX.utils.json_to_sheet(newobj);
        XLSX.utils.book_append_sheet(wb, ws1, "Amount_Auditee_Check");

        // const ws2 = XLSX.utils.json_to_sheet(newsumdata);
        // XLSX.utils.book_append_sheet(wb, ws2, "Summary Data");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(dataBlob, `${fileName}.xlsx`);
    };


    const handlePrint = () => {
        if (tagData.length === 0) {
            alert("ไม่มีข้อมูลประวัติสำหรับพิมพ์");
            return;
        }

        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>ประวัติการ Auditee</title>
                        <style>
                            table { width: 100%; border-collapse: collapse; }
                            th, td { border: 1px solid black; padding: 8px; text-align: center; }
                            th { background-color: #f2f2f2; }
                        </style>
                    </head>
                    <body>
                        <h2 style="text-align: center;">ประวัติการ Auditee</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>WC</th>
                                    <th>TAG NO</th>
                                    <th>Part No</th>
                                    <th>CM</th>
                                    <th>Auditee By</th>
                                    <th>Auditee Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tagData.map((item: { wcno: any; tagNo: any; partNo: any; cm: any; partName: any; auditeeBy: any; auditeeQty: any; auditeeDate: string | number | Date | dayjs.Dayjs | null | undefined; }) => `
                                    <tr>
                                        <td>${item.wcno}</td>
                                        <td>${item.tagNo}</td>
                                        <td>${item.partNo}</td>
                                        <td>${item.cm}</td>
                                        <td>${item.auditeeBy}</td>
                                        <td>${(item.auditeeQty).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };


    useEffect(() => {
        if (!tagData) {
            setLoad(false)
        }
    }, [tagData]);


    const columns: ColumnsType<TagData> = [
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
                    <span >
                        {row.partNo} <br /> {row.partName}
                    </span>
                );
            }
        },
        {
            title: <div className="text-center">AUDITEE QTY</div>,
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
        {
            title: <div className="text-center">OPERATION</div>,
            dataIndex: 'operation',
            render: (_text: any, row: TagData) => {
                return (
                    <div className="flex justify-center">
                        <Button type="primary" onClick={() => handleModalHistory(row)}>
                            ดูรายละเอียด
                        </Button>
                    </div>

                );
            },
        }
    ]

    return (
        <>
            {load && open && (
                <Modal open={open} onCancel={() => close(false)} onClose={() => close(false)} footer={<></>} width='80%' height='80%'  >
                    <head className="flex flex-col px-4 py-4">
                        <div className="flex flex-row justify-center items-cente mt-3">
                            <p className="w-full mx-3 py-8 border border-gray-500 rounded-2xl bg-[#D4EBF8] text-3xl text-black font-bold text-center">
                                รายการนับวัตถุดิบของแต่ละสายการผลิต (Auditee)
                            </p>
                        </div>
                        <div className="flex flex-row mt-4">
                            <div className="">
                                <button
                                    onClick={() => exportToExcel(tagData, "Amount_Auditee_Check")}
                                    className="text-green-700 border-2 border-green-700 bg-white hover:bg-green-600 hover:text-white focus:outline-none focus:ring-green-700 font-medium rounded-lg text-lg  px-3 py-3 ml-3  text-center "
                                >
                                    Export to Excel
                                </button>
                            </div>
                            <div className="">
                                <button
                                    onClick={handlePrint}
                                    className="text-green-700 border-2 border-green-700 bg-white hover:bg-green-600 hover:text-white focus:outline-none focus:ring-green-700 font-medium rounded-lg text-lg  px-3 py-3 ml-3  text-center "
                                >
                                    Print
                                </button>
                            </div>
                        </div>
                    </head >
                    <body className="flex justify-center mx-4">
                        <div className="overflow-x-auto max-h-[500px] ml-3">
                            {
                                tagData && tagData.length > 0 ? (
                                    <Table<TagData>
                                        columns={columns}
                                        dataSource={tagData}
                                        rowKey={(recode: { wcno: any }) => recode.wcno}
                                        scroll={{ y: 500 }}
                                    />
                                ) : (
                                    <div className='flex flex-col justify-center items-center  h-full w-full'>
                                        <Spin indicator={<LoadingOutlined spin />} size="large" />
                                        <span>กำลังโหลดข้อมูล</span>
                                    </div>
                                )
                            }



                        </div>
                    </body>

                    <TagHistoryAuditee open={isModalHistory} close={setIsModalHistory} history={HistoryData} />
                </Modal>
            )}
        </>

    )
}

export default DetailSumAuditee


