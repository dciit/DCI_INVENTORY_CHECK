import { ParamSync } from '@/pages/reports/commit';
import { APIConfirmSync } from '@/service/invsave.service';
import { Button, Modal } from 'antd'
import { useState } from 'react'
import { MdOutlineFileUpload } from "react-icons/md";

interface PropModalSync {
    open: boolean;
    close: Function;
    data: ParamSync;
    load: Function;
}

function ModalCommitSyncConfirm(props: PropModalSync) {
    const { open, close, data, load } = props;
    const [loading, setLoad] = useState<boolean>(false);
    const handleSync = async () => {
        let RESConfirmSync = await APIConfirmSync(data);
        try {
            if (RESConfirmSync.all == RESConfirmSync.ok) {
                if (Number(RESConfirmSync.err) > 0) {
                    alert(`Found Error Count : ${RESConfirmSync.err}`)
                } else {
                    setLoad(true);
                }
            } else {
                alert(`All and Ok Not Match`)
                console.log(RESConfirmSync)
            }
            load();
            close(false);
        } catch (e: Error | any) {
            alert(e);
        }
        setLoad(false);
    }
    return (
        <Modal title='แจ้งเตือน' open={open} onClose={() => load ? false : close(false)} onCancel={() => load ? false : close(false)} footer={<div className='flex gap-2 justify-end'>
            <Button type={'primary'} onClick={handleSync} icon={<MdOutlineFileUpload />} loading={loading}>ยืนยัน</Button>
            <Button onClick={() => close(false)}>ปิดหน้าต่าง</Button>
        </div>}>
            <div className='select-none'>
                <span>คุณต้องการส่งข้อมูลไปยัง ALPHA ใช่หรือไม่ ?</span>
            </div>
        </Modal>
    )
}

export default ModalCommitSyncConfirm