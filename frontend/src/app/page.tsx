// app/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const regions = [
  {name: 'Estonia', code: '372'},
  {name: 'Finland', code: '358'},
  {name: 'France', code: '33'},
];

const PhoneNumberModal = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedRegionCode, setSelectedRegionCode] = useState(regions[0].code);
  const [loading, setLoading] = useState(false);

  const isButtonDisabled = phoneNumber.length === 0 || loading;

  const handlePostPhoneNumber = async () => {
    setLoading(true);
    try {
      const fullPhoneNumber = `+${selectedRegionCode}${phoneNumber}`;
      
      const response = await fetch('http://localhost:8080/api/auth/phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: fullPhoneNumber }),
      });

      if (!response.ok) {
        throw new Error('Failed to process phone number');
      }

      console.log('Phone number sent successfully!');
      
      // Assuming the backend returns the profile ID or a redirect link
      const data = await response.json();
      const exist = data.exist;
      const userId = data.id;
      const code = data.code;
      localStorage.setItem('tinderCloneUserId', userId);
      localStorage.setItem('code', code);

      // The backend logic handles if the user is new or existing.
      if (exist) {
        router.push('/dashboard');
      } else {
        router.push('/my-code-is');
      }
      
    } catch (error) {
      console.error('Error:', error);
      // Display an error message to the user in a real app
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Modal Overlay with a dark shadow */}
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      
      {/* Modal Content - a white rectangle in the middle */}
      <div className="relative w-80 bg-white rounded-lg p-6 shadow-2xl transform scale-100 transition-transform duration-300 ease-in-out">
        {/* Close button */}
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 text-2xl font-light">&times;</button>
        </div>
        
        <div className="flex flex-col items-center pt-4 pb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Can we get your number?</h2>
          
          <div className="mt-6 flex w-full items-center justify-center space-x-2">
            {/* Country/Region Selector */}
            <div className="flex items-center rounded-lg border border-gray-300 px-2 py-3">
              <select
                value={selectedRegionCode}
                onChange={(e) => setSelectedRegionCode(e.target.value)}
                className="bg-transparent text-base text-gray-800 focus:outline-none"
              >
                {regions.map((region) => (
                  <option key={region.code} value={region.code}>
                    +{region.code}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Phone Number Bar */}
            <div className="flex flex-1 items-center rounded-lg border border-gray-300 px-4 py-3">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow numbers
                  if (/^\d*$/.test(value)) {
                    setPhoneNumber(value);
                  }
                }}
                placeholder="Phone number"
                className="w-full bg-transparent text-base text-gray-800 placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-8 w-64">
            <button
              onClick={handlePostPhoneNumber}
              className="h-12 w-full rounded-full bg-gradient-to-r from-[#FD297B] to-[#FF5864] text-sm font-bold text-white shadow-md disabled:opacity-50"
              disabled={isButtonDisabled}
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const [showPhoneNumberModal, setShowPhoneNumberModal] = useState(false);

  return (
    // The bg-gradient-to-r and from/to colors create the gradient background
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-r from-[#FD297B] to-[#FF5864]">
      {/* This is the Back Arrow placeholder. It's visible but non-functional on this page. */}
      <div className="absolute left-4 top-4 text-white">
        {/* We'll use an SVG or a library icon here later */}
        ←
      </div>

      <div className="flex flex-col items-center">
        {/* White logo placeholder */}
        <h1 className="text-5xl font-bold text-white">Tinder</h1>

        <div className="mt-10 flex w-64 flex-col gap-4">
          <button
            onClick={() => setShowPhoneNumberModal(true)}
            className="h-12 w-full rounded-full border-2 border-white bg-transparent text-sm font-bold text-white shadow-sm"
          >
            SIGN IN WITH PHONE NUMBER
          </button>
          <Link href="/oops-page">
            <button className="h-12 w-full rounded-full border-2 border-white bg-transparent text-sm font-bold text-white shadow-sm">
              SIGN IN WITH FACEBOOK
            </button>
          </Link>
        </div>
      </div>
      
      {/* Conditionally render the modal */}
      {showPhoneNumberModal && (
        <PhoneNumberModal
          onClose={() => setShowPhoneNumberModal(false)}
        />
      )}
    </div>
  );
}
