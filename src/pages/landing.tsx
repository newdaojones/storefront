import React from 'react';

export const Landing = () => (
  <div className="flex flex-col items-center direction-column text-center justify-center h-full w-full">
    <div className="w-20 h-20">
        <div className="thecube w-20 h-20 m-1">
            <div className="cube c1"></div>
            <div className="cube c2"></div>
            <div className="cube c4"></div>
            <div className="cube c3"></div>
        </div>
    </div>
    <p className="mt-10 text-white text-sm">Loading...</p>
  </div>
);
