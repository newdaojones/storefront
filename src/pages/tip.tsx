import React, {useEffect, useState} from 'react';
import UsFlagImage from '../assets/images/us-flag.png'
import {ExternalPayUrlParams} from "../utils/path_utils";
import {toast} from "react-toastify";
import {useLocation} from "react-use";
import {userAction} from "../store/actions";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentOrder} from "../store/selector";

/**
 * Test url
 * http://localhost:3000/tip?trackingId=625484bc-c4ee-4fad-a252-c4db7b6db46a
 * @param text
 * @constructor
 */
export const Tip = ({text = 'Loading....',}: {
    text?: string;
}) => {
    const dispatch = useDispatch();
    let query = useLocation().search;

    const currentOrder = useSelector(selectCurrentOrder);
    const [focusedCustomTip, setFocusedCustomTip] = useState(false)
    const [cost, setCost] = useState(0)
    const [tipPercent, setTipPercent] = useState('')


    const onNext = () => {
        //TODO add payment url
        console.info(`onNext cost: ${cost} tip: ${tipPercent}`);
        const paymentLinkUrl = "localhost"
        window.open(paymentLinkUrl, "noreferrer");
    }

    const onChange = (key: string, value: any) => {
        if (key === 'tipPercent') {
            console.info(`set tip to ${value}`);
            setTipPercent(value);
        }
    }

    const onChangeCostInput = (e: any) => {
        const value = e.target.value;

        if (!Number.isNaN(Number(value))) {
            onChange('cost', value)
        }

    }

    const onChangeCustomTipPercent = (e: any) => {
        const value = e.target.value;

        if (!Number.isNaN(Number(value))) {
            onChange('tipPercent', value)
        }
    }

    const extractFromUrl = (url: string): ExternalPayUrlParams => {
        if (!url) {
            throw new Error("input url must be not empty");
        }
        let queryString = url;
        if (url.includes('?')) {
            queryString = url.substring(url.lastIndexOf('?'))
        }
        const parsed = new URLSearchParams(queryString);

        const orderTrackingId = parsed.get("trackingId");
        // const subtotal = parsed.get("subtotal");
        // const orderFeePercentage = parsed.get("feePercentage");

        console.log(`trackingId: ${orderTrackingId}`);

        if (!orderTrackingId) {
            throw new Error("orderTrackingId is required.");
        }
        return {
            trackingId: orderTrackingId,
        }
    }


    useEffect(() => {
        if (!currentOrder) {
            return;
        }

        if (currentOrder.amount === 0) {
            toast.error("invalid order amount");
            return;
        }

        if (!currentOrder.trackingId) {
            toast.error("invalid order trackingId");
            return;
        }

        if (currentOrder.transactionHash && currentOrder.transactionHash.length > 0) {
            toast.error("Order has already been paid")
            return;
        }


        if (currentOrder.trackingId && currentOrder.amount) {
            console.warn("non null order found, updating cost");
            setCost(currentOrder.amount);
        }
    }, [currentOrder]);


    useEffect(() => {
        if (query) {
            try {
                const order = extractFromUrl(query);
                if (!order.trackingId) {
                    toast.error(`Invalid orderTrackingId`)
                    return;
                }
                console.debug(`detected order in query ${order.trackingId}.`);
                //TODO link only has the tracking id
                console.debug(`detected order in query ${order.trackingId}. Dispatching get order`);
                dispatch(userAction.getOrder({orderTrackingId: order.trackingId}))


            } catch (e: any) {
                console.log(`error extract From Url: ${e}`);
                toast.error(`error fetching order data. ${e?.message}`)
            }
        }

    }, [query]);

    return (
        <div className="flex flex-col items-center direction-column text-center justify-center h-full w-full">
            <div className="widget-container bg-white bg-opacity-50 p-20">
                <h3 className=" text-4xl mb-10 text-center">Tip & Sub Total</h3>
                <p className=" text-lg text-left">Cost of Goods</p>
                <div className="flex w-full">
                    <input
                        value={cost}
                        onChange={onChangeCostInput}
                        className="border-secondary outline-none border-2 rounded-md h-11 bg-white bg-opacity-90 flex-1  text-md text-right text-lg p-2 shadow-sm shadow-white"
                    />
                    <div
                        className='border-2 border-secondary rounded-md h-11 w-24 ml-1 flex bg-white bg-opacity-90 items-center justify-center  text-lg shadow-sm shadow-white'>
                        <img src={UsFlagImage} alt='' className="flag mr-2"/>
                        USD
                    </div>
                </div>
                <div>
                    <p className=" text-lg mt-4 text-left">+ Tip (optional)</p>
                    <div className='mt-3 flex w-full justify-end items-center'>
                        <p className=' text-lg m-0 mr-5'> {cost ? (Number(cost) * 0.1).toFixed(2) : ''}</p>
                        <div
                            className={`h-11 bg-white bg-opacity-90 flex items-center justify-center w-24 rounded-md cursor-pointer shadow-md shadow-white ${tipPercent === '10' ? 'bg-gradient-to-b from-purple-200 to-purple-400' : ''}`}
                            onClick={() => onChange('tipPercent', '10')}
                        >
                            10%
                        </div>
                    </div>
                    <div className='mt-3 flex w-full justify-end items-center'>
                        <p className=' text-lg m-0 mr-5'> {cost ? (Number(cost) * 0.15).toFixed(2) : ''}</p>
                        <div
                            className={`h-11 bg-white bg-opacity-90  flex items-center justify-center w-24 rounded-md cursor-pointer shadow-md shadow-white ${tipPercent === '15' ? 'bg-gradient-to-b from-purple-200 to-purple-400' : ''}`}
                            onClick={() => onChange('tipPercent', '15')}
                        >
                            15%
                        </div>
                    </div>
                    <div className='mt-3 flex w-full justify-end items-center'>
                        <p className=' text-lg m-0 mr-5'> {cost ? (Number(cost) * 0.2).toFixed(2) : ''}</p>
                        <div
                            className={`h-11 bg-white bg-opacity-90  flex items-center justify-center w-24 rounded-md cursor-pointer shadow-md shadow-white ${tipPercent === '20' ? 'bg-gradient-to-b from-purple-200 to-purple-400' : ''}`}
                            onClick={() => onChange('tipPercent', '20')}
                        >
                            20%
                        </div>
                    </div>
                    <div className='mt-3 flex w-full justify-end items-center'>
                        <p className=' text-lg m-0 mr-5'> {cost && tipPercent && ![10, 15, 20].includes(Number(tipPercent)) ? (Number(cost) * Number(tipPercent) / 100).toFixed(2) : ''}</p>
                        {focusedCustomTip ?
                            <input
                                value={[10, 15, 20].includes(Number(tipPercent)) ? undefined : tipPercent}
                                placeholder="??%"
                                autoFocus
                                onBlur={() => setFocusedCustomTip(false)}
                                onChange={onChangeCustomTipPercent}
                                className={`h-11 bg-white bg-opacity-90  text-center outline-none  flex items-center justify-center w-24 rounded-md cursor-pointer shadow-md shadow-white placeholder-white ${tipPercent && !['10', '15', '20'].includes(tipPercent) ? 'bg-gradient-to-b from-purple-200 to-purple-400' : ''}`}
                            />
                            : <div
                                className={`h-11 bg-white bg-opacity-90   flex items-center justify-center w-24 rounded-md cursor-pointer shadow-md shadow-white ${tipPercent && !['10', '15', '20'].includes(tipPercent) ? 'bg-gradient-to-b from-purple-200 to-purple-400' : ''}`}
                                onClick={() => setFocusedCustomTip(true)}
                            >
                                {tipPercent && !['10', '15', '20'].includes(tipPercent) ? `${tipPercent}%` : '??%'}
                            </div>
                        }
                    </div>
                </div>
                <p className="mt-2  text-lg text-left">= Sub-Total</p>
                <div className="flex w-full">
                    <div
                        className="border-secondary border-2 rounded-md h-11 bg-white bg-opacity-90  flex-1  text-md text-right text-lg p-2 shadow-sm shadow-white">
                        {cost ? (Number(cost) + Number(cost) * Number(tipPercent || 0) / 100).toFixed(2) : ''}
                    </div>
                    <div
                        className='border-2 border-secondary rounded-md h-11 w-24 ml-1 flex items-center justify-center  text-lg shadow-sm shadow-white'>
                        <img src={UsFlagImage} alt='' className="w-20 h-20 flag mr-2"/>
                        USD
                    </div>
                </div>
                <button
                    disabled={!cost}
                    onClick={() => onNext()}
                    className={`mt-4  text-lg text-center w-full rounded-md h-11 border-2 border-secondary flex items-center justify-center shadow-md shadow-white ${cost ? 'bg-gradient-to-b from-purple-400 to-purple-600' : ''}`}
                >
                    Continue with Transak
                </button>
            </div>
        </div>
    );
}
