
import { Modal } from "antd";
import dayjs from "dayjs";

function TagHistoryAuditor(props: any) {
    const { open, close, hisData } = props;


    // const location = useLocation();
    // const hisdata = location.state?.hisdata;

    if (!hisData) {
        return <p>No data available.</p>;
    }


    return (
        <>
            <Modal open={open} onCancel={() => close(false)} onClose={() => close(false)} footer={<></>} width='90%' height='80%' >
                <head className="flex flex-col px-8 py-8">
                    <div className="flex flex-row justify-center items-cente mt-3">
                        <p className="w-full mr-4 py-8 border border-gray-500 rounded-2xl bg-[#E1EACD] text-3xl text-black font-bold text-center">
                            ประวัติการบันทึกรายการนับวัตถุดิบของแต่ละสายการผลิต (Auditor)
                        </p>
                    </div>
                </head >
                <body className="flex w-full p-4 justify-center mt-5">
                    <div className="overflow-x-auto max-h-[700px]">

                        <table className="border-separate border-spacing-0 border border-gray-400 w-full table-fixed">
                            <thead>
                                <tr className="bg-[#F9F5EB]">
                                    <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2 shadow-md" >WC</th>
                                    <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2 shadow-sm" >TAG NO</th>
                                    <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2 shadow-sm" >Part</th>
                                    <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2 shadow-sm" >Auditor Qty</th>
                                    <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2 shadow-sm" >Auditor</th>
                                </tr>
                            </thead>

                            <tbody>
                                {hisData && hisData.map((item: any, index: number) => (
                                    // oLineTyps.map((ln) => ())
                                    <tr key={index} className="border-gray-200 hover:bg-gray-100">
                                        <td className="border border-gray-600 px-4 py-2 text-center">{item.wcno}</td>
                                        <td className="border border-gray-600 px-4 py-2 text-center">{item.tagNo}</td>
                                        <td className="border border-gray-600 px-4 py-2 text-left">{item.partNo} {item.cm}<br />{item.partName}</td>
                                        <td className="border border-gray-600 px-4 py-2 text-right">
                                            {item.auditorBy != '' && (<>{item.auditorQty.toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}</>)}</td>
                                        <td className="border border-gray-600 px-4 py-2 text-center">
                                            {item.auditorBy != '' && (<>{item.auditorBy}<br />{dayjs(item.auditorDate).format("DD/MMM/YYYY HH:mm")}</>)}
                                        </td>
                                    </tr>


                                ))}
                            </tbody>
                        </table>
                    </div>
                </body>
            </Modal>
        </>
    )
}

export default TagHistoryAuditor