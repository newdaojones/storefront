import React, { useEffect, useState } from 'react';

import meneIcon from '../../../assets/images/menu_icon.png';
import { MenuItem } from './menu';
import { IMenuItem } from '../../../models';
import { chainData } from '../../../consts';

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
        <div>
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
                <div className="mt-20 flex flex-col items-center">
                    <div>
                        <div>
                            <p className="text-white">
                                use <span className="font-bold">{'<- -> ARROW'}</span>
                            </p>
                            <p className="text-white">to rotate collection menu</p>
                        </div>
                        <div className="mt-4">
                            <p className="text-white">
                                tap <span className="font-bold">ENTER</span>
                            </p>
                            <p className="text-white">to open a collection</p>
                        </div>
                        <div className="mt-4">
                            <p className="text-white">
                                hit <span className="font-bold">SHIFT + ENTER</span>
                            </p>
                            <p className="text-white">to return to the menu</p>
                        </div>
                        <div className="mt-4">
                            <p className="text-white">
                                hit <span className="font-bold">CTL + S</span>
                            </p>
                            <p className="text-white">to switch wallet</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
