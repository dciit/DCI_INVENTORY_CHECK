import { base } from "@/constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {

    const [isInfoDropdownOpen, setIsInfoDropdownOpen] = useState(false);

    const navigate = useNavigate();

    const handleLogout = ()=>{
        navigate(`/login`);
    }

    return (
        <nav className="bg-[#3674B5] border-gray-200 dark:bg-gray-900 dark:border-gray-700">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-5">
                <a href={`/${base}/home`} className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">Inventory Check</span>
                </a>

                <div className="hidden w-full md:block md:w-auto" id="navbar-multi-level">
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
                        <li className="relative">
                            <button
                                onClick={() => setIsInfoDropdownOpen(!isInfoDropdownOpen)}
                                className="flex items-center justify-between w-full py-2 px-3 text-white bg-[#3674B5]"
                            >
                                Information
                                <svg className="w-2.5 h-2.5 ms-2.5 transition-transform duration-200"
                                    style={{ transform: isInfoDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                                    aria-hidden="true"
                                    fill="none"
                                    viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                </svg>
                            </button>
                            {isInfoDropdownOpen && (
                                <div className="absolute left-0 mt-2 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                        <li>
                                            <a href={`/${base}/gentag`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Tag</a>
                                        </li>
                                        <li>
                                            <a href={`/${base}/summerizegoods`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Summary Part</a>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>
                        <li>
                            <a className="flex items-center py-2 px-3 text-white hover:text-white font-semibold" onClick={()=>handleLogout} >Log out</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
