import React, {useState} from 'react';
import logoIcon from '../../assets/images/logo.svg';
import promo1 from '../../assets/images/promo_image_1.svg';
import promo2 from '../../assets/images/promo_image_2.svg';
import promo3 from '../../assets/images/promo_image_3.svg';
import confirmedIcon from '../../assets/images/confirmed.svg';
import pendingIcon from '../../assets/images/loading.svg';

import {useLocation} from "react-use";
import {extractTransactionIdFromUrl, ITransactionStatus} from "../../utils/path_utils";
import {useHistory} from "react-router-dom";
import {currentRpcApi} from "../../helpers/tx";
import {ellipseAddress, TxDetails} from "../../helpers";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentOrder} from "../../store/selector";
import {userAction} from "../../store/actions";
import numeral from "numeral";
import {transactionBlockExplorerLink} from "../../utils/link_utils";
import useInterval from "@use-it/interval";
import {IOrder} from "../../models";

/**
 * Example URL
 * http://localhost:3000/storefront/status?transactionId=0x75a4753509b0dcc3e8cb176ee343a30545995945e16250ca6907c22a4ac3b398&orderTrackingId=6020fb4d-02e1-41c7-9570-584584e0e3a1
 *
 * @constructor
 */

export const TransactionStatus = () => {
    let query = useLocation().search;
    const dispatch = useDispatch();
    const history = useHistory();
    const [ transactionFound, setTransactionFound ] = useState(false)
    const [ confirmed, setConfirmed ] = useState(false)
    const [ blockTransactionData, setBlockTransactionData ] = useState<TxDetails>()

    const [ transactionId, setTransactionId ] = useState<ITransactionStatus | null>(null)

    const currentOrder = useSelector(selectCurrentOrder)

    const getTransactionDetails = (transaction: ITransactionStatus, order: IOrder) => {
        const txDetailsPromise = currentRpcApi.getTransactionByHash(transaction.transactionId, order.chainId);
        txDetailsPromise.then(
            response => {
                if (!response) {
                    console.warn(`invalid response from transaction api ${response}`);
                    return;
                }
                setBlockTransactionData(response);
                if (response?.hash) {
                    setTransactionFound(true);
                } else {
                    console.warn(`invalid hash from transaction api ${response} hash: ${response.hash}`);
                }

                if (response?.blockHash) {
                    console.debug(`transaction block hash found. blockHash: ${response.blockHash}`);
                    setConfirmed(true);
                } else {
                    console.debug(`blockHash from transaction api missing. not yet confirmed blockHash: ${response.blockHash} blockNumber: ${response.blockNumber}`);
                }
            }
        )
    }

    React.useEffect(() => {
        if (!query) {
            console.log(`Invalid query data, redirecting`);
            history.replace("/error?msg=invalid data");
        } else {
            try {
                const transactionData = extractTransactionIdFromUrl(query);

                if (transactionData.orderTrackingId && !currentOrder?.transactionHash) {
                    setTransactionId(transactionData);
                    console.info(`dispatch get order for trackingId ${transactionData.orderTrackingId}`)
                    dispatch(userAction.getOrder({orderTrackingId: transactionData.orderTrackingId}));
                    console.log(`transactionId: ${transactionId?.transactionId} response orderTrackingId: ${transactionData.orderTrackingId}  orderTrackingId: ${transactionId?.orderTrackingId} externalId: ${transactionId?.externalOrderId}`);
                }

            } catch (e: any) {
                toast.error(`${e?.message || 'error'}`)
            }
        }
    }, [query, dispatch, history, transactionId?.externalOrderId, transactionId?.transactionId, transactionId?.orderTrackingId]);


    useInterval(() => {
        if (currentOrder && currentOrder.transactionHash && !confirmed) {
            console.log(`refreshing order transaction details...`)
            if (transactionId) {
                getTransactionDetails(transactionId, currentOrder)

            } else {
                console.error("invalid order trackingId. cannot refresh. ");
            }
        }
    }, 60000);

    React.useEffect(() => {
        if (transactionId && currentOrder && !blockTransactionData) {
            console.info(`fetching transaction by hash...`)
            getTransactionDetails(transactionId, currentOrder);
        }
    }, [transactionId, currentOrder, blockTransactionData]);

    const blockExplorerLink = currentOrder && blockTransactionData?.hash ? transactionBlockExplorerLink(currentOrder.chainId, blockTransactionData?.hash!!) : '';
    return (
        <div className="h-screen w-screen flex twoColumnContainer">
            {/*Left Column*/}
            <div className="h-full w-full flex items-center justify-center flex-col bg-white shadow-md">
                <div className="flex items-center justify-center pt-10">
                    <img className="w-12 h-12" src={logoIcon} alt=""/>
                    <div className="w-full flex flex-col p-4">
                        <h1 className="text-xl font-righteous">Storefront Pay</h1>
                        <h1 className="text-sm ">{ currentOrder?.testnet ? 'Test Money' : 'Real Money'}</h1>
                    </div>
                </div>


                <div className="w-3/4 flex justify-around py-4">
                    <div className="w-full flex flex-col items-center p-4">
                        <p className="text-sm">Payment from</p>
                        <div className="flex">
                            <p className="font-bold font-righteous">{ellipseAddress(blockTransactionData?.from)}</p>
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
                        <p className="font-bold text-xl pl-4">{`${currentOrder?.externalOrderId || ''}`}</p>
                    </div>
                    <div className="flex flex-col pb-4">
                        <p className="text-sm">Amount</p>
                        <p className="font-bold text-xl">{`USD $${currentOrder?.amount.toFixed(2) || ''}`}</p>
                    </div>
                </div>


                {transactionId && (
                    <div className="h-40 flex items-center justify-center">
                        <div className="w-3/4 flex justify-center items-center pb-4">
                            <div className="flex flex-col justify-center items-center pb-4">
                                <p className="text-sm">Status</p>
                                <p className="font-bold text-xl pl-4">{transactionFound ? (confirmed? `Confirmed`:`Pending Approval`) : `Transaction not found`}</p>
                            </div>
                            <img className="w-20 h-20 ml-4" style = {{animation: confirmed ? '': `spin 3s linear infinite` }} src={confirmed? confirmedIcon: pendingIcon} alt="" />
                        </div>
                    </div>
                )}

                <div className="text-xs mt-1 ">{transactionFound?
                    <div className="flex flex-col justify-center items-center">
                        <p>Transaction Hash</p>
                        <a href={blockExplorerLink}>
                            <p className="cursor-pointer">{ellipseAddress(blockTransactionData?.hash)}</p>
                        </a>
                        <p className="pt-2">Native Amount</p>
                        <p>{`${numeral(currentOrder?.nativeAmount).format('0,0.000000')} ${currentOrder?.token}`}</p>

                        { confirmed && blockTransactionData?.blockHash &&
                            <div className="pt-2 flex flex-col justify-center items-center">
                                <p>Block Hash</p>
                                <a href={blockExplorerLink}>
                                <p className="cursor-pointer">{ellipseAddress(blockTransactionData?.blockHash)}</p>
                                </a>
                            </div>
                        }
                    </div>
                    : `Trouble verifying?`}
                </div>
                <p className="mt-40 mb-40 mx-10 text-center">Please allow for the network to verify the transaction.
                    Check out <a className="font-bold font-righteous" href={blockExplorerLink}>Block Explorer</a> to learn more.</p>

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
