import React from 'react';

import ArrowLeftIcon from '../assets/images/arrowLeft.svg';
import ArrowRightIcon from '../assets/images/arrowRight.svg';
import PlusIcon from '../assets/images/plus.svg';

export const Landing = () => (
  <div className="flex flex-col items-center direction-column text-center justify-center h-full w-full">
    <div className="mb-10">
      <p className="text-white flex items-center justify-center">
        use <img className="w-6 h-6 rounded p-1 bg-white ml-2 mr-2" src={ArrowLeftIcon} alt="" />
        <img className="w-6 h-6 rounded p-1 bg-white" src={ArrowRightIcon} alt="" />
      </p>
      <p className="text-white">to rotate the Menu Collection</p>
    </div>
    <div className="mb-10">
      <p className="text-white">
        smash <span className="bg-white p-1 ml-2 rounded text-primary font-bold">enter</span>
      </p>
      <p className="text-white">to jump into a Collection</p>
    </div>
    <div className="mb-10">
      <p className="text-white flex items-center justify-center">
        hit <span className="bg-white ml-2 rounded pl-1 pr-1 text-primary font-bold">shift</span>
        <img className="w-6 h-6 rounded ml-2 mr-2" src={PlusIcon} alt="" />
        <span className="bg-white pl-1 pr-1 rounded text-primary font-bold">enter</span>
      </p>
      <p className="text-white">to jump back to Menu</p>
    </div>
    <div className="mb-10">
      <p className="text-white flex items-center justify-center">
        hit <span className="bg-white ml-2 rounded pl-1 pr-1 text-primary font-bold">ctl</span>
        <img className="w-6 h-6 rounded ml-2 mr-2" src={PlusIcon} alt="" />
        <span className="bg-white pl-1 pr-1 rounded text-primary font-bold">q</span>
      </p>
      <p className="text-white">
        to disconnect wallet
        <br />
        (you’ll get a confirmation first)
      </p>
    </div>
    <div className="mb-10">
      <p className="text-white flex items-center justify-center">
        hit <span className="bg-white ml-2 rounded pl-1 pr-1 text-primary font-bold">ctl</span>
        <img className="w-6 h-6 rounded ml-2 mr-2" src={PlusIcon} alt="" />
        <span className="bg-white pl-1 pr-1 rounded text-primary font-bold">s</span>
      </p>
      <p className="text-white">
        to switch wallet
        <br />
        (you’ll get a popup)
      </p>
    </div>
  </div>
);
