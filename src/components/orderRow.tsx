import * as React from "react";
import {useRef, useState} from "react";
import {IOrder} from "../models";
import numeral from "numeral";
import ETHIcon from '../assets/images/eth.svg';
import USDCIcon from '../assets/images/usdc.svg';
import DollarIcon from '../assets/images/dollarIcon.svg';
import AccountEditIcon from '../assets/images/account-edit_black.svg';
import ConfirmedIcon from '../assets/images/confirmed_black.svg';
import PendingIcon from '../assets/images/pending_black.svg';

import ConfirmDialog from "./ConfirmDialogStyle";
import {ellipseAddress, TxDetails} from "../helpers";
import {payLink, transactionBlockExplorerLink, transactionStatusLink} from "../utils/link_utils";
import {ETH_TOKEN} from "../config/currencyConfig";
import {currentRpcApi} from "../helpers/tx";
import {printOrderTrackingId} from "../utils";
import {OrderDropdown} from "./orders/orderDropdown";
import {toast} from "react-toastify";
import ClickAwayListener from 'react-click-away-listener';

const SAssetRow = {
    width: '100%',
    padding: '2px',
    marginLeft: '8px',
    marginRight: '8px',
    display: 'flex',
    justifyContent: 'between',
    verticalAlign: 'center',
    alignItems: 'center',
    color: 'black',
};
const SAssetRowLeft = {
    display: 'flex',
    alignItems: 'start',
    width: '12%',
};
const Center = {
    alignSelf: 'center',
};

const SColumn = {
    alignItems: 'start',
    padding: '4px',
    width: 'auto',
};
const SAssetName = {
    fontSize: '10',
};

const SPriceLimits = {
    display: 'flex',
    alignItems: 'start',
    fontSize: 'smaller',
    alignSelf: 'center',
}

const SLimitValues = {
    display: 'flex',
    alignItems: 'center',
};


