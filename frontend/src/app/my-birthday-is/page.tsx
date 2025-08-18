// app/my-birthday-is/page.tsx
"use client";

import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
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

export default function MyBirthdayIsPage() {
  const router = useRouter();
  const [date, setDate] = useState({
    year: ['', '', '', ''],
    month: ['', ''],
    day: ['', ''],
  });
  const [loading, setLoading] = useState(false);

  // Create an array of refs for all 8 input fields
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const allDigits = [...date.year, ...date.month, ...date.day];
  const isFormValid = allDigits.every(digit => digit !== '') && allDigits.length === 8;
  const isButtonDisabled = !isFormValid || loading;

  const handleChange = (e: ChangeEvent<HTMLInputElement>, part: 'year' | 'month' | 'day', index: number) => {
    const value = e.target.value;
    if (/[0-9]/.test(value) || value === '') {
      const newPart = [...date[part]];
      newPart[index] = value;
      setDate(prev => ({ ...prev, [part]: newPart }));

      // This is the new logic to move the focus
      if (value !== '') {
        let globalIndex = index;
        if (part === 'month') {
            globalIndex += 4;
        } else if (part === 'day') {
            globalIndex += 6;
        }
        
        const nextIndex = globalIndex + 1;
        if (inputRefs.current[nextIndex] && inputRefs.current[nextIndex].value === '') {
          inputRefs.current[nextIndex].focus();
        }
      }
    }
  };

  const handlePatchBirthday = async () => {
    setLoading(true);
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      console.error('Error: User ID not found in local storage.');
      setLoading(false);
      return;
    }

    const fullDate = `${date.year.join('')}-${date.month.join('')}-${date.day.join('')}`;

    try {
      const response = await fetch(`http://localhost:8080/api/profile/${userId}/birthdate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ birthdate: fullDate }),
      });

      if (!response.ok) {
        throw new Error('Failed to save birthday');
      }

      console.log('Birthday saved successfully!');
      router.push('/my-gender-is');
    } catch (error) {
      console.error('Error:', error);
      // You could display an error message to the user here
    } finally {
      setLoading(false);
    }
  };
  
  // Set up the refs for input fields after component mounts
  useEffect(() => {
    inputRefs.current = [
      ...Array.from(document.querySelectorAll<HTMLInputElement>('input[placeholder="Y"]')),
      ...Array.from(document.querySelectorAll<HTMLInputElement>('input[placeholder="M"]')),
      ...Array.from(document.querySelectorAll<HTMLInputElement>('input[placeholder="D"]')),
    ];
  }, []);

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-white px-8">
      <div className="absolute left-4 top-4 text-2xl text-gray-400">
        ←
      </div>
      
      <div className="flex w-full flex-col items-center m-1">
        <div className="mt-12 mb-8">
          <ProgressBar step={2} totalSteps={5} />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800">My birthday is</h1>

        <div className="mt-8 flex w-80 flex-col items-center">
          <div className="flex w-full items-center justify-between text-lg">
            {date.year.map((digit, index) => (
              <input
                key={`year-${index}`}
                ref={el => { if (el) inputRefs.current[index] = el; }}
                type="text"
                placeholder="Y"
                value={digit}
                onChange={(e) => handleChange(e, 'year', index)}
                maxLength={1}
                className="w-8 border-b border-gray-300 bg-white text-center font-light text-gray-800 placeholder-gray-400 focus:outline-none"
              />
            ))}
            <span className="text-gray-400 text-2xl font-light">/</span>
            {date.month.map((digit, index) => (
              <input
                key={`month-${index}`}
                ref={el => { if (el) inputRefs.current[index + 4] = el; }}
                type="text"
                placeholder="M"
                value={digit}
                onChange={(e) => handleChange(e, 'month', index)}
                maxLength={1}
                className="w-8 border-b border-gray-300 bg-white text-center font-light text-gray-800 placeholder-gray-400 focus:outline-none"
              />
            ))}
            <span className="text-gray-400 text-2xl font-light">/</span>
            {date.day.map((digit, index) => (
              <input
                key={`day-${index}`}
                ref={el => { if (el) inputRefs.current[index + 6] = el; }}
                type="text"
                placeholder="D"
                value={digit}
                onChange={(e) => handleChange(e, 'day', index)}
                maxLength={1}
                className="w-8 border-b border-gray-300 bg-white text-center font-light text-gray-800 placeholder-gray-400 focus:outline-none"
              />
            ))}
          </div>
          
          <p className="mt-4 text-xs text-gray-400 text-center">
            Your age will be public.
          </p>
        </div>
      </div>
      
      <div className="mt-10 w-64">
        <button
          onClick={handlePatchBirthday}
          className="h-12 w-full rounded-full bg-gradient-to-r from-[#FD297B] to-[#FF5864] text-sm font-bold text-white shadow-md disabled:opacity-50"
          disabled={isButtonDisabled}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}
