// app/my-name-is/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';

// A simple component for our progress bar
const ProgressBar = ({ step, totalSteps }: { step: number; totalSteps: number }) => {
  const progressPercentage = (step / totalSteps) * 100;

  return (
    <div className="w-80 h-1 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-[#FD297B] to-[#FF5864] transition-all duration-300 ease-in-out"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
};

export default function MyNameIsPage() {
  const [name, setName] = useState('');

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-white px-8">
      {/* Back Arrow */}
      <div className="absolute left-4 top-4 text-2xl text-gray-400">
        ←
      </div>

      <div className="flex w-full flex-col items-center m-1">
        {/* Progress Bar */}
        <div className="mt-12 mb-8">
          <ProgressBar step={1} totalSteps={5} /> {/* Assuming 5 steps for profile creation */}
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800">My first name is</h1>

        <div className="mt-8 flex w-80 flex-col items-center">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-b border-gray-300 bg-white text-lg font-light text-gray-800 placeholder-gray-400 focus:outline-none"
          />
          
          <p className="mt-4 text-xs text-gray-400 text-center">
            This is how it will appear in Tinder and you will not be able to change it.
          </p>
        </div>
      </div>
      
      {/* Continue Button */}
      <div className="mt-10 w-64">
        <Link href="/my-birthday-is">
          <button
            className="h-12 w-full rounded-full bg-gradient-to-r from-[#FD297B] to-[#FF5864] text-sm font-bold text-white shadow-md"
            disabled={!name} // Disable button if name is empty
          >
            CONTINUE
          </button>
        </Link>
      </div>
    </div>
  );
}
