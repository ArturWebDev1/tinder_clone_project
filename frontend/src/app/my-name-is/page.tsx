// app/my-name-is/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);

  const isButtonDisabled = userName.trim().length === 0 || loading;

  const handlePostName = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/profile/name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: userName }),
      });

      if (!response.ok) {
        throw new Error('Failed to save name');
      }

      console.log('Name saved successfully!');
      router.push('/my-birthday-is');
    } catch (error) {
      console.error('Error:', error);
      // You could display an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-white px-8">
      {/* Back Arrow */}
      <div className="absolute left-4 top-4 text-2xl text-gray-400">
        ←
      </div>

      <div className="flex w-full flex-col items-center m-1">
        {/* Progress Bar */}
        <div className="mt-12 mb-8">
          <ProgressBar step={1} totalSteps={5} />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800">My first name is</h1>

        <div className="mt-8 flex w-80 flex-col items-center">
          <input
            type="text"
            placeholder="First name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full border-b border-gray-300 bg-white p-2 text-center font-light text-gray-800 placeholder-gray-400 focus:outline-none"
          />
          <p className="mt-4 text-xs text-gray-400 text-center">
            This is how it will appear in Tinder.
          </p>
        </div>
      </div>
      
      <div className="mt-10 w-64">
        <button
          onClick={handlePostName}
          className="h-12 w-full rounded-full bg-gradient-to-r from-[#FD297B] to-[#FF5864] text-sm font-bold text-white shadow-md disabled:opacity-50"
          disabled={isButtonDisabled}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}
