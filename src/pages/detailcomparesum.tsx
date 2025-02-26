import Navbar from "@/components/main/navbar";
import { base } from "@/constants";
import { LeftOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";

function DetailCompareSum() {

    const location = useLocation();
    const tagData = location.state?.tagData;
    const sumData = location.state?.sumData;


    if (!tagData) {
        return <p>No data available.</p>;
    }

    console.log(tagData)



    return (
        <>
            <Navbar />
            <head className="flex flex-col px-8 py-8">
                <div className="flex flex-row justify-center items-cente mt-3">
                    <p className="w-full mr-4 py-8 border border-gray-500 rounded-2xl bg-[#E1EACD] text-3xl text-black font-bold text-center">
                        รายการนับวัตถุดิบของแต่ละสายการผลิต
                        <hr className="mx-28 mt-2  border-black" />
                        <p className=" mt-2 text-2xl font-light">(Auditee)</p>
                    </p>
                </div>
                <div className="flex flex-row gap-3 justify-start mr-5">
                    <div id="clear" className="mt-9 ml-5">
                        <a
                            href={`/${base}/comparesum`}
                            className="text-white bg-[#003092] hover:bg-[#003092]  focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-lg px-5 py-2.5 text-center  dark:bg-blue-900 dark:hover:bg-blue-900 dark:focus:ring-blue-900">
                            <LeftOutlined />
                            back
                        </a>
                    </div>
                </div>
                <body className="flex w-full p-4 justify-center mt-2">
                    <div className="overflow-x-auto max-h-[600px]">
                        <table className="border-separate border-spacing-0 border border-gray-400 w-full table-fixed">
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
                                    <th className="border border-gray-600 sticky top-0 z-10 bg-[#F9F5EB] px-4 py-2 " >Auditee Diff Qty</th>
                                    <th className="border border-gray-600 sticky top-0 z-10 bg-[#F9F5EB] px-4 py-2 " >Aditee Diff Amount</th>
                                    <th className="border border-gray-600 sticky top-0 z-10 bg-[#F9F5EB] px-4 py-2" >Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {tagData &&
                                    tagData.map((item: any, index: number) => {
                                        const sumItem = sumData?.find((s: any) => s.wcno === item.wcno);

                                        return (
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
                                                    {sumItem?.bookQty != null ? sumItem.bookQty.toFixed(2) : "-"}
                                                </td>
                                                <td className="border border-gray-600 px-4 py-2 text-right">
                                                    {sumItem?.bookAmt != null ? sumItem.bookAmt.toFixed(2) : "-"}
                                                </td>
                                                <td className="border border-gray-600 px-4 py-2 text-right">
                                                    {sumItem?.auditeeQty != null ? sumItem.auditeeQty.toFixed(2) : "-"}
                                                </td>
                                                <td className="border border-gray-600 px-4 py-2 text-right">
                                                    {sumItem?.auditeeAmt != null ? sumItem.auditeeAmt.toFixed(2) : "-"}
                                                </td>
                                                <td className="border border-gray-600 px-4 py-2 text-right">
                                                    {sumItem?.auditeeDiffQty != null ? sumItem.auditeeDiffQty.toFixed(2) : "-"}
                                                </td>
                                                <td className="border border-gray-600 px-4 py-2 text-right">
                                                    {sumItem?.auditeeDiffAmt != null ? sumItem.auditeeDiffAmt.toFixed(2) : "-"}
                                                </td>


                                                <td className={`border px-4 py-2 text-right ${item.auditeeStatus === "FALSE" ? "bg-red-600 text-white" : ""}`}>
                                                    {item.auditeeStatus === "FALSE" ? (
                                                        ""
                                                    ) : (
                                                        "เช็คแล้ว"
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={5} className="border border-gray-600 text-right px-4 py-2 font-bold">Total:</td>
                                    <td className="border border-gray-600 px-4 py-2 text-right font-semibold bg-[#C0EBA6]">
                                        {new Intl.NumberFormat().format(
                                            tagData.reduce((total: any, item: { wcno: any; }) => {
                                                const sumItem = sumData?.find((s: any) => s.wcno === item.wcno);
                                                return total + (sumItem?.bookQty || 0);
                                            }, 0)
                                        )}
                                    </td>

                                    <td className="border border-gray-600 px-4 py-2 text-right font-semibold bg-[#C0EBA6]">
                                        {new Intl.NumberFormat().format(
                                            tagData.reduce((total: any, item: { wcno: any; }) => {
                                                const sumItem = sumData?.find((s: any) => s.wcno === item.wcno);
                                                return total + (sumItem?.bookAmt || 0);
                                            }, 0).toFixed(2)
                                        )}
                                    </td>

                                    <td className="border border-gray-600 px-4 py-2 text-right font-semibold bg-[#C0EBA6]">
                                        {new Intl.NumberFormat().format(
                                            tagData.reduce((total: any, item: { wcno: any; }) => {
                                                const sumItem = sumData?.find((s: any) => s.wcno === item.wcno);
                                                return total + (sumItem?.auditeeQty || 0);
                                            }, 0).toFixed(2)
                                        )}
                                    </td>

                                    <td className="border border-gray-600 px-4 py-2 text-right font-semibold bg-[#C0EBA6]">
                                        {new Intl.NumberFormat().format(
                                            tagData.reduce((total: any, item: { wcno: any; }) => {
                                                const sumItem = sumData?.find((s: any) => s.wcno === item.wcno);
                                                return total + (sumItem?.auditeeAmt || 0);
                                            }, 0).toFixed(2)
                                        )}
                                    </td>

                                    <td className="border border-gray-600 px-4 py-2 text-right font-semibold bg-[#C0EBA6]">
                                        {new Intl.NumberFormat().format(
                                            tagData.reduce((total: any, item: { wcno: any; }) => {
                                                const sumItem = sumData?.find((s: any) => s.wcno === item.wcno);
                                                return total + (sumItem?.auditeeDiffQty || 0);
                                            }, 0).toFixed(2)
                                        )}
                                    </td>

                                    <td className="border border-gray-600 px-4 py-2 text-right font-semibold bg-[#C0EBA6]">
                                        {new Intl.NumberFormat().format(
                                            tagData.reduce((total: any, item: { wcno: any; }) => {
                                                const sumItem = sumData?.find((s: any) => s.wcno === item.wcno);
                                                return total + (sumItem?.auditeeDiffAmt || 0);
                                            }, 0).toFixed(2)
                                        )}
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                </body>
            </head>
        </>



    )
}

export default DetailCompareSum


