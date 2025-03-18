import { CompareSum } from "@/interface/summarypart.interface";
import { Modal, Spin, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";


function DetailCompareSum(props: any) {

    const { open, close, sumData } = props;

    const [loading, setLoading] = useState<boolean>(true);


    const exportToExcel = (CompareData: CompareSum[], fileName: string) => {

        const wb = XLSX.utils.book_new();

        let newobj: any = [];
        CompareData.map((item: CompareSum) => {

            newobj = [...newobj, ...[{
                wcno: item.wcno,
                tagNo: item.tagNo,
                partNo: item.partNo,
                cm: item.cm,
                partName: item.partName,
                bookQty: item.bookQty,
                bookAmt: item.bookAmt,
                auditeeQty: item.auditeeQty,
                auditeeAmt: item.auditeeAmt,
                auditeeDiffQty: item.auditeeDiffQty,
                auditeeDiffAmt: item.auditeeDiffAmt
            }]]
        });

        const ws1 = XLSX.utils.json_to_sheet(newobj);
        XLSX.utils.book_append_sheet(wb, ws1, "Part List");

        // const ws2 = XLSX.utils.json_to_sheet(newsumdata);
        // XLSX.utils.book_append_sheet(wb, ws2, "Summary Data");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(dataBlob, `${fileName}.xlsx`);
    }

    useEffect(() => {
        if (!sumData) {
            setLoading(false);
        }
    }, [sumData]);

    const columns: ColumnsType<CompareSum> = [

        {
            title: 'WC',
            dataIndex: 'wcno',
            key: 'wcno',
            sorter: (a: { wcno: number; }, b: { wcno: number; }) => a.wcno - b.wcno,
        },
        {
            title: 'TAG NO',
            dataIndex: 'tagNo',
            key: 'tagNo',
            sorter: (a, b) => a.tagNo.localeCompare(b.tagNo),
        },

        {
            title: 'PART No',
            dataIndex: 'partNo',
            key: 'partNo',
            sorter: (a, b) => a.partNo.localeCompare(b.partNo)
        },
        {
            title: 'CM',
            dataIndex: 'cm',
            key: 'cm',
            width: 80,
            sorter: (a, b) => a.cm.localeCompare(b.cm)
        },
        {
            title: 'PART Name',
            dataIndex: 'partName',
            key: 'partName',
            sorter: (a, b) => a.partName.localeCompare(b.partName)
        },
        {
            title: 'BOOK',
            children: [
                {
                    title: "QTY",
                    dataIndex: 'bookQty',
                    key: "bookQty",
                    render: (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                    sorter: (a, b) => a.bookQty - b.bookQty,

                },
                {
                    title: "AMOUNT",
                    dataIndex: 'bookAmt',
                    key: "bookAmt",
                    render: (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                    sorter: (a, b) => a.bookAmt - b.bookAmt
                },

            ]
        },
        {
            title: 'Auditee Check',
            children: [
                {
                    title: 'AUDITEE QTY',
                    dataIndex: 'auditeeQty',
                    key: 'auditeeQty',
                    render: (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                    sorter: (a, b) => a.auditeeQty - b.auditeeQty
                },
                {
                    title: 'AUDITEE AMT',
                    dataIndex: 'auditeeAmt',
                    key: 'auditeeamt',
                    render: (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                    sorter: (a, b) => a.auditeeAmt - b.auditeeAmt
                },
            ]
        },
        {
            title: 'DIFF',
            children: [
                {
                    title: 'DIFF QTY',
                    dataIndex: 'auditeeDiffQty',
                    key: 'auditeeDiffQty',
                    render: (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                    sorter: (a, b) => a.auditeeDiffQty - b.auditeeDiffQty
                },
                {
                    title: 'DIFF AMT',
                    dataIndex: 'auditeeDiffAmt',
                    key: 'auditeeDiffAmt',
                    render: (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                    sorter: (a, b) => a.auditeeDiffAmt - b.auditeeDiffAmt
                },
            ]
        }
    ]

    const sumBookQty = sumData.reduce((sum: any, item: any) => sum + (item.bookQty || 0), 0);
    const sumBookAmt = sumData.reduce((sum: any, item: any) => sum + (item.bookAmt || 0), 0);
    const sumAuditeeQty = sumData.reduce((sum: any, item: any) => sum + (item.auditeeQty || 0), 0);
    const sumAuditeeAmt = sumData.reduce((sum: any, item: any) => sum + (item.auditeeAmt || 0), 0);
    const sumAuditeeDiffQty = sumData.reduce((sum: any, item: any) => sum + (item.auditeeDiffQty || 0), 0);
    const sumAuditeeDiffAmt = sumData.reduce((sum: any, item: any) => sum + (item.auditeeDiffAmt || 0), 0);


    const handlePrint = () => {
        if (!sumData || sumData.length === 0) {
            alert('ไม่มีข้อมูลสำหรับการพิมพ์');
            return;
        }
    
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <!DOCTYPE html>
                <html lang="th">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>ประวัติการ Auditee</title>
                        <style>
                            @page { 
                                size: A3 landscape; 
                                margin: 10mm; 
                            }
                            body {
                                font-family: Arial, sans-serif;
                            }
                            table { 
                                width: 100%; 
                                border-collapse: collapse; 
                            }
                            th, td { 
                                border: 1px solid black; 
                                padding: 8px; 
                                text-align: center; 
                                font-size: 12px;
                            }
                            th { 
                                background-color: #f2f2f2; 
                            }
                            .table-container {
                                width: 100%;
                                overflow-x: auto;
                            }
                        </style>
                    </head>
                    <body>
                        <h2 style="text-align: center;">ประวัติการ Auditee</h2>
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th rowspan="2">WC</th>
                                        <th rowspan="2">Tag No</th>
                                        <th rowspan="2">Part No</th>
                                        <th rowspan="2">CM</th>
                                        <th rowspan="2">PART NAME</th>
                                        <th colspan="2">BOOK</th> 
                                        <th colspan="2">Auditee Check</th>
                                        <th colspan="2">Diff</th>
                                    </tr>
                                    <tr>
                                        <th>QTY</th>
                                        <th>AMOUNT</th>
                                        <th>AUDITEE QTY</th>
                                        <th>AUDITEE AMT</th>
                                        <th>DIFF QTY</th>
                                        <th>DIFF AMT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${sumData.length > 0 ? sumData.map((row: any) => `
                                        <tr>
                                            <td>${row.wcno}</td>
                                            <td>${row.tagNo}</td>
                                            <td>${row.partNo}</td>
                                            <td>${row.cm}</td>
                                            <td>${row.partName}</td>
                                            <td>${row.bookQty.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
                                            <td>${row.bookAmt.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
                                            <td>${row.auditeeQty.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
                                            <td>${row.auditeeAmt.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
                                            <td>${row.auditeeDiffQty.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
                                            <td>${row.auditeeDiffAmt.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
                                        </tr>
                                    `).join('') : `
                                        <tr>
                                            <td colspan="11" class="text-center text-red-600">ไม่พบข้อมูล</td>
                                        </tr>
                                    `}
                                </tbody>
                            </table>
                        </div>
                    </body>
                </html>
            `);
    
            printWindow.document.close();
            printWindow.print();
        }
    };
    


    return (
        <>
            {loading && open && (
                <Modal open={open} onCancel={() => close(false)} onClose={() => close(false)} footer={<></>} width='90%' height='80%' >
                    <div className="flex flex-col px-8 py-4">
                        <div className="flex flex-row justify-center items-center mt-3">
                            <p className="w-full mr-4 py-8 border border-gray-500 rounded-2xl bg-[#D4EBF8] text-3xl text-black font-bold text-center">
                                รายการนับวัตถุดิบของแต่ละสายการผลิต โดย Auditee
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col w-full justify-center px-8">
                        <div className=" flex flex-row w-64">
                            <button
                                onClick={() => exportToExcel(sumData, "AmountCheck")}
                                className="text-green-700 border-2 border-green-700 bg-white hover:bg-green-600 hover:text-white focus:outline-none focus:ring-green-700 font-medium rounded-lg text-lg px-3 py-2 ml-5text-center"
                            >
                                Export to Excel
                            </button>
                            <button
                                onClick={handlePrint}
                                className="text-green-700 border-2 border-green-700 bg-white hover:bg-green-600 hover:text-white focus:outline-none focus:ring-green-700 font-medium rounded-lg text-lg  px-3 py-2 ml-5  text-center "
                            >
                                Print
                            </button>
                        </div>
                        <div className="overflow-x-auto max-h-[500px] mt-2">
                            {
                                sumData && sumData.length > 0 ? (
                                    <Table<CompareSum>
                                        columns={columns}
                                        dataSource={sumData}
                                        rowKey={(record) => record.wcno} // Unique key for each row
                                        scroll={{ y: 600 }}
                                        summary={() => (
                                            <Table.Summary.Row className="font-bold bg-yellow-50">
                                                <Table.Summary.Cell colSpan={5} index={0} className="text-right">
                                                    Total
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={0}>
                                                    {sumBookQty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={0}>
                                                    {sumBookAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={0}>
                                                    {sumAuditeeQty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={0}>
                                                    {sumAuditeeAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={0}>
                                                    {sumAuditeeDiffQty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </Table.Summary.Cell>
                                                <Table.Summary.Cell index={0}>
                                                    {sumAuditeeDiffAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </Table.Summary.Cell>
                                            </Table.Summary.Row>
                                        )}
                                    />
                                ) : (
                                    <div className='flex flex-col justify-center items-center  h-full w-full'>
                                        <Spin indicator={<LoadingOutlined spin />} size="large" />
                                        <span>กำลังโหลดข้อมูล</span>
                                    </div>
                                )
                            }

                        </div>
                    </div>
                </Modal>
            )}

        </>
    )
}

export default DetailCompareSum


