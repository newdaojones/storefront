import React, {useRef} from "react";
import {createPopper, flip, preventOverflow} from "@popperjs/core";

const Dropdown = () => {
    const btnDropdownRef = useRef<HTMLButtonElement>(null);
    const popoverDropdownRef = useRef<HTMLButtonElement>(null);
    const color = 'white';
    // dropdown props
    const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
    // const btnDropdownRef = React.createRef();
    // const popoverDropdownRef = React.createRef();
    const openDropdownPopover = () => {
        if (btnDropdownRef.current) {
            createPopper(btnDropdownRef.current, popoverDropdownRef.current!!, {
                modifiers: [preventOverflow],
                placement: "bottom",
                strategy: "fixed",
            });
            setDropdownPopoverShow(true);
        }

    };
    const closeDropdownPopover = () => {
        setDropdownPopoverShow(false);
    };
    // bg colors
    let bgColor;
    color === "white"
        ? (bgColor = "bg-slate-700")
        : (bgColor = "bg-" + color + "-500");
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full sm:w-6/12 md:w-4/12 px-4">
                    <div className="relative inline-flex align-middle w-full">
                        <button
                            className={
                                "text-white h-20 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 " +
                                bgColor
                            }
                            type="button"
                            ref={btnDropdownRef}
                            onClick={() => {
                                dropdownPopoverShow
                                    ? closeDropdownPopover()
                                    : openDropdownPopover();
                            }}
                        >
                            {color === "white" ? "White Dropdown" : color + " Dropdown"}
                        </button>
                        <div
                            className={
                                (dropdownPopoverShow ? "block " : "hidden ") +
                                (color === "white" ? "bg-white " : bgColor + " ") +
                                "text-base z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1"
                            }
                            style={{ minWidth: "12rem" }}
                        >
                            <a
                                href="#action1"
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
                                onClick={e => e.preventDefault()}
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
        </>
    );
};

export default function DropdownRender() {
    return (
            <Dropdown />
    );
}
