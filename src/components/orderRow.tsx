import * as React from "react";
import {useState} from "react";
import {IOrder, ITransactionInfo} from "../models";
import numeral from "numeral";
import BTCIcon from '../assets/images/btcIcon.svg';
import DollarIcon from '../assets/images/dollarIcon.svg';
import AccountEditIcon from '../assets/images/account-edit.svg';
import ProfileIcon from '../assets/images/profile_icon.svg';
import ConfirmDialog from "./ConfirmDialogStyle";
import {ellipseAddress} from "../helpers";

const SAssetRow = {
    width: '100%',
    padding: '2px',
    display: 'flex',
    justifyContent: 'space-between',
    verticalAlign: 'center',
    alignItems: 'center',
    color: 'white',
};
const SAssetRowLeft = {
    display: 'flex',
    alignItems: 'start',
    width: '40%',
};
const Center = {
    alignSelf: 'center',
};

const SColumnLeft = {
    alignItems: 'start',
    paddingLeft: '0px',
    width: 'max-content',
};
const SColumn = {
    alignItems: 'end',
    padding: '4px',
    width: 'max-content',
};
const SAssetName = {
    display: 'flex',
    fontSize: '10',
};

const SPriceLimits = {
    display: 'flex',
    alignItems: 'end',
    width: 'max-content',
    fontSize: 'smaller',
    alignSelf: 'center',
}

const SAssetBalance = {
    display: 'flex',
    alignSelf: 'center',
    align: 'end',
    color: 'white',
};

const SLimitValues = {
    display: 'flex',
    alignItems: 'right',
};



const OrderRow = (props: any) => {
    const {asset, onEdit} = props;
    const depositorInfo: IOrder = asset
    // const selectDepositor = (item: ITransactionInfo): boolean => {
    //     setInputs(values => ({...values, name: item.depositorName, walletAddress: item.memberAddress, ensAddress: item.memberENSAddress}))
    //     return true
    // }
    let initialState = {
        name: '',
        ensAddress: '',
        walletAddress: '',
        error: false,
        formErrors: '',
    };
    const [inputs, setInputs] = useState(initialState);

    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    const onEditConfirmed = () : boolean => {
        // if (!(inputs.walletAddress || inputs.ensAddress)) {
        //     setInputs(values => ({...values, error: true, formErrors: "You need to enter either ENS address or Wallet Receive Address"}))
        //     return false
        // }
        // const name = inputs.name
        // const ens = inputs.ensAddress
        // const address = inputs.walletAddress
        // const id = depositorInfo.transactionHash
        // const depositorData: ITransactionInfo = {
        // }
        //
        // return onEdit(depositorData)
        return false;
    }
    let editDepositorDialog = <ConfirmDialog onConfirm={() => onEditConfirmed()}
                                             onCancel={() => {}}
                                             onShow={() => {console.log(`showing depositor edit dialog`)}}
                                             content={() => <div><p>Create</p></div>}
                                             confirmButtonContent={'Edit'}
                                             contentProps={
                                                 <div>
                                                     <p>Edit Transaction</p>
                                                     <p className="text-red text-xs mt-4 w-60">{inputs.formErrors}</p>
                                                     <form className="text-white mt-4 text-sm">
                                                         <fieldset>
                                                             <div
                                                                 className="flex items-center justify-between text-white rounded">
                                                                 <label>
                                                                     <p>Name</p>
                                                                     <input type="text" className="mb-4 text-primary rounded p-2" name="name" readOnly={true}
                                                                            value={inputs.name || ""}
                                                                     />
                                                                 </label>
                                                             </div>
                                                             <label>
                                                                 <p>ENS Address</p>
                                                                 <input type="text"  className="mb-4 text-primary rounded p-2" name="ensAddress"
                                                                        value={inputs.ensAddress || ""}
                                                                        onChange={handleChange}/>
                                                             </label>
                                                             <label>
                                                                 <p>Wallet Address</p>
                                                                 <input type="text"  className="mb-4 text-primary rounded p-2"  name="walletAddress"
                                                                        value={inputs.walletAddress || ""}
                                                                        onChange={handleChange}/>
                                                             </label>
                                                         </fieldset>
                                                     </form>
                                                 </div>

                                             }
                                             cancelOnClickOutside={true}>
        <button className="bg-white bg-opacity-10" onClick={() => {
            //selectDepositor(depositorInfo)
        }}>
            <img className="w-6 h-6" src={AccountEditIcon} alt=""/>
        </button>
    </ConfirmDialog>;

    return (
        <div style={SAssetRow}>
            <div style={SAssetRowLeft}>
                <img style={Center} className="w-8 h-8 mr-2" src={ProfileIcon} alt="" />
                <div style={SColumnLeft}>
                    <div style={SAssetName}>{`from: ${depositorInfo.externalOrderId}`}</div>
                    <div className="flex text-xs text-white overflow-hidden">
                        {depositorInfo.transactionHash ? `hash: ${ellipseAddress(depositorInfo.transactionHash)}` : '-'}
                    </div>
                </div>
            </div>
            <div style={SPriceLimits}>
                <div style={SAssetName}>{`${depositorInfo.updatedAt}`}</div>
            </div>
            <div style={SPriceLimits}>
                <div style={SColumn}>
                    <div style={SLimitValues}>
                        <img className="w-6 h-6 mr-2" src={DollarIcon} alt="" />
                        {numeral(depositorInfo.amount || 0).format('0,0.00')}
                    </div>
                    <div style={SLimitValues}>
                        <img className="w-6 h-6 mr-2" src={BTCIcon} alt="" />
                        {numeral(depositorInfo.amount || 0).format('0,0.000000')}
                    </div>
                </div>
            </div>

            <div style={SAssetBalance}>
                {editDepositorDialog}
            </div>
        </div>
    );
};

export default OrderRow;
