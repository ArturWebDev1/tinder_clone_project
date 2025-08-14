"use client";

import React, { useState } from 'react';
import Link from 'next/link';

// Reusing the ProgressBar component
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

export default function GenderPage() {
  const [selectedGender, setSelectedGender] = useState<'man' | 'woman' | null>(null);

  const isButtonDisabled = !selectedGender;

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-white px-8">
      {/* Back Arrow */}
      <div className="absolute left-4 top-4 text-2xl text-gray-400">
        ←
      </div>
      
      <div className="flex w-full flex-col items-center m-1">
        {/* Progress Bar */}
        <div className="mt-12 mb-8">
          <ProgressBar step={3} totalSteps={5} />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800">I am a</h1>

        <div className="mt-8 flex w-64 flex-col items-center gap-4">
          <button
            onClick={() => setSelectedGender('woman')}
            className={`h-12 w-full rounded-full text-sm font-bold shadow-md transition-all duration-200
              ${selectedGender === 'woman'
                ? 'bg-gradient-to-r from-[#FD297B] to-[#FF5864] text-white'
                : 'border border-gray-400 text-gray-400'
              }`}
          >
            WOMAN
          </button>
          <button
            onClick={() => setSelectedGender('man')}
            className={`h-12 w-full rounded-full text-sm font-bold shadow-md transition-all duration-200
              ${selectedGender === 'man'
                ? 'bg-gradient-to-r from-[#FD297B] to-[#FF5864] text-white'
                : 'border border-gray-400 text-gray-400'
              }`}
          >
            MAN
          </button>
        </div>
      </div>
      
      {/* Continue Button */}
      <div className="mt-10 w-64">
        <Link href="/add-photos">
          <button
            className="h-12 w-full rounded-full bg-gradient-to-r from-[#FD297B] to-[#FF5864] text-sm font-bold text-white shadow-md disabled:opacity-50"
            disabled={isButtonDisabled}
          >
            CONTINUE
          </button>
        </Link>
      </div>
    </div>
  );
}
