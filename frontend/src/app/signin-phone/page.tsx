import React from 'react';
import Link from 'next/link';

export default function SigninPhonePage() {
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-white px-8">
      {/* Back Arrow */}
      <div className="absolute left-4 top-4 text-2xl text-gray-400">
        ←
      </div>

      <div className="flex w-full flex-col items-center">
        <h1 className="text-4xl font-bold text-gray-800">My number is</h1>
        
        <div className="mt-8 flex w-80 flex-col items-center">
          <div className="flex w-full items-center gap-4 border-b border-gray-300">
            <select
              className="bg-white text-lg font-semibold text-gray-800 focus:outline-none"
              defaultValue="+1"
            >
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              <option value="+49">+49</option>
            </select>
            
            <input
              type="text"
              placeholder="number"
              className="w-full bg-white text-lg font-semibold text-gray-800 placeholder-gray-400 focus:outline-none"
            />
          </div>
          
          <p className="mt-4 text-xs text-gray-400">
            We will send a text with a verification code. Message and data rates may apply.
            <br />
            Learn what happens when your number changes.
          </p>
        </div>
      </div>
      
      <div className="mt-10 w-64">
        <Link href="/my-code-is">
          {/* <button className="h-12 w-full rounded-full bg-gradient-to-r from-[#FD297B] to-[#FF5864] text-sm font-bold text-white shadow-md"> */}
          <button className="h-12 w-full rounded-full bg-gradient-to-r from-[#FD297B] to-[#FF5864] text-sm font-bold text-white shadow-md">
            CONTINUE
          </button>
        </Link>
      </div>
    </div>
  );
}
