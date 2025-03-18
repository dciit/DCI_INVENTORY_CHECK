import { base } from "@/constants";
import { ReduxInterface } from "@/interface/main.interface";
import { HomeOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const dispatch = useDispatch();
  const redux: ReduxInterface = useSelector((state: any) => state.reducer)

  const [isOpen, setIsOpen] = useState(false);
  // const [isInfoDropdownOpen, setIsInfoDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT', payload: {} })
    navigate(`/login`);
  }

  return (
    <nav className="bg-[#1E2A5E] border-gray-200 dark:bg-gray-900 dark:border-gray-700 print:hidden">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-5">
        {/* Logo */}
        <a href={`/${base}/home`} className="flex items-center space-x-3">
          <Button icon={<HomeOutlined />} onClick={() => navigate(`../home`)}></Button>
          <span className="text-2xl font-semibold text-white">DCI - นับสต๊อคประจำปี</span>
        </a>

        {/* Hamburger Menu Button for Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center p-2 text-white md:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className={`w-full md:flex md:w-auto ${isOpen ? "block" : "hidden"}`} id="navbar-menu">
          <ul className="flex flex-col md:flex-row md:space-x-8 font-medium p-4 md:p-0 mt-4 md:mt-0 md:border-0">
            {/* Dropdown Menu */}
            {/* <li className="relative">
                  <button
                    onClick={() => setIsInfoDropdownOpen(!isInfoDropdownOpen)}
                    className="flex items-center justify-between w-full py-2 px-3 text-white bg-[#3674B5] md:bg-transparent"
                  >
                    Information
                    <svg
                      className="w-2.5 h-2.5 ms-2.5 transition-transform duration-200"
                      style={{ transform: isInfoDropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                  </button>
                  {isInfoDropdownOpen && (
                    <div className="absolute left-0 mt-2 z-50 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-md dark:bg-gray-700 dark:divide-gray-600">
                      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                        <li>
                          <a href={`/${base}/gentag`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                            Tag
                          </a>
                        </li>
                        <li>
                          <a href={`/${base}/summerizegoods`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                            Summary Part
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </li> */}

            {/* Logout */}
            <li className="py-2 px-3 text-white hover:text-gray-200 font-semibold">{redux.authen.sName}</li>
            <li>
              <button
                className="py-2 px-3 text-white hover:text-gray-200 font-semibold"
                onClick={() => handleLogout()}
              >
                Log out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;