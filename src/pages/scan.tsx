import React, {useState} from 'react';
import {QrReader} from "react-qr-reader";
import {useHistory} from "react-router-dom";
/*

QR CODE EXAMPLE USE
https://codesandbox.io/s/r3tyk
 */
export const ScanPage = () => {
    const [data, setData] = useState('');
    const history = useHistory();

    const goToBuy = () => {
        console.log(`navigating to scan page `)
        history.push("/buy");
    };

    return (
        <div className="h-full">
            <QrReader
                onResult={(result, error) => {
                    if (result && data.length <= 0) {
                        const resultText = result.getText()
                        console.info(`scanned qr result: ${result} text: ${resultText}`)
                        setData(resultText);
                        goToBuy();
                    }

                    if (error && error.message) {
                        console.info(`error while scanning: ${error.message}`);
                    }
                }}
                constraints={{ facingMode : "environment" }}
                //scanDelay={000}
                containerStyle={{}}
                videoStyle={{height: '100vh', width: '100vw', objectFit: 'cover'}}
                className=""
            />
            <p>{data}</p>
        </div>
    );
}
