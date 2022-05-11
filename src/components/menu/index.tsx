import React, {useState} from 'react';

import menuIcon from '../../assets/images/menu_icon.svg';
import {IMenuItem} from '../../models';
import {Dropdown} from "./dropdown";
import {getDisplayName} from "../../utils";
import {useHistory} from "react-router-dom";

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
      const history = useHistory()
      const name = getDisplayName(account, ensName)
      const onPaymentsClick = () => {
      }
      const onHomeClicked = () => {
          history.replace("/profile")
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
            <div className="flex items-center justify-between mh-4 mt-2">
              <img className="h-16 w-16 ml-4" src={menuIcon} alt="" draggable={false} onClick={onHomeClicked} />
              <div className="flex flex-col justify-between ml-2">
                <p className="text-white text-sm">Ruth’s Alternative Caring</p>
                <p className="font-righteous text-white text-xl">Storefront</p>
              </div>
            </div>
              {/*right*/}
              <div className="flex items-center">
                <div className="flex flex-col items-end justify-end">
                    {!disabled && !account && <p className="text-white text-sm mr-4">
                        {status}
                    </p>}
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
