import React from 'react';

export const MenuLine = ({ size = 493 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 493 493" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M31.9405 360.054C-30.8655 241.557 14.2814 94.5811 132.779 31.7751C251.276 -31.0309 398.252 14.1159 461.058 132.613C523.864 251.111 478.717 398.087 360.22 460.893C241.722 523.699 94.7465 478.552 31.9405 360.054Z"
      stroke="url(#paint0_linear_2586_15606)"
      strokeWidth={(6 * 493) / size}
    />
    <defs>
      <linearGradient id="paint0_linear_2586_15606" x1="458.227" y1="120.865" x2="23.8076" y2="351.116" gradientUnits="userSpaceOnUse">
        <stop stopColor="#13053D" />
        <stop offset="0.25049" stopColor="#FF00C7" />
        <stop offset="0.510417" stopColor="#7E18FF" />
        <stop offset="0.767495" stopColor="#61FFB3" />
        <stop offset="1" stopColor="#13053D" />
      </linearGradient>
    </defs>
  </svg>
);
