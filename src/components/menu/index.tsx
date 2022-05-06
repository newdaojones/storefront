import React, { useEffect, useState } from 'react';

import meneIcon from '../../assets/images/menu_icon.png';
import { MenuItem } from './menu';
import { IMenuItem } from '../../models';
import { chainData } from '../../consts';

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

export const Menu = ({
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

  // const onKeydown = (e: KeyboardEvent) => {
  //   if (disabled) {
  //     return;
  //   }
  //
  //   if (e.code === 'KeyQ' && e.ctrlKey) {
  //     e.preventDefault();
  //     //onDisconnect();
  //   }
  //
  //   if (e.code === 'Enter' && e.shiftKey) {
  //     return setFocused(true);
  //   }
  //
  //   if (e.code === 'Enter') {
  //     return setFocused(false);
  //   }
  //
  //   if (e.code === 'KeyS' && e.ctrlKey) {
  //     return onSelectAccount();
  //   }
  // };

  let name = '';
  if (ensName) {
    name = ensName;
  } else if (account) {
    const [namespace, reference, address] = account.split(':');

    if (chainData[namespace] && chainData[namespace][reference]) {
      const chainMeta = chainData[namespace][reference];
      const lenght = address.length
      name = `${chainMeta.symbol.toLowerCase()}: ${address.slice(0, 6)}...${address.slice(lenght - 4, lenght)}`;
    }
  }


  const onPaymentsClick = () => {
  }

  const onDisconnectClicked = () => {
    console.info(`disconnecting from wc`)
    onDisconnect()
  }

  return (
    <div>
      <div
        className="flex items-center justify-between mh-4"
        style={{
          width: '100%',
          minWidth: size,
          position: 'relative',
        }}
      >
        <img className="h-20 w-20 ml-4" src={meneIcon} alt="" draggable={false} />

        {/*right*/}
        <div className="flex">
          <div className="flex flex-col items-end justify-end">
            <p className="text-white mr-4">
              {status}
            </p>
            {!disabled && name && <p className="text-white mr-4">{name}</p>}
          </div>
          {
            !disabled && name &&
            <select className="select w-10 h-10 mr-4" name="fff" value="f">
              <option className="option pt-4 pb-4" value="payments" onClick={onPaymentsClick}>Payments</option>
              <option className="option pa-4" onClick={onDisconnectClicked} value="disconnect">Disconnect</option>
            </select>
          }

        </div>
      </div>
    </div>
  );
};
