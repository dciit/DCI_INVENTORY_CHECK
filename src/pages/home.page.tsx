import Navbar from "@/components/main/navbar";
import { ReduxInterface } from "@/interface/main.interface";
import { CameraTwoTone, GoldTwoTone, PrinterTwoTone, ProfileTwoTone } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


function HomePage() {


    const navigate = useNavigate();

    const redux: ReduxInterface = useSelector((state: any) => state.reducer);
    

    const admin = [
        { route: '/auditeecheck', title: 'แตก Part', icon: <GoldTwoTone /> },
        { route: '/summerizegoods', title: 'สรุปรายการแตก Part', icon: <ProfileTwoTone /> },
        { route: '/scanqradtee', title: 'Scan QRCode (Auditee)', icon: <CameraTwoTone /> },
        { route: '/scanqradtor', title: 'Scan QRCode (Auditor)', icon: <CameraTwoTone /> },
        { route: '/adtesumfinal', title: 'สรุปการยิงนับ Auditee Summary', icon: <GoldTwoTone /> },
        { route: '/adtorsumfinal', title: 'สรุปการยิงนับ Auditor Summary', icon: <GoldTwoTone /> },
        { route: '/comparesum', title: 'Summary Amount', icon: <GoldTwoTone /> },
        { route: '/gentag', title: 'Print Tag', icon: <PrinterTwoTone /> }
    ];


    const auditee = [
        { route: '/auditeecheck', title: 'แตก Part', icon: <GoldTwoTone /> },
        { route: '/summerizegoods', title: 'สรุปรายการแตก Part', icon: <ProfileTwoTone /> },
        { route: '/scanqradtee', title: 'Scan QRCode (Auditee)', icon: <CameraTwoTone /> },
        { route: '/adtesumfinal', title: 'สรุปการยิงนับ Auditee Summary', icon: <GoldTwoTone /> },
    ];

    const auditor = [
        { route: '/scanqradtor', title: 'Scan QRCode (Auditor)', icon: <CameraTwoTone /> }
    ];

    let oMenu: any = [];

    if (redux.authen.role === "ADMIN") {
        oMenu = admin;
    } else if (redux.authen.role === "AUDITEE") {
        oMenu = auditee;
    } else if (redux.authen.role === "AUDITOR") {
        oMenu = auditor;
    } else {
        navigate(`/login`);
        return; // Make sure to stop the execution after navigation
    }


    return (
        <>
            <Navbar />
            <div className="h-full bg-[#3674B5]/75 flex justify-center p-4 sm:p-6 overflow-y-auto">
                <div className="container mx-auto px-4 rounded-lg">
                    <div className="h-full bg-[#3674B5]/75 p-3 rounded-lg mt-3">
                        <div className="grid grid-cols-2 xs:grid-col-2 xs:gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 xl:mt-10 gap-6 m-2">
                            {oMenu.map((oItem: any, index: number) => (
                                <div
                                    key={index}
                                    onClick={() => navigate(oItem.route)}
                                    className="flex flex-col items-center w-full min-w-[140px] max-w-[420px] px-6 py-8 bg-white rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer shadow-md transition-transform duration-200 hover:scale-105"
                                >
                                    <div className="text-4xl">{oItem.icon}</div>
                                    <h5 className="mt-4 text-md font-bold text-gray-900 dark:text-white text-center">
                                        {oItem.title}
                                    </h5>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomePage;
