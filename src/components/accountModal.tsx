import React from 'react';
import Modal from 'react-modal';
import { chainData } from '../consts/chains';
import { ellipseAddress } from '../helpers';

export const AccountModal = ({
  accounts,
  account = '',
  open,
  onClose,
  onSelect,
}: {
  accounts: string[];
  account?: string;
  open: boolean;
  onClose: () => void;
  onSelect: (account: string) => void;
}) => {
  return (
    <Modal
      onRequestClose={onClose}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      }}
      isOpen={open}
    >
      <h2 className="mb-4">Select Wallet</h2>
      {accounts.map(item => {
        const [namespace, reference, address] = item.split(':');
        if (!chainData[namespace] || !chainData[namespace][reference]) {
          return <></>;
        }
        const data = chainData[namespace][reference];
        const disabled = namespace === 'solana'; // disable solana for now

        return (
          <div
            key={item}
            onClick={() => onSelect(item)}
            className="flex items-center mt-2 mb-2 border-2 p-2 rounded-xl cursor-pointer"
            style={{
              borderColor: `rgb(${data.rgb})`,
              boxShadow: account === item ? `0 0 10px rgb(${data.rgb})` : 'none',
              backgroundColor: disabled ? `rgba(0,0,0,.3)` : 'transparent',
            }}
          >
            <img className="w-10 h-10 rounded-full mr-2" src={data.logo} alt={namespace} />
            <div>
              <p>{data.name}</p>
              <p>{ellipseAddress(address)}</p>
            </div>
          </div>
        );
      })}
    </Modal>
  );
};
