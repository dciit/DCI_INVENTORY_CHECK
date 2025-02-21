import Navbar from "@/components/main/navbar";
import { ReduxInterface } from "@/interface/main.interface";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function HomePage() {


    const navigate = useNavigate();

    const redux: ReduxInterface = useSelector((state: any) => state.reducer);

    const admin = [{ route: '/auditee', title: 'แตก Part' }, { route: '/scanqradtee', title: 'Scan QRCode (Auditee)' },
    { route: '/scanqradtor', title: 'Scan QRCode (Auditor)' }, { route: '/adtesumfinal', title: 'Summary Auditee' },
    { route: '/comparesum', title: 'Summary Amount' }];
    const auditee = [{ route: '/auditee', title: 'แตก Part' }, { route: '/adtesumfinal', title: 'สรุปรายการแตก Part' }, { route: '/scanqradtee', title: 'Scan QRCode (Auditee)' }];
    const auditor = [{ route: '/scanqradtor', title: 'Scan QRCode (Auditor)' }];

    let oMenu: any = [];
    if (redux.authen.role == "ADMIN") {
        oMenu = admin;
    } else if (redux.authen.role == "AUDITEE") {
        oMenu = auditee;
    } else if (redux.authen.role == "AUDITOR") {
        oMenu = auditor;
    } else {
        navigate(`/login`);
    }


    return (
        <>
            <Navbar />

            <div className="h-full bg-[#3674B5]/75 flex justify-center items-center">
                <div className='grid grid-cols-4 gap-8  p-8'>
                    {oMenu.map((oItem: any, index: number) => (
                        <div key={index} onClick={() => navigate(oItem.route)} className="flex h-max-[75px] w-full px-8 bg-white rounded-md h-[150px] hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex-col justify-center" >
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
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
