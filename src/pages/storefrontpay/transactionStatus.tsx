import React, {useState} from 'react';
import logoIcon from '../../assets/images/logo.svg';
import promo1 from '../../assets/images/promo_image_1.svg';
import promo2 from '../../assets/images/promo_image_2.svg';
import promo3 from '../../assets/images/promo_image_3.svg';
import confirmedIcon from '../../assets/images/confirmed.svg';
import pendingIcon from '../../assets/images/loading.svg';
import errorIcon from '../../assets/images/loading.svg';

import {useLocation} from "react-use";
import {extractTransactionIdFromUrl, ITransactionStatus} from "../../utils/path_utils";
import {useHistory} from "react-router-dom";
import {currentRpcApi, getNonZeroAccountBalance} from "../../helpers/tx";
import {ellipseAddress} from "../../helpers";
import {useWalletConnectClient} from "../../contexts/walletConnect";

/**
 * Example URL
 * http://localhost:3000/storefront/status?transactionId=0x75a4753509b0dcc3e8cb176ee343a30545995945e16250ca6907c22a4ac3b398&orderId=3&amount=0.55
 *
 * http://localhost:3000/storefront/status?transactionId=0x34dfd&orderId=3&amount=0.55

 * https://kovan.etherscan.io/tx/0x75a4753509b0dcc3e8cb176ee343a30545995945e16250ca6907c22a4ac3b398
 *
 * @constructor
 */

export const TransactionStatus = () => {
    let query = useLocation().search;
    const { accounts, balances } = useWalletConnectClient();
    const accountBalance = getNonZeroAccountBalance(accounts, balances);

    const history = useHistory();
    const [ confirmed, setConfirmed ] = useState(false)
    const [ blockHash, setBlockHash ] = useState('')


    let transactionId: ITransactionStatus | null = null;
    if (!query) {
        console.log(`Invalid query data, redirecting`);
        history.replace("/error?msg=invalid data");
    } else {
        transactionId = extractTransactionIdFromUrl(query);
        console.log(`transactionId: ${transactionId.transactionId} orderTrackingId: ${transactionId.orderTrackingId}`);
    }

    React.useEffect(() => {
        if (transactionId && accountBalance && accountBalance?.account) {
            const account = accountBalance.account;
            const [namespace, reference, address] = account.split(":");
            const chainId = `${namespace}:${reference}`;
            const gasPrices = currentRpcApi.getTransactionByHash(transactionId.transactionId, chainId);
            gasPrices.then(
                response => {
                    // response.forEach(value => {
                    //         console.log(`trx: ${value}`);
                    //     }
                    // )

                    console.log(`transaction details block hash: ${response.blockHash}`);
                    if (response?.blockHash) {
                        setConfirmed(true);
                        setBlockHash(response.blockHash);
                    }

                }
            )
        }
    }, [transactionId, accountBalance, accountBalance?.account]);

    return (
        <div className="h-screen w-screen flex twoColumnContainer">
            {/*Left Column*/}
            <div className="h-full w-full flex items-center justify-center flex-col bg-white shadow-md">
                <div className="flex items-center justify-center pt-10">
                    <img className="w-12 h-12" src={logoIcon} alt=""/>
                    <div className="w-full flex flex-col p-4">
                        <h1 className="text-xl font-righteous">Storefront Pay</h1>
                        <h1 className="text-sm ">testnet</h1>
                    </div>
                </div>


                <div className="w-3/4 flex justify-around py-4">
                    <div className="w-full flex flex-col items-center p-4">
                        <p className="text-sm">Payment from</p>
                        <div className="flex">
                            <p className="font-bold font-righteous">0x2342...f432</p>
                        </div>
                    </div>


                    <div className="w-full flex flex-col items-center p-4">
                        <p className="text-sm ">Transaction Id</p>
                        <p className="font-righteous">{`${ellipseAddress(transactionId?.transactionId)}`}</p>
                    </div>
                </div>
                <div className="w-3/4 flex justify-around pb-4">
                    <div className="flex flex-col pb-4">
                        <p className="text-sm">Order Id</p>
                        <p className="font-bold text-xl pl-4">{`${transactionId?.externalOrderId}`}</p>
                    </div>
                    <div className="flex flex-col pb-4">
                        <p className="text-sm">Amount</p>
                        <p className="font-bold text-xl">{`USD $${transactionId?.amount.toFixed(2)}`}</p>
                    </div>
                </div>


                {transactionId && (
                    <a>
                        <div className="h-40 flex items-center justify-center">
                            <div className="w-3/4 flex justify-center items-center pb-4">
                                <div className="flex flex-col justify-center items-center pb-4">
                                    <p className="text-sm">Status</p>
                                    <p className="font-bold text-xl pl-4">{confirmed? `Confirmed`:`Pending`}</p>
                                </div>
                                <img className="w-20 h-20 ml-4" style = {{animation: confirmed ? '': `spin 3s linear infinite` }} src={confirmed? confirmedIcon: pendingIcon} alt="" />
                            </div>
                        </div>
                    </a>
                )}

                <p className="text-xs mt-1 cursor-pointer">{confirmed? <div>
                    <p>Block Hash</p>
                    <p>{ellipseAddress(blockHash)}</p>
                </div>: `Trouble verifying?`}</p>
                <p className="mt-40 mb-40 mx-10 text-center">Please allow for the network to verify the transaction <a className="font-bold font-righteous" href={'https://test.jxndao.com/storefront'}>Block Explorer</a> to learn more.</p>

            </div>

            {/*Right Column*/}
            <div className="w-full flex items-center justify-center flex-col py-10">
                <div id="logo" className="flex items-center justify-center rounded-10xl overflow-hidden">
                    <img className="w-16 h-16" src={logoIcon} alt=""/>
                </div>
                <h1 className="text-white text-xl text-center font-bold mx-40 mt-10">Accept Crypto Payments and Drive Incremental Sales Now!</h1>

                <img className="w-16 h-16 mt-10" src={promo1} alt=""/>
                <p className="text-white font-bold mt-4">Reach Millions of Users</p>
                <p className="text-white text-center text-sm mt-4 mx-10">Access to millions of users using wallet apps, and capitalise on the world's largest adoption rate. </p>

                <img className="w-16 h-16 mt-10" src={promo2} alt=""/>
                <p className="text-white font-bold mt-4">Lowest Cost</p>
                <p className="text-white text-center text-sm mt-4 mx-10">Pay zero transactions fees and save up to 85% on settlement fees. </p>

                <img className="w-16 h-16 mt-10" src={promo3} alt=""/>
                <p className="text-white font-bold mt-4">Easy Integration</p>
                <p className="text-white text-center text-sm mt-4 mx-10">Integrate with a few clicks using our SDK or plugins. No coding experience needed. </p>
            </div>
        </div>
    );
};