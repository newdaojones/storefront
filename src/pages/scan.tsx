import React, {Component, useState} from 'react';
import QrReader from "react-qr-scanner";

/*

QR CODE EXAMPLE USE
https://codesandbox.io/s/r3tyk
 */
export const ScanPage = () => {
    let [result, delay] = useState(false);
    const handleScan = (data:any) => {
        result = data
        // this.setState({
        //     result: data,
        // })
    }
    const handleError = (err: any) => {
        console.error(`error in qr scan ${err}`)
    }
        const previewStyle = {
            height: 240,
            width: 320,
        }

        return(
            <div>
                <QrReader
                    delay={100}
                    style={previewStyle}
                    onError={handleError}
                    onScan={handleScan}
                />
                <p>{result}</p>
            </div>
        )
}