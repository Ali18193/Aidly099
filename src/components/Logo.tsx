import React from 'react';

export const Logo = ({ className, size = 40 }: { className?: string, size?: number }) => (
  <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
      <defs>
        <linearGradient id="logo_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D4C8" />
          <stop offset="100%" stopColor="#00A89F" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="28" fill="url(#logo_grad)" />
      <path d="M50 25C35 25 25 35 25 50C25 65 35 75 50 75C65 75 75 65 75 50C75 35 65 25 50 25Z" fill="white" fillOpacity="0.1" />
      <path d="M50 42C50 42 47 38 42 38C37 38 34 42 34 47C34 55 50 65 50 65C50 65 66 55 66 47C66 42 63 38 58 38C53 38 50 42 50 42Z" fill="white" fillOpacity="0.3" />
      <circle cx="35" cy="40" r="2" fill="white" />
      <circle cx="65" cy="40" r="2" fill="white" />
      <circle cx="50" cy="50" r="3" fill="white" />
      <path d="M35 40L50 50L65 40" stroke="white" strokeWidth="1" strokeOpacity="0.4" />
    </svg>
  </div>
);
