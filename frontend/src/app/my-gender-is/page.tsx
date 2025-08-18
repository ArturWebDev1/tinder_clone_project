// app/gender/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function MyGenderIsPage() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if a gender is selected and not in a loading state
  const isButtonDisabled = !selectedGender || loading;

  const handlePatchGender = async () => {
    setLoading(true);
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      console.error('Error: User ID not found in local storage.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/profile/${userId}/gender`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gender: selectedGender?.toUpperCase() }),
      });

      if (!response.ok) {
        throw new Error('Failed to save gender');
      }

      console.log('Gender saved successfully!');
      router.push('/add-photos'); // Redirect to the next step
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
          <ProgressBar step={3} totalSteps={5} />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800">I am a</h1>
        
        <p className="mt-4 text-gray-500 text-sm">
          Please select your gender.
        </p>

        <div className="mt-8 flex w-64 flex-col space-y-4">
          <button 
            onClick={() => setSelectedGender('man')}
            className={`w-full rounded-full border py-3 font-semibold transition-all duration-200
              ${selectedGender === 'man' ? 'border-[#FD297B] text-[#FD297B]' : 'border-gray-300 text-gray-500'}
            `}
          >
            MAN
          </button>
          <button 
            onClick={() => setSelectedGender('woman')}
            className={`w-full rounded-full border py-3 font-semibold transition-all duration-200
              ${selectedGender === 'woman' ? 'border-[#FD297B] text-[#FD297B]' : 'border-gray-300 text-gray-500'}
            `}
          >
            WOMAN
          </button>
        </div>
      </div>
      
      {/* Continue Button */}
      <div className="mt-10 w-64">
        <button
          onClick={handlePatchGender}
          className="h-12 w-full rounded-full bg-gradient-to-r from-[#FD297B] to-[#FF5864] text-sm font-bold text-white shadow-md disabled:opacity-50"
          disabled={isButtonDisabled}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}
