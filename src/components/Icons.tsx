import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const Icons = {
  BackArrow({ size = 24, className, ...props }: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        <path d="M19 12H5M5 12l6-6M5 12l6 6" />
      </svg>
    );
  },

  Coin({ size = 24, className, ...props }: IconProps) {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        {...props}
      >
        <defs>
          <radialGradient id="coinGold" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFE7A8" />
            <stop offset="60%" stopColor="#FFC23C" />
            <stop offset="100%" stopColor="#C7860B" />
          </radialGradient>
        </defs>
        {/* Outer 3D Rim shadow */}
        <circle cx="16" cy="16.5" r="14" fill="#1F2540" />
        {/* Outer Main Bevel */}
        <circle cx="16" cy="16" r="14" fill="url(#coinGold)" stroke="#1F2540" strokeWidth="2.5" />
        {/* Inner raised rim border */}
        <circle cx="16" cy="16" r="10.5" fill="none" stroke="#1F2540" strokeWidth="1.5" strokeDasharray="none" />
        {/* Center Cute Star */}
        <path
          d="M16 9.5l1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z"
          fill="#FFE7A8"
          stroke="#1F2540"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  },

  Passport({ size = 24, className, ...props }: IconProps) {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        {...props}
      >
        {/* Base shadow */}
        <rect x="4" y="5.5" width="24" height="22" rx="4.5" fill="#1F2540" />
        {/* Booklet Cover */}
        <rect
          x="4"
          y="4.5"
          width="24"
          height="22"
          rx="4.5"
          fill="#3FB6FF"
          stroke="#1F2540"
          strokeWidth="2.5"
        />
        {/* Left binding spine */}
        <path
          d="M4 4.5h6v22H4a4.5 4.5 0 01-4.5-4.5v-13A4.5 4.5 0 014 4.5z"
          fill="#1F7FD6"
          stroke="#1F2540"
          strokeWidth="2.5"
          clipPath="url(#spineClip)"
        />
        {/* Decorative Golden Globe */}
        <circle cx="18" cy="15.5" r="5" fill="none" stroke="#FFE7A8" strokeWidth="1.8" />
        <path
          d="M18 10.5v10M13 15.5h10M14.2 12.5c1.2 1 1.2 5 0 6M21.8 12.5c-1.2 1-1.2 5 0 6"
          fill="none"
          stroke="#FFE7A8"
          strokeWidth="1.2"
        />
        {/* Cute pink heart stamp in bottom right */}
        <path
          d="M21.5 22.8c-.8-.8-2-.5-2 .5 0 .8.8 1.4 1.5 2 .2.2.8.2 1 0 .7-.6 1.5-1.2 1.5-2 0-1-1.2-1.3-2-.5z"
          fill="#FF6FA3"
          stroke="#1F2540"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  },

  Gear({ size = 24, className, ...props }: IconProps) {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        {...props}
      >
        {/* Shadow */}
        <path
          d="M16 7a2 2 0 012-2h0a2 2 0 012 2v1.5a1 1 0 001.7.7l1.1-1.1a2 2 0 012.8 0h0a2 2 0 010 2.8l-1.1 1.1a1 1 0 00.7 1.7h1.5a2 2 0 012 2h0a2 2 0 01-2 2h-1.5a1 1 0 00-.7 1.7l1.1 1.1a2 2 0 010 2.8h0a2 2 0 01-2.8 0l-1.1-1.1a1 1 0 00-1.7.7V25a2 2 0 01-2 2h0a2 2 0 01-2-2v-1.5a1 1 0 00-1.7-.7l-1.1 1.1a2 2 0 01-2.8 0h0a2 2 0 010-2.8l1.1-1.1a1 1 0 00-.7-1.7H7a2 2 0 01-2-2h0a2 2 0 012-2h1.5a1 1 0 00.7-1.7L8.1 11a2 2 0 010-2.8h0a2 2 0 012.8 0l1.1 1.1A1 1 0 0014 8.5V7z"
          fill="#1F2540"
        />
        {/* Main Gear teeth */}
        <path
          d="M16 6a2 2 0 012-2h0a2 2 0 012 2v1.5a1 1 0 001.7.7l1.1-1.1a2 2 0 012.8 0h0a2 2 0 010 2.8l-1.1 1.1a1 1 0 00.7 1.7h1.5a2 2 0 012 2h0a2 2 0 01-2 2h-1.5a1 1 0 00-.7 1.7l1.1 1.1a2 2 0 010 2.8h0a2 2 0 01-2.8 0l-1.1-1.1a1 1 0 00-1.7.7V24a2 2 0 01-2 2h0a2 2 0 01-2-2v-1.5a1 1 0 00-1.7-.7l-1.1 1.1a2 2 0 01-2.8 0h0a2 2 0 010-2.8l1.1-1.1a1 1 0 00-.7-1.7H6a2 2 0 01-2-2h0a2 2 0 012-2h1.5a1 1 0 00.7-1.7L7.1 10a2 2 0 010-2.8h0a2 2 0 012.8 0l1.1 1.1A1 1 0 0014 7.5V6z"
          fill="#3DD58A"
          stroke="#1F2540"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Center hub */}
        <circle cx="16" cy="15" r="4.5" fill="#FFF8EE" stroke="#1F2540" strokeWidth="2.2" />
        <circle cx="16" cy="15" r="1.5" fill="#1F2540" />
      </svg>
    );
  },

  VolumeUp({ size = 24, className, ...props }: IconProps) {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        {...props}
      >
        {/* Shadow */}
        <path
          d="M6 11.5h4.2l5.3-5.3a1 1 0 011.5.7v18.2a1 1 0 01-1.5.7l-5.3-5.3H6a2 2 0 01-2-2v-5a2 2 0 012-2z"
          fill="#1F2540"
        />
        {/* Megaphone speaker */}
        <path
          d="M6 10.5h4.2l5.3-5.3a1 1 0 011.5.7v18.2a1 1 0 01-1.5.7l-5.3-5.3H6a2 2 0 01-2-2v-5a2 2 0 012-2z"
          fill="#FF6FA3"
          stroke="#1F2540"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Sound Waves */}
        <path
          d="M21 11c1.5 2 1.5 6 0 8M25 7c3 4 3 12 0 16"
          stroke="#1F2540"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  },

  VolumeMute({ size = 24, className, ...props }: IconProps) {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        {...props}
      >
        {/* Shadow */}
        <path
          d="M6 11.5h4.2l5.3-5.3a1 1 0 011.5.7v18.2a1 1 0 01-1.5.7l-5.3-5.3H6a2 2 0 01-2-2v-5a2 2 0 012-2z"
          fill="#1F2540"
        />
        {/* Megaphone speaker */}
        <path
          d="M6 10.5h4.2l5.3-5.3a1 1 0 011.5.7v18.2a1 1 0 01-1.5.7l-5.3-5.3H6a2 2 0 01-2-2v-5a2 2 0 012-2z"
          fill="#FF6FA3"
          stroke="#1F2540"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Red/Ink 'X' mute sign */}
        <path
          d="M21.5 11.5l6 6M27.5 11.5l-6 6"
          stroke="#1F2540"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M21.5 11.5l6 6M27.5 11.5l-6 6"
          stroke="#FF6FA3"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  },

  Flask({ size = 24, className, ...props }: IconProps) {
    return (
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className={className}
        {...props}
      >
        {/* Beaker neck shadow */}
        <rect x="13" y="4.5" width="6" height="8" rx="1" fill="#1F2540" />
        {/* Beaker body shadow */}
        <path
          d="M13 12.5L6 25.5a2 2 0 001.7 3h16.6a2 2 0 001.7-3L19 12.5h-6z"
          fill="#1F2540"
        />
        
        {/* Beaker Glass container */}
        <rect
          x="13"
          y="3.5"
          width="6"
          height="8"
          rx="1"
          fill="white"
          stroke="#1F2540"
          strokeWidth="2.5"
        />
        <path
          d="M13 11.5L6 24.5a2 2 0 001.7 3h16.6a2 2 0 001.7-3L19 11.5h-6z"
          fill="white"
          stroke="#1F2540"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        
        {/* Mint-Green bubbling liquid */}
        <path
          d="M8.2 24.5l2.2-4.5h11.2l2.2 4.5a1 1 0 01-.9 1.5H9.1a1 1 0 01-.9-1.5z"
          fill="#3DD58A"
          stroke="#1F2540"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Bubbles */}
        <circle cx="13" cy="22" r="1.2" fill="#C8F5DD" />
        <circle cx="19" cy="23" r="1.6" fill="#C8F5DD" />
        <circle cx="16" cy="18" r="1" fill="#C8F5DD" />
      </svg>
    );
  },
};
