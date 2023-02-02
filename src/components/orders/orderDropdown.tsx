import React, {RefObject, useRef} from "react";
import {createPopper} from "@popperjs/core";
import menuIcon from '../../assets/images/pending_black.svg';

interface Props {
    transactionConfirmed: boolean;
    popoverRefElement: RefObject<HTMLDivElement>;
    onRevistLink?: () => void;
    onResendSMS?: () => void;
    onBlockExplorer: () => void;
    onCopyHash: () => void;
    onCancel: () => void;
}

export const OrderDropdown = ({ popoverRefElement, transactionConfirmed, onRevistLink = () => {}, onResendSMS = () => {}, onBlockExplorer = () => {}, onCopyHash = () => {}, onCancel = () => {}}: Props) => {
    const btnDropdownRef = useRef<HTMLImageElement>(null);
    // const popoverRef = useRef<HTMLDivElement>(popoverRefElement);
    const popoverRef = popoverRefElement;
    const color = 'white';
    const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
    const openDropdownPopover = () => {
        if (btnDropdownRef.current && popoverRef.current) {
            createPopper(btnDropdownRef.current, popoverRef.current, {
                placement: "right",
            });
            setDropdownPopoverShow(true);
        }

    };
    const closeDropdownPopover = () => {
        setDropdownPopoverShow(false);
    };
    const revistLink = () => {
        setDropdownPopoverShow(false);
        onRevistLink();
    }
    const resendSMS = () => {
        setDropdownPopoverShow(false);
        onResendSMS();
    }
    const blockExplorer = () => {
        setDropdownPopoverShow(false);
        onBlockExplorer();
    }
    const copyHash = () => {
        setDropdownPopoverShow(false);
        onCopyHash();
    }
    return (
            <div className="flex flex-col z-10">
                <div className="w-full sm:w-6/12 md:w-4/12 px-4 min-w-max">
                    <div className="relative flex align-middle w-full">
                        <img
                            className="w-8 h-8 font-bold uppercase text-sm hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 cursor-pointer"
                            src={menuIcon} alt=""
                            ref={btnDropdownRef}
                            onClick={() => {
                                dropdownPopoverShow
                                    ? closeDropdownPopover()
                                    : openDropdownPopover();
                            }}
                        />
                        <div
                            ref={popoverRef}
                            className={
                                (dropdownPopoverShow ? "block " : "hidden ") +
                                (color === "white" ? "bg-white " : "") +
                                "text-base z-10 py-2 list-none rounded shadow-lg mt-1"
                            }
                            style={{ minWidth: "12rem" }}
                        >
                            <p
                                className={
                                    "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent cursor-pointer" +
                                    (color === "white" ? " text-slate-700" : "text-white")
                                }
                                onClick={revistLink}
                            >
                                Re-visit Order
                            </p>
                            <div
                                className={
                                    "text-xs py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent " +
                                    (transactionConfirmed ? " text-slate-700 cursor-pointer" : "text-greyedOut")
                                }
                                onClick={transactionConfirmed ? resendSMS : () => {}}
                            >
                                Re-Send Order
                            </div>
                            <div
                                className={
                                    "text-xs py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent " +
                                    (transactionConfirmed ? " text-slate-700 cursor-pointer" : "text-greyedOut")
                                }
                                onClick={transactionConfirmed ? blockExplorer : () => {}}
                            >
                                View on Block Explorer
                            </div>

                            <div
                                className={
                                    "text-xs py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent " +
                                    (transactionConfirmed ? " text-slate-700 cursor-pointer" : "text-greyedOut")
                                }
                                onClick={transactionConfirmed ? copyHash : () => {}}
                            >
                                Copy Hash
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
};
