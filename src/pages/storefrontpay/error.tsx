import React, {useState} from 'react';
import logoIcon from '../../assets/images/logo.svg';
import promo1 from '../../assets/images/promo_image_1.svg';
import promo2 from '../../assets/images/promo_image_2.svg';
import promo3 from '../../assets/images/promo_image_3.svg';

export const ErrorPage = () => {
    return (
        <div className="h-screen w-screen flex twoColumnContainer">
            {/*Left Column*/}
            <div className="w-full overflow-scroll flex items-center justify-around flex-col bg-white shadow-md  py-10">
                <div className="flex items-center justify-center ">
                    <img className="w-12 h-12" src={logoIcon} alt=""/>
                    <div className="w-full flex flex-col p-4">
                        <h1 className="text-xl font-righteous">Storefront Pay</h1>
                        <h1 className="text-sm ">testnet</h1>
                    </div>
                </div>


                <div className="w-3/4 flex justify-around py-4">
                <div className="flex flex-col p-4">
                    <p className="text-sm">error</p>
                    <p className="font-bold text-xl">Something went wrong</p>
                </div>
                </div>
            </div>

            {/*Right Column*/}
            <div className="w-full h-full flex items-center justify-center flex-col py-10">
                <div id="qrcode2" className="flex items-center justify-center rounded-10xl overflow-hidden m-10 qrcode">
                    <img className="w-16 h-16" src={logoIcon} alt=""/>
                </div>
                <h1 className="text-white text-xl text-center font-bold mx-40 ">Accept Crypto Payments and Drive Incremental Sales Now!</h1>

                <img className="w-16 h-16 mt-4" src={promo1} alt=""/>
                <p className="text-white font-bold mt-4">Reach Millions of Users</p>
                <p className="text-white text-center text-sm mt-4 mx-40">Access to millions of users using wallet apps, and capitalise on the world's largest adoption rate. </p>

                <img className="w-16 h-16 mt-10" src={promo2} alt=""/>
                <p className="text-white font-bold mt-4">Lowest Cost</p>
                <p className="text-white text-center text-sm mt-4 mx-40">Pay zero transactions fees and save up to 85% on settlement fees. </p>

                <img className="w-16 h-16 mt-10" src={promo3} alt=""/>
                <p className="text-white font-bold mt-4">Easy Integration</p>
                <p className="text-white text-center text-sm mt-4 mx-40">Integrate with a few clicks using our SDK or plugins. No coding experience needed. </p>
            </div>
        </div>
    );
};
