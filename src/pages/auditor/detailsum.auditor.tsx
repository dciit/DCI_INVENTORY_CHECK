import { Button, Modal, Spin } from "antd";
import TagHistoryAuditor from "./tagauditor.history";
import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { ReduxInterface } from "@/interface/main.interface";
import { API_TAG_HISTORY_AUDITOR } from "@/service/tag.service";
import dayjs from 'dayjs';
// import { RiFileHistoryLine } from "react-icons/ri";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { HistoryAuditor, TagData } from "@/interface/summarypart.interface";
import Table, { ColumnsType } from "antd/es/table";
import { LoadingOutlined } from "@ant-design/icons";


interface Props {
    open: boolean;
    close: any
    tagData: TagData[];
}


function DetailSumAuditor(props: Props) {

    const { open, close, tagData } = props;
    // const oAccount: ReduxInterface = useSelector((state: any) => state.reducer);

    const [isModalHistory, setIsModalHistory] = useState<boolean>(false);
    const [HistoryData, setHistoryData] = useState<any[]>([]);
    const [load, setLoad] = useState<boolean>(true);

    const handleModalHistory = async (data: TagData) => {
        setHistoryData([]);

        const resHistoryData = await API_TAG_HISTORY_AUDITOR(

            'SET20250217WPDC3U608341659000001',
            '202502',
            data.wcno,
            data.partNo,
            data.cm
        );
        setHistoryData(resHistoryData);
        setIsModalHistory(true);
    }


    const exportToExcel = (history: any[], fileName: string) => {

        const wb = XLSX.utils.book_new();

        let newobj: any = [];
        history.map((item: HistoryAuditor) => {

            newobj = [...newobj, ...[{
                wcno: item.wcno,
                tagNo: item.tagNo,
                partNo: item.partNo,
                cm: item.cm,
                partName: item.partName,
                auditorBy: item,
                auditorQty: item.auditorBy != '' ? item.auditorQty : ''
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
            alert('ไม่มีข้อมูลประวัติการพิมพ์');
            return;
        }

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>ประวัติการ Auditee</title>
                        <style>
                            table {width: 100%; border-collapse: collapse; }
                            th, td {border: 1px solid black; padding: 8px; text-align: center; }
                            th {background - color: #f2f2f2; }
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
                                    <th>Auditor By</th>
                                    <th>Auditor Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tagData.map((item: { wcno: any; tagNo: any; partNo: any; cm: any; partName: any; auditorBy: any; auditorQty: any; auditeeDate: string | number | Date | dayjs.Dayjs | null | undefined; }) => `
                                    <tr>
                                        <td>${item.wcno}</td>
                                        <td>${item.tagNo}</td>
                                        <td>${item.partNo}</td>
                                        <td>${item.cm}</td>
                                        <td>${item.auditorBy}</td>
                                        <td>${(item.auditorQty).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </body>
                </html>`);
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
            key: 'tagNo',
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
        },
        {
            title: <div className="text-center">OPERATION</div>,
            dataIndex: 'operation',
            render: (_text: any, row: TagData) => {
                return (
                    <div className="flex items-center justify-center">
                        <Button type="primary" onClick={() => handleModalHistory(row)}>
                            ดูรายละเอียด
                        </Button>
                    </div>

                );
            },
        }
    ]


    // const sumAuditeeQty = tagData.reduce((sum: any, item: any) => sum + (item.auditeeQty || 0), 0);

    return (
        <>
            {load && open && (
                <Modal open={open} onCancel={() => close(false)} onClose={() => close(false)} footer={<></>} width='90%' height='80%' >
                    <head className="flex flex-col px-8 py-8">
                        <div className="flex flex-row justify-center items-cente mt-3">
                            <p className="w-full mr-4 py-8 border border-gray-500 rounded-2xl bg-[#D4EBF8] text-3xl text-black font-bold text-center">
                                รายการนับวัตถุดิบของแต่ละสายการผลิต (Auditor)
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
                    <body className="flex w-full p-4 justify-center">
                        <div className="overflow-x-auto max-h-[700px] ml-3">
                            {
                                tagData && tagData.length > 0 ? (
                                    <Table<TagData>
                                        columns={columns}
                                        dataSource={tagData}
                                        rowKey={(recode: { wcno: any }) => recode.wcno}
                                        pagination={false}
                                        scroll={{ y: 500 }}
                                        // summary={() => (
                                        //     <Table.Summary.Row className="font-bold bg-yellow-50">
                                        //         <Table.Summary.Cell colSpan={3} index={0} className="text-right">
                                        //         </Table.Summary.Cell>
                                        //         <Table.Summary.Cell index={0} className="text-right">
                                        //             Total: {sumAuditeeQty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        //         </Table.Summary.Cell>
                                        //         <Table.Summary.Cell index={0} colSpan={2}></Table.Summary.Cell>
                                        //     </Table.Summary.Row>
                                        // )}
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

                    <TagHistoryAuditor open={isModalHistory} close={setIsModalHistory} history={HistoryData} />
                </Modal>
            )}
        </>

    )
}

export default DetailSumAuditor


