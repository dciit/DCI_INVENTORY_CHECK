import { ArrowLeftOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";

function DetailSumAuditee() {

    const location = useLocation();
    const tagData = location.state?.tagData;


    if (!tagData) {
        return <p>No data available.</p>;
    }

    console.log(tagData)



    return (
        <head className="flex flex-col px-8 py-8">
            <a href="/template/adtesumfinal">
                <ArrowLeftOutlined style={{ fontSize: '24px' }} />
            </a>
            
            <div className="flex flex-row justify-center items-cente mt-3">
                <p className="w-full mr-4 py-8 border border-gray-500 rounded-2xl bg-[#A6F1E0] text-3xl text-black font-bold text-center">
                    รายการนับวัตถุดิบของแต่ละสายการผลิต
                    <hr className="mx-28 mt-2  border-black" />
                    <p className=" mt-2 text-2xl font-light">(Auditee)</p>
                </p>
            </div>
            <body className="flex w-full p-4 justify-center mt-5">
                <table>
                    <thead>
                        <tr className="bg-[#F9F5EB]">
                            <th className="border border-gray-600 px-4 py-2" >WC</th>
                            <th className="border border-gray-600 px-4 py-2" >TAG NO</th>
                            <th className="border border-gray-600 px-4 py-2" >Part No</th>
                            <th className="border border-gray-600 px-4 py-2" >CM</th>
                            <th className="border border-gray-600 px-4 py-2" >Part Name</th>
                            <th className="border border-gray-600 px-4 py-2" >Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tagData && tagData.map((item: any, index: number) => (
                            <tr key={index} className="dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                                <td className="border border-gray-600 px-4 py-2 text-center">{item.wcno}</td>
                                <td className="border border-gray-600 px-4 py-2 text-center">{item.tagNo}</td>
                                <td className="border border-gray-600 px-4 py-2 text-center">{item.partNo}</td>
                                <td className="border border-gray-600 px-4 py-2 text-left">{item.cm}</td>
                                <td className="border border-gray-600 px-4 py-2 text-left">{item.partName}</td>
                                <td className={`border px-4 py-2 text-right ${item.auditeeStatus === "FALSE" ? "bg-red-600 text-white" : ""}`}>
                                    {item.auditeeStatus === "FALSE" ? (
                                        ""
                                    ) : (
                                        "เช็คแล้ว"
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </body>
        </head>


    )
}

export default DetailSumAuditee


