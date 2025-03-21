import Navbar from "@/components/main/navbar";
import { ReduxInterface } from "@/interface/main.interface";
import { CameraTwoTone, GoldTwoTone, PlusCircleTwoTone, PrinterTwoTone, ProfileTwoTone } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Imgbg from "../assets/daikin.webp";


function HomePage() {


    const navigate = useNavigate();

    const redux: ReduxInterface = useSelector((state: any) => state.reducer);
    let special: boolean = (typeof redux.authen.special != 'undefined') ? (redux.authen.special != '' ? true : false) : false;

    const admin = [
        { route: '/auditeecheck', title: 'แตก Part', icon: <GoldTwoTone />, show: true },
        { route: '/summerizegoods', title: 'สรุปรายการแตก Part', icon: <ProfileTwoTone />, show: true },
        { route: '/scanqradtee', title: 'Scan QRCode (Auditee)', icon: <CameraTwoTone />, show: true },
        { route: '/scanqradtor', title: 'Scan QRCode (Auditor)', icon: <CameraTwoTone />, show: true },
        { route: '/adtesumfinal', title: 'สรุปการยิงนับ Auditee Summary', icon: <GoldTwoTone />, show: true },
        { route: '/adtorsumfinal', title: 'สรุปการยิงนับ Auditor Summary', icon: <GoldTwoTone />, show: true },
        { route: '/comparesum', title: 'Summary Amount', icon: <GoldTwoTone />, show: special },
        { route: '/gentag', title: 'Print Tag', icon: <PrinterTwoTone />, show: true },
        { route: '/regentag', title: 'Print Tag (Repetitive)', icon: <PrinterTwoTone />, show: special},
        { route: '/commit', title: 'หน้าสรุป (ALPHA)', icon: <ProfileTwoTone />, show: true },
        { route: '/commitreview', title: 'หน้าสรุป', icon: <ProfileTwoTone />, show: true },
        { route: '/accessright', title: 'AeccessRight', icon: <PlusCircleTwoTone />,  show: true}
    ];

    const mnt = [
        { route: '/auditeecheck', title: 'แตก Part', icon: <GoldTwoTone />, show: true },
        { route: '/summerizegoods', title: 'สรุปรายการแตก Part', icon: <ProfileTwoTone />, show: true },
        { route: '/scanqradtee', title: 'Scan QRCode (Auditee)', icon: <CameraTwoTone />, show: true },
        { route: '/scanqradtor', title: 'Scan QRCode (Auditor)', icon: <CameraTwoTone />, show: true },
        { route: '/adtesumfinal', title: 'สรุปการยิงนับ Auditee Summary', icon: <GoldTwoTone />, show: true },
        { route: '/adtorsumfinal', title: 'สรุปการยิงนับ Auditor Summary', icon: <GoldTwoTone />, show: true },
        { route: '/comparesum', title: 'Summary Amount', icon: <GoldTwoTone />, show: special },
        { route: '/gentag', title: 'Print Tag', icon: <PrinterTwoTone />, show: true },
        { route: '/commitreview', title: 'หน้าสรุป', icon: <ProfileTwoTone />, show: true }
        
    ];


    const auditee = [
        { route: '/auditeecheck', title: 'แตก Part', icon: <GoldTwoTone />, show: true },
        { route: '/summerizegoods', title: 'สรุปรายการแตก Part', icon: <ProfileTwoTone />, show: true },
        { route: '/scanqradtee', title: 'Scan QRCode (Auditee)', icon: <CameraTwoTone />, show: true },
        { route: '/adtesumfinal', title: 'สรุปการยิงนับ Auditee Summary', icon: <GoldTwoTone />, show: true },
    ];

    const auditor = [
        { route: '/scanqradtor', title: 'Scan QRCode (Auditor)', icon: <CameraTwoTone />, show: true }
    ];

    let oMenu: any = [];

    if (redux.authen.role == "ADMIN") {
        oMenu = admin;
    } else if (redux.authen.role == "MANAGEMENT") {
        oMenu = mnt;
    } else if (redux.authen.role == "AUDITEE") {
        oMenu = auditee;
    } else if (redux.authen.role == "AUDITOR") {
        oMenu = auditor;
    } else {
        alert('123')
        navigate(`/login`);
        return; // Make sure to stop the execution after navigation
    }
    console.log(redux.authen.role)


    return (
        <>
            <Navbar />
            <div
                className="hero bg-slate-200 min-h-[200px] sm:min-h-[300px] md:min-h-[500px]"
                style={{ backgroundImage: `url(${Imgbg})`, opacity: 0.5,  backgroundSize: "cover", backgroundPosition: "center" }}
            >
                <div className="hero-content text-center">
                    <div className="max-w-full">
                        <h1 className="text-4xl font-bold text-center pt-4"></h1>
                    </div>
                </div>
            </div>
            <div className="h-full bg-sky-50 flex flex-col p-4 sm:p-6 overflow-y-auto">
                <p className="text-lg sm:text-lg md:text-xl lg:text-xl font-bold ml-16">รายการ</p>
                <hr className="border border-black mx-16" />
                <div className="container max-w-full px-6 sm:px-6 md:px-8 lg:px-10 rounded-lg">
                    {/* <div className="h-full bg-[#3674B5]/75 p-3 sm:p-2 rounded-lg mt-3 mx-6"> */}
                        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 m-7">
                            {oMenu.map((oItem: any, index: number) => (
                                <div
                                    key={index}
                                    onClick={() => navigate(oItem.route)}
                                    className="flex flex-col items-center sm:w-auto min-w-full max-w-full px-2 py-10 bg-[#D4EBF8] border border-gray-400 rounded-xl hover:bg-[#e8f7fe] cursor-pointer shadow-md transition-transform duration-200 hover:scale-105"
                                >
                                    <div className="text-3xl sm:text-4xl">{oItem.icon}</div>
                                    <h5 className="mt-3 text-sm sm:text-sm md:text-2xl font-bold text-gray-900 text-center">
                                        {oItem.title}
                                    </h5>
                                </div>
                            ))}
                        </div>
                    {/* </div> */}
                </div>

            </div>
        </>
    );
}

export default HomePage;
