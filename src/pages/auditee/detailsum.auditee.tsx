import dayjs from "dayjs";
import { API_TAG_HISTORY_AUDITEE } from "@/service/tag.service";
import { ReduxInterface } from "@/interface/main.interface";
import { useSelector } from "react-redux";
import { Button, Modal } from "antd";
import { useState } from "react";
import { RiFileHistoryLine } from "react-icons/ri";
import TagHistoryAuditee from "./tagauditee.history";


function DetailSumAuditee(props: any) {

    const { open, close, tagData } = props;
    const oAccount: ReduxInterface = useSelector((state: any) => state.reducer);


    const [isModalHistory, setIsModalHistory] = useState<boolean>(false);
    const [HistoryData, setHistoryData] = useState<any[]>([]);

    const handleModalHistory = async (data: any) => {
        setHistoryData([]);

        const resHistoryData = await API_TAG_HISTORY_AUDITEE(
            oAccount.authen.mSetInfo?.setCode!,
            oAccount.authen.mSetInfo?.ym!,
            data.wcno,
            data.partNo,
            data.cm
        );
        setHistoryData(resHistoryData);
        setIsModalHistory(true);
    }

    if (!tagData) {
        return <p>No data available.</p>;
    }


    return (
        <Modal open={open} onCancel={() => close(false)} onClose={() => close(false)} footer={<></>} width='90%' height='80%' >
            <head className="flex flex-col px-8 py-8">
                <div className="flex flex-row justify-center items-cente mt-3">
                    <p className="w-full mr-4 py-8 border border-gray-500 rounded-2xl bg-[#E1EACD] text-3xl text-black font-bold text-center">
                        รายการนับวัตถุดิบของแต่ละสายการผลิต (Auditee)
                    </p>
                </div>
            </head >
            <body className="flex w-full p-4 justify-center mt-2">
                <div className="overflow-x-auto max-h-[700px]">
                    <table className="border-separate border-spacing-0 border border-gray-400 w-full table-fixed">
                        <thead>
                            <tr className="bg-[#F9F5EB]">
                                <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2 shadow-md w-32" >WC</th>
                                <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2 shadow-sm w-32" >TAG NO</th>
                                <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2 shadow-sm " >Part </th>
                                <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2 shadow-sm" >Auditee นับได้</th>
                                <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2 shadow-sm" >Auditee</th>
                                <th className="border border-gray-600 sticky top-0 bg-[#F9F5EB] z-[10] px-4 py-2 shadow-sm " ></th>
                            </tr>
                        </thead>

                        <tbody>
                            {tagData && tagData.map((item: any, index: number) => (                                
                                <tr key={index} style={{ cursor: 'pointer' }}
                                    className=" border-gray-200 hover:bg-gray-100 ">
                                    <td className="border border-gray-600 px-4 py-2 text-center">{item.wcno}</td>
                                    <td className="border border-gray-600 px-4 py-2 text-center">{item.tagNo}</td>
                                    <td className="border border-gray-600 px-4 py-2 text-left">{item.partNo} {item.cm}<br/>{item.partName}</td>
                                    <td className="border border-gray-600 px-4 py-2 text-right">
                                            {(item.auditeeBy != '' && typeof item.auditeeQty != undefined) && (<>{item.auditeeQty.toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}</>)}</td>
                                        <td className="border border-gray-600 px-4 py-2 text-center">
                                            {item.auditeeBy != '' && (<>{item.auditeeBy}<br />{dayjs(item.auditeeDate).format("DD/MMM/YYYY HH:mm")}</>)}
                                        </td>
                                        <td className={`border border-gray-600 px-4 py-2 text-center `}>
                                            {item.auditeeBy != '' && (<><Button type="primary" className="mr-5" size="small" icon={<RiFileHistoryLine />} onClick={() => handleModalHistory(item)} >
                                                ประวัติการบันทึก</Button></>)}

                                        </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </body>

            <TagHistoryAuditee open={isModalHistory} close={setIsModalHistory} hisData={HistoryData} />
        </Modal>



    )
}

export default DetailSumAuditee


