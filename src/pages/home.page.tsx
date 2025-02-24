import Navbar from "@/components/main/navbar";
import { ReduxInterface } from "@/interface/main.interface";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function HomePage() {


    const navigate = useNavigate();

    const redux: ReduxInterface = useSelector((state: any) => state.reducer);

    const admin = [
        { route: '/auditeecheck', title: 'แตก Part' },
        { route: '/scanqradtee', title: 'Scan QRCode (Auditee)' },
        { route: '/scanqradtor', title: 'Scan QRCode (Auditor)' },
        { route: '/adtesumfinal', title: 'Summary Auditee' },
        { route: '/adtorsumfinal', title: 'Summary Auditor' },
        { route: '/comparesum', title: 'Summary Amount' },
        { route: '/gentag', title: 'Print Tag' }
    ];


    const auditee = [
        { route: '/auditeecheck', title: 'แตก Part' },
        { route: '/adtesumfinal', title: 'สรุปรายการแตก Part' },
        { route: '/scanqradtee', title: 'Scan QRCode (Auditee)' },
        { route: '/gentag', title: 'Print Tag' }
    ];

    const auditor = [
        { route: '/scanqradtor', title: 'Scan QRCode (Auditor)' }
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
            <div className="h-full bg-[#3674B5]/75 flex justify-center items-center p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8">
                    {oMenu.map((oItem: any, index: number) => (
                        <div
                            key={index}
                            onClick={() => navigate(oItem.route)}
                            className="flex w-full max-w-[300px] px-6 py-11 bg-white rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex-col justify-center items-center cursor-pointer shadow-md transition-transform duration-200 hover:scale-105"
                        >
                            <h5 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                                {oItem.title}
                            </h5>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default HomePage;
