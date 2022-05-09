import React, {useState} from 'react';

import meneIcon from '../../assets/images/menu_icon.png';
import {IMenuItem} from '../../models';
import {Dropdown} from "./dropdown";
import {getDisplayName} from "../../utils";

export const Menu = ({
                       size,
                       onDisconnect = () => {},
                       onSelectAccount = () => {},
                       items,
                       disabled = false,
                       status,
                       ensName = null,
                       account = '',
                     }: Props) => {
      const [focused, setFocused] = useState(true);

      const name = getDisplayName(account, ensName)
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
              <div className="flex items-center">
                <div className="flex flex-col items-end justify-end">
                  <p className="text-white mr-2">
                    {status}
                  </p>
                  {!disabled && !account && name && <p className="text-white mr-2">{name}</p>}
                </div>
                  {
                      !disabled && name && <Dropdown
                          onDisconnect={onDisconnect}
                          connectionStatus={status}
                          account={account}
                          ensName={ensName}
                      />
                  }
              </div>

            </div>

          </div>

    );
    }
;

interface Props {
  size: number;
  onDisconnect?: () => void;
  onSelectAccount?: () => void;
  items: IMenuItem[];
  disabled?: boolean;
  status: string;
  ensName: string | null;
  account?: string;
}
