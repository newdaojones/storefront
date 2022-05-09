import React, {useRef} from "react";
import {createPopper} from "@popperjs/core";
import menuIcon from '../../assets/images/profile.svg';

export const Dropdown = ({ onDisconnect = () => {}}) => {
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
    return (
            <div className="flex flex-col">
                <div className="w-full sm:w-6/12 md:w-4/12 px-4">
                    <div className="relative flex align-middle w-full">
                        <img
                            className={
                                "text-white w-10 h-10 font-bold uppercase text-sm rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 cursor-pointer"
                            }
                            src={menuIcon} alt="bla"
                            ref={btnDropdownRef}
                            onClick={() => {
                                dropdownPopoverShow
                                    ? closeDropdownPopover()
                                    : openDropdownPopover();
                            }}
                        >

                        </img>
                        {/*<img className="w-10 h-10 z-10" src={menuIcon} alt="bla"/>*/}
                        <div
                            ref={popoverRef}
                            className={
                                (dropdownPopoverShow ? "block " : "hidden ") +
                                (color === "white" ? "bg-white " : "" + " ") +
                                "text-base z-10 py-2 list-none rounded shadow-lg mt-1"
                            }
                            style={{ minWidth: "12rem" }}
                        >
                            <a
                                href="#"
                                className={
                                    "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent " +
                                    (color === "white" ? " text-slate-700" : "text-white")
                                }
                                onClick={e => e.preventDefault()}
                            >
                                List Orders
                            </a>
                            <a
                                href="#disconnect"
                                className={
                                    "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent " +
                                    (color === "white" ? " text-slate-700" : "text-white")
                                }
                                onClick={onDisconnect}
                            >
                                Disconnect
                            </a>
                            <div className="h-0 my-2 border border-solid border-t-0 border-slate-800 opacity-25" />
                            <a
                                href="#pablo"
                                className={
                                    "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent " +
                                    (color === "white" ? " text-slate-700" : "text-white")
                                }
                                onClick={e => e.preventDefault()}
                            >
                                About
                            </a>
                        </div>
                    </div>
                </div>
            </div>
    );
};

// export const DropdownRender = ({onDisconnect: any}) => {
//     return (
//             <Dropdown onDisconnect={onDisconnect}/>
//     );
// }
