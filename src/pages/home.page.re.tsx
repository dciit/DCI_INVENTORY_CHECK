import Navbar from "@/components/main/navbar";
import { ReduxInterface } from "@/interface/main.interface";
import { CameraTwoTone, GoldTwoTone, PlusCircleTwoTone, PrinterTwoTone, ProfileTwoTone } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Imgbg from "../assets/daikin.webp";
import { Collapse, CollapseProps } from "antd";


function HomePageRe() {


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
        { route: '/regentag', title: 'Print Tag (Repetitive)', icon: <PrinterTwoTone />, show: special },
        { route: '/commit', title: 'หน้าสรุป (ALPHA)', icon: <ProfileTwoTone />, show: true },
        { route: '/commitreview', title: 'หน้าสรุป', icon: <ProfileTwoTone />, show: true },
        { route: '/accessright', title: 'AeccessRight', icon: <PlusCircleTwoTone />, show: true }
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
    // console.log(redux.authen.role)


    // const filteredAdminMenu = admin.filter((item) => item.show);


    const items: CollapseProps["items"] = oMenu.map((oItem: any, index: number) => ({
        key: index,
        label: (
            <div
                className="flex items-center gap-2 cursor-pointer p-2 rounded-lg transition"
                onClick={() => navigate(oItem.route)}
            >
                <div className="text-xl">{oItem.icon}</div>
                <span className="text-lg font-semibold">{oItem.title}</span>
            </div>
        ),
    }));


    return (
        <>
            <Navbar />
            <div
                className="hero bg-slate-200 min-h-[100px] sm:min-h-[300px] md:min-h-[500px]"
                style={{ backgroundImage: `url(${Imgbg})`, opacity: 0.5, backgroundSize: "cover", backgroundPosition: "center" }}
            >
                <div className="hero-content text-center">
                    <div className="max-w-full">
                        <h1 className="text-4xl font-bold text-center pt-4"></h1>
                    </div>
                </div>
            </div>
            <div className="h-full bg-white flex flex-col p-4 sm:p-6 overflow-y-auto">
                <p className="text-lg sm:text-lg md:text-xl lg:text-xl font-bold ml-16">รายการ</p>
                <hr className="border border-black mx-16" />
                <div className="container max-w-full px-6 sm:px-10 md:px-10 lg:px-16 rounded-lg mt-2">
                    <Collapse accordion items={items} className=" bg-white rounded-lg" />
                </div>
            </div>
        </>
    );
}

export default HomePageRe;
