function CardSelectInfo() {
    return (
        <>
            <div className="flex gap-10 items-stretch">
                {['Scan QRCode Auditee', 'Scan QRCode Auditor', 'Print Tag'].map((title, index) => (
                    <div key={index} className="flex-1 w-[300px]">
                        <a href="#" className="flex h-full min-h-[150px] p-10 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex-col justify-center">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
                                {title}
                            </h5>
                        </a>
                    </div>
                ))}
            </div>

            {/* Second Row */}
            <div className="flex gap-10 items-stretch mt-6">
                {['แตก part auditee', 'แตก part auditor', 'สรุปรายการ Part ของ Finished Goods'].map((title, index) => (
                    <div key={index} className="flex-1 w-[300px]">
                        <a href="#" className="flex h-full min-h-[150px] p-10 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex-col justify-center">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
                                {title}
                            </h5>
                        </a>
                    </div>
                ))}
            </div>

            {/* Third Row */}
            <div className="flex gap-10 items-stretch mt-6">
                {['รายการนับวัตถุดิบของแต่ละสายการผลิต Auditee', 'รายการนับวัตถุดิบของแต่ละสายการผลิต Auditor', 'สรุปรายการ Part ของ Finished Goods'].map((title, index) => (
                    <div key={index} className="flex-1 w-[300px]">
                        <a href="#" className="flex h-full min-h-[150px] p-10 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex-col justify-center">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
                                {title}
                            </h5>
                        </a>
                    </div>
                ))}
            </div>

        </>
    )
}

export default CardSelectInfo