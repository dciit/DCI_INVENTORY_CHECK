
//@ts-nocheck
import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

interface CameraScannerProps {
    onDetect: (value: string) => void;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onDetect }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();

        navigator.mediaDevices
            .getUserMedia({ video: { facingMode: "environment" } })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }

                // Start scanning for QR codes
                codeReader.decodeFromVideoDevice(undefined, videoRef.current!, (result, err) => {
                    if (result) {
                        onDetect(result.text);
                    }
                    if (err && !(err instanceof NotFoundException)) {
                        setError(err.message);
                    }
                });
            })
            .catch((err) => setError(err.message));

        return () => {
            codeReader.reset();
        };
    }, [onDetect]);

    return (
        <div>
            <video ref={videoRef} style={{ width: '150px',height:'150px' }} />
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </div>
    );
};

export default CameraScanner;