const OrderRow = (props: any) => {
    const {asset} = props;
    const order: IOrder = asset
    let initialState = {
        name: '',
        ensAddress: '',
        walletAddress: '',
        error: false,
        formErrors: '',
    };
    const [inputs, setInputs] = useState(initialState);
    const [ transactionFound, setTransactionFound ] = useState(false)
    const [ confirmed, setConfirmed ] = useState(false)
    const [ blockTransactionData, setBlockTransactionData ] = useState<TxDetails>()

    const [ popupVisible, setPopupVisible ] = useState(false)

    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    React.useEffect(() => {
        if (order && order.transactionHash && !blockTransactionData) {
            //instead of requiring an account, this should be a public page, and get the chain id from the order.
            const txDetailsPromise = currentRpcApi.getTransactionByHash(order.transactionHash, order.chainId);
            txDetailsPromise.then(
                response => {
                    if (!response) {
                        console.warn(`invalid response from transaction api ${response}`);
                        return;
                    }
                    setBlockTransactionData(response)
                    if (response?.hash) {
                        console.log(`transaction found. hash: ${response?.hash}`);
                        setTransactionFound(true);
                    } else {
                        console.warn(`invalid hash from transaction api ${response} hash: ${response?.hash}`);
                    }

                    if (response?.blockHash) {
                        console.log(`transaction block hash found. blockHash: ${response.blockHash}`);
                        setConfirmed(true);
                    } else {
                        console.warn(`invalid blockHash from transaction api ${response} blockHash: ${response.blockHash} blockNumber: ${response.blockNumber}`);
                    }
                }
            )
        }
    }, [order, blockTransactionData]);

    const onEditConfirmed = (): boolean => {
        // if (!(inputs.walletAddress || inputs.ensAddress)) {
        //     setInputs(values => ({...values, error: true, formErrors: "You need to enter either ENS address or Wallet Receive Address"}))
        //     return false
        // }
        // const name = inputs.name
        // const ens = inputs.ensAddress
        // const address = inputs.walletAddress
        // const id = order.transactionHash
        // const depositorData: ITransactionInfo = {
        // }
        //
        // return onEdit(depositorData)
        return false;
    }

    const isTransactionConfirmed = (): boolean => {
        return !!(order?.transactionHash && confirmed)
    }

    let editDepositorDialog = <ConfirmDialog onConfirm={() => onEditConfirmed()}
                                             onCancel={() => {
                                             }}
                                             onShow={() => {
                                                 console.log(`showing depositor edit dialog`)
                                             }}
                                             content={() => <div><p>Create</p></div>}
                                             confirmButtonContent={'Edit'}
                                             contentProps={
                                                 <div>
                                                     <p>Edit Transaction</p>
                                                     <p className="text-red text-xs mt-4 w-60">{inputs.formErrors}</p>
                                                     <form className="mt-4 text-sm">
                                                         <fieldset>
                                                             <div
                                                                 className="flex items-center justify-between rounded">
                                                                 <label>
                                                                     <p>Name</p>
                                                                     <input type="text"
                                                                            className="mb-4 text-primary rounded p-2"
                                                                            name="name" readOnly={true}
                                                                            value={inputs.name || ""}
                                                                     />
                                                                 </label>
                                                             </div>
                                                             <label>
                                                                 <p>ENS Address</p>
                                                                 <input type="text"
                                                                        className="mb-4 text-primary rounded p-2"
                                                                        name="ensAddress"
                                                                        value={inputs.ensAddress || ""}
                                                                        onChange={handleChange}/>
                                                             </label>
                                                             <label>
                                                                 <p>Wallet Address</p>
                                                                 <input type="text"
                                                                        className="mb-4 text-primary rounded p-2"
                                                                        name="walletAddress"
                                                                        value={inputs.walletAddress || ""}
                                                                        onChange={handleChange}/>
                                                             </label>
                                                         </fieldset>
                                                     </form>
                                                 </div>

                                             }
                                             cancelOnClickOutside={true}>
        <button className="bg-black bg-opacity-10" onClick={() => {
            //selectDepositor(order)
        }}>
            <img className="w-6 h-6" src={AccountEditIcon} alt=""/>
        </button>
    </ConfirmDialog>;

    // const icon = isTransactionConfirmed() ?
    //     <a className="ml-4" target='_blank' rel="noreferrer"
    //        href={transactionStatusLink(order.transactionHash!!, order.trackingId || "")}>
    //         <img style={Center} className="w-8 h-8 mr-2 filter-black" src={ConfirmedIcon} alt="Status"/>
    //     </a> :
    //     <a className="ml-4" target='_blank' rel="noreferrer"
    //        href={transactionFound ? transactionStatusLink(order.transactionHash!!, order.trackingId || "") :order.trackingId ? payLink(order.trackingId) : ''}>
    //         <img style={Center} className="w-8 h-8 mr-2 filter-black" src={PendingIcon} alt=""/>
    //     </a>

    const revisitTransaction = () => {
        const transactionStatusUrl = transactionStatusLink(order.transactionHash!!, order.trackingId || "")
        const transactionPayLink = order.trackingId ? payLink(order.trackingId) : ''
        const revistLink = isTransactionConfirmed() ? transactionStatusUrl : transactionPayLink;
        window.open(revistLink, "_blank");
    }
    const copyHash = () => {
        const hash = order.transactionHash || "";
        navigator.clipboard.writeText(hash);
        toast.info("Copied", {
            autoClose: 600,
        })
    }
    const blockExplorerLink = () => {
        const linkUrl = transactionBlockExplorerLink(order.chainId, blockTransactionData?.hash!!)
        window.open(linkUrl, "_blank");
    }

    const popoverRef = useRef<HTMLDivElement>(null);

    const handleClickAway = () => {
        console.log('Maybe close the popup');
        setPopupVisible(false);
    };




    const orderLocalDate = new Date(order.updatedAt!! + "Z");
    const orderDate = `${orderLocalDate.getMonth() + 1}-${orderLocalDate.getDate()}-${orderLocalDate.getFullYear()}` || null;
    const orderTime = `${orderLocalDate.getHours()}:${orderLocalDate.getMinutes()}` || null;

    return (
        <div className="w-full h-full flex justify-between bg-white rounded-md py-6 px-6" style={SAssetRow}>
            <div className="flex w-1/4" ref={popoverRef}>
                <ClickAwayListener onClickAway={handleClickAway}>
                    {<OrderDropdown
                        popoverRefElement={popoverRef.current!!}
                        transactionConfirmed={isTransactionConfirmed()}
                        onCancel={() => {}}
                        onBlockExplorer={blockExplorerLink}
                        onCopyHash={copyHash}
                        onResendSMS={() => {}}
                        onRevistLink={revisitTransaction}
                    />
                    }
                </ClickAwayListener>

                <div className="" style={SPriceLimits}>
                    <div className="ml-4" style={SAssetName}>{`${printOrderTrackingId(order)}`}</div>
                    {/*subtitle with hash or pending*/}
                    {/*<div className="flex text-xs overflow-hidden">*/}
                    {/*    {order.transactionHash && order.trackingId ?*/}
                    {/*        <a target='_blank' rel="noreferrer"*/}
                    {/*           href={transactionStatusLink(order.transactionHash, order.trackingId)}>{`${ellipseAddress(order.transactionHash)}`}</a> : 'Transaction Pending'}*/}
                    {/*</div>*/}
                </div>
            </div>
            <div style={SPriceLimits}>
                <div style={SAssetName}>{`${orderDate}`}</div>
            </div>
            <div style={SPriceLimits}>
                <div style={SAssetName}>{`${orderTime}`}</div>
            </div>
            <div style={SPriceLimits}>
                <div style={SColumn}>
                    <div className="mr-8" style={SLimitValues}>
                        {/*<img className="w-6 h-6 mr-2" src={DollarIcon} alt=""/>*/}
                        {`USD ${numeral(order.amount || 0).format('0,0.00')}`}
                    </div>
                    {order.transactionHash && order.trackingId ?
                        order.token === ETH_TOKEN ?
                            <div style={SLimitValues}>
                                <img className="w-6 h-6 mr-2" src={ETHIcon} alt=""/>
                                {numeral(order.nativeAmount || 0).format('0,0.000000')}
                            </div>
                            :
                            <div style={SLimitValues}>
                                <img className="w-6 h-6 mr-2" src={USDCIcon} alt=""/>
                                {numeral(order.nativeAmount || 0).format('0,0.00')}
                            </div>
                        : ''}
                </div>
            </div>

            <div className="w-20 text-sm font-righteous">
                <p>{transactionFound ? ( confirmed ? `Confirmed` : 'Pending Approval') : `Unpaid`}</p>
            </div>

        </div>
    );
};

export default OrderRow;
