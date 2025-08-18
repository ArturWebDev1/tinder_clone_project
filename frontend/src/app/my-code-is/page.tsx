"use client";

import React, { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function MyCodeIsPage() {
  const router = useRouter();
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/[0-9]/.test(value) || value === '') {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value !== '' && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      if (newCode.every(digit => digit !== '')) {
        handleVerification(newCode.join(''));
      }
    }
  };

  const handleVerification = async (submittedCode: string) => {
    console.log("Submitting code to backend:", submittedCode);
    setIsIncorrect(false); // Reset error state

    // --- Backend Integration Action ---
    // Here you would make a POST request to your Spring Boot backend
    // const response = await fetch('/api/profile/verify-code', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ code: submittedCode, phoneNumber: 'user_phone_number' }),
    // });

    
    // const result = await response.json();

    // Simulating a backend response
    const isCodeCorrect = submittedCode === localStorage.getItem('code'); // Use a mock correct code for now

    if (isCodeCorrect) {
      console.log("Code is correct! Navigating to next page.");
      router.push('/my-name-is'); // Assuming the next page is /my-name-is
    } else {
      console.log("Code is incorrect. Clearing inputs.");
      setIsIncorrect(true);
      setTimeout(() => {
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }, 400); // Clear inputs after a small delay
    }
  };

  return (
    <div className="relative flex h-screen w-screen flex-col justify-center items-center bg-white px-8">
      <div className="absolute left-4 top-4 text-2xl text-gray-400">
        ←
      </div>

      <div className="flex w-full flex-col items-center">
        <h1 className="text-4xl font-bold text-gray-800">My code is</h1>
        
        <div className="mt-8 flex justify-center gap-2">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={el => { if (el) inputRefs.current[index] = el; }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              className="h-12 w-10 border-b-2 border-gray-300 text-center text-2xl font-bold text-gray-800 focus:outline-none"
            />
          ))}
        </div>
        
        {isIncorrect && (
          <p className="mt-4 text-sm text-red-500">Incorrect code. Try again.</p>
        )}
      </div>
    </div>
  );
}
