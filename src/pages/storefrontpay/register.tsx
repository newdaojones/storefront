import React, {useState} from 'react';
import logoIcon from '../../assets/images/logo.svg';
import promo1 from '../../assets/images/promo_image_1.svg';
import promo2 from '../../assets/images/promo_image_2.svg';
import promo3 from '../../assets/images/promo_image_3.svg';
import {useWalletConnectClient} from "../../contexts/walletConnect";
import {useDispatch, useSelector} from "react-redux";
import {ellipseAddress} from "../../helpers";
import {getAddressFromAccount} from "@walletconnect/utils";
import {IMerchant} from "../../models";
import {userAction} from "../../store/actions";
import {toast} from "react-toastify";
import {useHistory} from "react-router-dom";
import {selectMerchantInfo} from "../../store/selector";

/**
 * Example URL
 * http://localhost:3000/storefront/register
 *
 * @constructor
 */
const defaultMerchant: IMerchant = {
    defaultToken: "ETH", id: 0, memberENSAddress: "", orders: [],
    allowedUrl: "*", memberSecondaryAddress: "",testnet: true,
    memberAddress: '', merchantName: '', storeName: ''
};

export const RegisterMerchant = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const { accounts, merchantLogin } = useWalletConnectClient();

    const [ policy, setPolicy ] = useState(false)
    const [ merchant, setMerchant ] = useState<IMerchant>(defaultMerchant)

    const merchantInfo = useSelector(selectMerchantInfo);

    React.useEffect(() => {
        if (merchantInfo) {
            console.log(`merchant info available, replacing with profile`)
            merchantLogin.merchantExists = true;
            history.replace("/merchant/profile")
        }
    }, [merchantInfo, merchantLogin, history]);

    const getWalletAddress = (): string => {
        if (accounts && accounts.length > 0) {
            const first = accounts[0];
            let accountAddress = getAddressFromAccount(first!!)||"";
            console.log(`merchant Account ${first} add ${accountAddress}`)
            return accountAddress;
        }
        return ''
    }

    const handleChange = (event: any) => {
        if (event.target.name === "policy") {
            console.info(`setting policy ${event.target.value}`);
            setPolicy(event.target.value)
        } else if (event.target.name === "merchantName") {
            console.info(`setting name ${event.target.value}`);
            merchant.merchantName = event.target.value;
            setMerchant(merchant);
        } else if (event.target.name === "storeName") {
            console.info(`setting name ${event.target.value}`);
            merchant.storeName = event.target.value;
            setMerchant(merchant);
        }
    }

    const onRegister = () => {
        console.log(`register info `);
        toast.dismiss();

        merchant.memberAddress = getWalletAddress();
        setMerchant(merchant);

        if (!merchant?.merchantName) {
            toast("Invalid merchant name")
            return
        }

        if (!merchant?.memberAddress) {
            toast("Invalid merchant address")
            return
        }

        if (!merchant?.storeName) {
            toast("Invalid store name")
            return
        }

        if (!policy) {
            toast("You need to accept our privacy policy")
            return
        }

        console.log(`creating merchant ${merchant}`)
        merchant.memberAddress = getWalletAddress();
        setMerchant(merchant);


        dispatch(userAction.createMerchant(merchant, history));
    }

    React.useEffect(() => {
        getWalletAddress();
    }, [accounts, getWalletAddress]);



    return (
        <div className="h-screen w-screen flex twoColumnContainer">
            {/*Left Column*/}
            <div className="h-full w-full flex flex-col items-center justify-center  bg-white shadow-md">
                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center pt-10">
                        <img className="w-12 h-12" src={logoIcon} alt=""/>
                        <div className="w-full flex flex-col p-4">
                            <h1 className="text-xl font-righteous">Storefront Pay</h1>
                            <h1 className="text-sm ">Register as a Merchant</h1>
                        </div>
                    </div>
                    <div className="w-3/4 flex flex-col items-center justify-around py-4">
                        <div className="w-full flex flex-col p-4">
                            <p className="text-sm ">Merchant Name</p>
                            <input name="merchantName"  className="border-2 border-secondary rounded-16xl shadow-md px-4 py-2 my-2" type='text' onChange={handleChange}/>
                        </div>

                        <div className="w-full flex flex-col p-4">
                            <p className="text-sm ">Store Name</p>
                            <input name="storeName" className="border-2 border-secondary rounded-16xl shadow-md px-4 py-2 my-2" type='text' onChange={handleChange}/>
                        </div>

                        <div className="w-full flex flex-col p-4">
                            <p className="text-sm ">Wallet Address</p>
                            <input className="border-2 border-secondary rounded-16xl shadow-md px-4 py-2 my-2" type='text' readOnly={true} value={ellipseAddress(getWalletAddress())}/>
                        </div>
                        <div className="flex items-center justify-center mt-8">
                            <input className="mx-2" name="policy" type="checkbox" readOnly={true} value='true' onChange={handleChange}/>
                            <p className="font-montserrat text-center text-sm text-black">I agree to the <a className="font-bold font-righteous" href={'https://test.jxndao.com/storefront/merchant/privacy'}>privacy policy</a> </p>
                        </div>
                        <div className="w-full flex flex-col p-4">
                            <button onClick={onRegister} className="w-full flex bg-primary justify-center items-center rounded-10xl border border-solid border-t-2 border-slate-800 overflow-hidden">
                                <img className="w-8 h-8 mr-4" src={logoIcon} alt="" />
                                <p className="font-righteous text-white">Register</p>
                            </button>
                            <p className="font-montserrat text-center text-white mt-2 mb-10">Or connect directly with your Backpack</p>
                        </div>
                    </div>
                    <p className="mx-10 text-center text-sm mb-10">Check out our integrations <a className="font-bold font-righteous" href={'https://test.jxndao.com/storefront'}>Docs</a> to learn how to add a Pay button.</p>
                </div>
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
