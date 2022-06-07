import React, {useRef} from "react";
import {createPopper} from "@popperjs/core";
import menuIcon from '../../assets/images/menu.svg';
import {getConnectionStatusDisplay, getDisplayName} from "../../utils";

interface Props {
    onDisconnect?: () => void;
    onPayments?: () => void;
    connectionStatus: string;
    account: string;
    ensName: string | null;
}

export const Dropdown = ({ onDisconnect = () => {}, onPayments = () => {}, connectionStatus, account, ensName = null}: Props) => {
    const btnDropdownRef = useRef<HTMLImageElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const color = 'white';
    const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
    const openDropdownPopover = () => {
        if (btnDropdownRef.current && popoverRef.current) {
            createPopper(btnDropdownRef.current, popoverRef.current, {
                placement: "bottom",
            });
            setDropdownPopoverShow(true);
        }

    };
    const closeDropdownPopover = () => {
        setDropdownPopoverShow(false);
    };
    const name = getDisplayName(account, ensName)

    return (
            <div className="flex flex-col">
                <div className="w-full sm:w-6/12 md:w-4/12 px-4 min-w-max">
                    <div className="relative flex align-middle w-full">
                        <img
                            className="text-white w-10 h-10 font-bold uppercase text-sm shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 cursor-pointer"

                            src={menuIcon} alt=""
                            ref={btnDropdownRef}
                            onClick={() => {
                                dropdownPopoverShow
                                    ? closeDropdownPopover()
                                    : openDropdownPopover();
                            }}
                        >

                        </img>
                        <div
                            ref={popoverRef}
                            className={
                                (dropdownPopoverShow ? "block " : "hidden ") +
                                (color === "white" ? "bg-white " : "") +
                                "text-base z-10 py-2 list-none rounded shadow-lg mt-1"
                            }
                            style={{ minWidth: "12rem" }}
                        >
                            <a
                                href="/orders"
                                className={
                                    "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent " +
                                    (color === "white" ? " text-slate-700" : "text-white")
                                }
                                onClick={onPayments}
                            >
                                List Orders
                            </a>
                            <p
                                className={
                                    "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent cursor-pointer" +
                                    (color === "white" ? " text-slate-700" : "text-white")
                                }
                                onClick={onDisconnect}
                            >
                                Disconnect
                            </p>
                            <div className="h-0 my-2 border border-solid border-t-0 border-slate-800 opacity-25" />
                            <div
                                className={
                                    "text-xs py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent " +
                                    (color === "white" ? " text-slate-700" : "text-white")
                                }
                            >
                                {getConnectionStatusDisplay(account)}
                            </div>
                            <div
                                className={
                                    "text-xs py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent " +
                                    (color === "white" ? " text-slate-700" : "text-white")
                                }
                            >
                                {name}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
};
