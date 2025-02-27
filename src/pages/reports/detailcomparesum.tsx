
import { CompareSum } from "@/interface/summarypart.interface";
import { Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


function DetailCompareSum(props: any) {

    const { open, close, sumData } = props;

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
    };

    if (!sumData) {
        return <p>No data available.</p>;
    }

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




    return (
        <>
            {console.log(sumData[0])}
            <Modal open={open} onCancel={() => close(false)} onClose={() => close(false)} footer={<></>} width='90%' height='80%' >
                <head className="flex flex-col px-8 py-8">
                    <div className="flex flex-row justify-center items-cente mt-3">
                        <p className="w-full mr-4 py-8 border border-gray-500 rounded-2xl bg-[#E1EACD] text-3xl text-black font-bold text-center">
                            รายการนับวัตถุดิบของแต่ละสายการผลิต โดย Auditee
                        </p>
                    </div>
                </head>
                <body className="flex flex-col w-full p-4 justify-center mt-2">
                    <div className="w-52">
                        <button
                            onClick={() => exportToExcel(sumData, "AmountCheck")}
                            className="text-green-700 border-2 border-green-700 bg-white hover:bg-green-600 hover:text-white focus:outline-none focus:ring-green-700 font-medium rounded-lg text-lg  px-3 py-3 ml-3  text-center "
                        >
                            Export to Excel
                        </button>
                    </div>

                    <div className="overflow-x-auto max-h-[600px]">
                        {/* <table className="border-separate border-spacing-0 border border-gray-400 w-full table-fixed">
                            <thead>
                                <tr className="bg-[#F9F5EB]">
                                    <th className="border border-gray-600 sticky top-0 z-10 bg-[#F9F5EB] px-4 py-2 w-16" >WC</th>
                                    <th className="border border-gray-600 sticky top-0 z-10 bg-[#F9F5EB] px-4 py-2 w-28" >TAG NO</th>
                                    <th className="border border-gray-600 sticky top-0 z-10 bg-[#F9F5EB] px-4 py-2" >Part No</th>
                                    <th className="border border-gray-600 sticky top-0 z-10 bg-[#F9F5EB] px-4 py-2 w-14" >CM</th>
                                    <th className="border border-gray-600 sticky top-0 z-10 bg-[#F9F5EB] px-4 py-2 w-72" >Part Name</th>
                                    <th className="border border-gray-600 sticky top-0 z-10 bg-[#F9F5EB] px-4 py-2 w-28 " >Book</th>
                                    <th className="border border-gray-600 sticky top-0 z-10 bg-[#F9F5EB] px-4 py-2 " >Amount</th>
                                    <th className="border border-gray-600 sticky top-0 z-10 bg-[#F9F5EB] px-4 py-2 " >Auditee Qty</th>
                                    <th className="border border-gray-600 sticky top-0 z-10 bg-[#F9F5EB] px-4 py-2 " >Aditee Amount</th>
                                    <th className="border border-gray-600 sticky top-0 z-10 bg-[#F9F5EB] px-4 py-2 " >Diff Qty</th>
                                    <th className="border border-gray-600 sticky top-0 z-10 bg-[#F9F5EB] px-4 py-2 " >Diff Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sumData.map((item: CompareSum, index: number) => (
                                    <tr
                                        key={index}
                                        className="dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                        <td className="border border-gray-600  px-4 py-2 text-center">{item.wcno}</td>
                                        <td className="border border-gray-600  px-4 py-2 text-center">{item.tagNo}</td>
                                        <td className="border border-gray-600  px-4 py-2 text-left">{item.partNo}</td>
                                        <td className="border border-gray-600  px-4 py-2 text-left">{item.cm}</td>
                                        <td className="border border-gray-600  px-4 py-2 text-left whitespace-nowrap">{item.partName}</td>

                                        <td className="border border-gray-600 px-4 py-2 text-right">
                                            {item?.bookQty != null ? item.bookQty.toLocaleString("en-US", { minimumFractionDigits: 0, maximumSignificantDigits: 2 }) : ""}
                                        </td>
                                        <td className="border border-gray-600 px-4 py-2 text-right">
                                            {item?.bookAmt != null ? item.bookAmt.toLocaleString("en-US", { minimumFractionDigits: 0, maximumSignificantDigits: 2 }) : ""}
                                        </td>
                                        <td className="border border-gray-600 px-4 py-2 text-right">
                                            {item?.auditeeQty != null ? item.auditeeQty.toLocaleString("en-US", { minimumFractionDigits: 0, maximumSignificantDigits: 2 }) : ""}
                                        </td>
                                        <td className="border border-gray-600 px-4 py-2 text-right">
                                            {item?.auditeeAmt != null ? item.auditeeAmt.toLocaleString("en-US", { minimumFractionDigits: 0, maximumSignificantDigits: 2 }) : ""}
                                        </td>
                                        <td className="border border-gray-600 px-4 py-2 text-right">
                                            {item?.auditeeDiffQty != null ? item.auditeeDiffQty.toLocaleString("en-US", { minimumFractionDigits: 0, maximumSignificantDigits: 2 }) : ""}
                                        </td>
                                        <td className="border border-gray-600 px-4 py-2 text-right">
                                            {item?.auditeeDiffAmt != null ? item.auditeeDiffAmt.toLocaleString("en-US", { minimumFractionDigits: 0, maximumSignificantDigits: 2 }) : ""}
                                        </td>
                                    </tr>

                                ))}
                            </tbody>
                        </table> */}
                        <Table<CompareSum>
                            columns={columns}
                            dataSource={sumData}
                            rowKey={(record: { wcno: any; }) => record.wcno} // Unique key for each row
                            pagination={false} // Disable pagination if you want
                            scroll={{ y: 500 }}
                            summary={() => (
                                <Table.Summary.Row className="font-bold">
                                    <Table.Summary.Cell colSpan={5} index={0}  >
                                        Total
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={0} >
                                        {sumBookQty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={0} >
                                        {sumBookAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={0} >
                                        {sumAuditeeQty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={0} >
                                        {sumAuditeeAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={0} >
                                        {sumAuditeeDiffQty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={0} >
                                        {sumAuditeeDiffAmt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            )}
                        />
                    </div>

                </body>
            </Modal>


        </>



    )
}

export default DetailCompareSum


