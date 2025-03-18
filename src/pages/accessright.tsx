import Navbar from "@/components/main/navbar";
import { Select } from "antd";
import { useState } from "react";

interface Employee {
    employcode: string;
    firstname: string;
    lastname: string;
}

function AcceessRights() {

    const [searchTerm, setSearchTerm] = useState("");
    const [result, setResult] = useState<Employee | null>(null);
    const [employees, setEmployees] = useState([
        { employcode: "41401", firstname: "Anuthida", lastname: "Wuthiphitaksak" },
        { employcode: "23210", firstname: "A", lastname: "A" },
        { employcode: "25467", firstname: "B", lastname: "B" },
        { employcode: "23442", firstname: "C", lastname: "C" },
        { employcode: "34566", firstname: "D", lastname: "D" },
    ]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const found = employees.find(emp => emp.employcode === searchTerm);
        setResult(found || null);
    };

    const handleDelete = (employcode: string) => {
        const updatedEmployees = employees.filter(emp => emp.employcode !== employcode);
        setEmployees(updatedEmployees);
        setResult(null);
    };


    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center mt-12">
                <div className="container rounded-lg border shadow-sm justify-center mx-2">
                    <p className="w-full mr-4 py-8 text-3xl text-black font-bold text-center">
                        Access Rights Auditee
                    </p>
                    <form action="" className="m-3">
                        <div className="grid gap-6 mb-6 md:grid-cols-2">
                            <div>
                                <label htmlFor="codeemploy" className="block mb-2 text-lg font-medium ">Emplayee Code</label>
                                <input
                                    type="text"
                                    id="_codeemploy"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-3"
                                    placeholder="Enter Your Emplayee Code"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="codeemploy" className="block mb-2 text-lg font-medium ">Status</label>
                                <Select
                                    showSearch
                                    placeholder="Select a person"
                                    className="w-full h-11"
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={[
                                        { value: '1', label: 'Auditee' },
                                        { value: '2', label: 'Auditor' },
                                    ]}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">SAVE</button>
                        </div>

                    </form>
                </div>
            </div>

            <form className="w-full md:w-[30%] md:ml-[295px] mt-5 px-2 md:px-0" onSubmit={handleSearch}>
                <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input
                        type="search"
                        id="search"
                        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search by employcode"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        required
                    />
                    <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                </div>
            </form>

            {result && (
                <div className="mx-[14%] mt-4 p-4 bg-gray-100 rounded-lg">
                    <p><strong>รหัสพนักงาน:</strong> {result.employcode}</p>
                    <p><strong>ชื่อ:</strong> {result.firstname} {result.lastname}</p>
                    <button
                        onClick={() => handleDelete(result.employcode)}
                        className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                        ลบข้อมูล
                    </button>
                </div>
            )}

        </>
    )
}

export default AcceessRights;