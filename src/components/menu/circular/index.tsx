import React, { useEffect, useState } from 'react';

import meneIcon from '../../../assets/images/menu_icon.png';
import { MenuItem } from './menu';
import { IMenuItem } from '../../../models';
import { chainData } from '../../../consts';
import menuBackground from "../../../assets/images/background/menu_background.svg";

interface Props {
    size: number;
    onDisconnect?: () => void;
    onSelectAccount?: () => void;
    items: IMenuItem[];
    disabled?: boolean;
    status: string;
    ensName?: string;
    account?: string;
}

export const OrbitalMenu = ({
                         size,
                         onDisconnect = () => {},
                         onSelectAccount = () => {},
                         items,
                         disabled = false,
                         status,
                         ensName = '',
                         account = '',
                     }: Props) => {
    const [focused, setFocused] = useState(true);

    const onKeydown = (e: KeyboardEvent) => {
        if (disabled) {
            return;
        }

        if (e.code === 'KeyQ' && e.ctrlKey) {
            e.preventDefault();
            onDisconnect();
        }

        if (e.code === 'Enter' && e.shiftKey) {
            return setFocused(true);
        }

        if (e.code === 'Enter') {
            return setFocused(false);
        }

        if (e.code === 'KeyS' && e.ctrlKey) {
            return onSelectAccount();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', onKeydown);
        return () => window.removeEventListener('keydown', onKeydown);
    }, [focused, disabled, onKeydown]);

    let name = '';
    if (ensName) {
        name = ensName;
    } else if (account) {
        const [namespace, reference, address] = account.split(':');

        if (chainData[namespace] && chainData[namespace][reference]) {
            const chainMeta = chainData[namespace][reference];
            name = `${chainMeta.symbol}: ${address.slice(0, 5)}...`;
        }
    }

    return (
        <div className="">
            <div
                className="flex items-center justify-center mr-8"
                style={{
                    marginLeft: -size / 3,
                    marginTop: -size / 3 - 40,
                    width: size,
                    minWidth: size,
                    height: size,
                    minHeight: size,
                    position: 'relative',
                }}
            >
                <img className="h-full w-full" src={meneIcon} alt="" draggable={false} />
                {/*<div className="absolute z-10">*/}
                {/*    <p className="text-white mt-12 ml-4">*/}
                {/*        {status}*/}
                {/*        {!disabled && name ? ' as' : ''}*/}
                {/*    </p>*/}
                {/*    {!disabled && name && <p className="text-white font-bold ml-4 z-10">{name}</p>}*/}
                {/*</div>*/}
                <MenuItem onFocused={() => setFocused(true)} zIndex={0} items={items} size={size + 50} disabled={disabled} focused={focused} />
            </div>

            {!disabled && (
                <div className="mx-10 mt-40 flex flex-col items-center text-black text-sm border-1 border-secondary rounded-10xl shadow-md py-4">

                    <p className="w-full ml-20">
                        <span className="">{'shortcuts'}</span>
                    </p>
                    <hr className="w-full h-4p mt-4 bg-secondary"/>
                    <div>
                        <div>
                            <p className="mt-4">
                                use <span className="font-bold">{'<- -> ARROW'}</span>
                            </p>
                            <p className="">to rotate collection menu</p>
                        </div>
                        <div className="mt-4">
                            <p className="">
                                tap <span className="font-bold">ENTER</span>
                            </p>
                            <p className="">to open a collection</p>
                        </div>
                        <div className="mt-4">
                            <p className="">
                                hit <span className="font-bold">SHIFT + ENTER</span>
                            </p>
                            <p className="">to return to the menu</p>
                        </div>
                        {/*<div className="mt-4">*/}
                        {/*    <p className="">*/}
                        {/*        hit <span className="font-bold">CTL + S</span>*/}
                        {/*    </p>*/}
                        {/*    <p className="">to switch wallet</p>*/}
                        {/*</div>*/}
                    </div>
                </div>
            )}
        </div>
    );
};
