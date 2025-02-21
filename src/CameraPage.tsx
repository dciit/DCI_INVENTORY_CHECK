import React, { useEffect, useState } from 'react'
import CameraScanner from './Camera';

function CameraPage() {
    const [scannedValue, setScannedValue] = useState<string>("");
    useEffect(() => {
        console.log(scannedValue)
    },[scannedValue])
  return (
    <div className='w-[500px] h-[500px]'>
    <h1>PWA Camera Scanner</h1>
    <CameraScanner onDetect={(value:any) => setScannedValue(value)} />
    {scannedValue && <h2>Scanned: {scannedValue}</h2>}
  </div>
  )
}

export default CameraPage
