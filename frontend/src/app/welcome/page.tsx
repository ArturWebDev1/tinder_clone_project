// app/welcome/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UserData {
  name: string;
  age: number;
  photos: string[];
}

// House Rule component
const HouseRule = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold text-[#FD297B]">✓</span>
        <h2 className="font-bold text-sm text-black">{title}</h2>
      </div>
      <p className="ml-5 text-gray-500 text-sm">{description}</p>
    </div>
  );
};

export default function WelcomePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem('userId');

      // Crucial check: if user ID is not in local storage, redirect to login page.
      if (!userId) {
        console.error('User ID not found, redirecting to login.');
        router.push('/'); // Redirect to the main sign-in page
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/profile/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile.');
        }

        const data = await response.json();
        setUserData(data); // Store the entire user profile object
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []); // Re-run effect only on mount

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <p className="text-gray-500">Loading your profile...</p>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-4xl font-bold text-gray-800">Oops!</h2>
          <p className="mt-4 text-gray-500">
            We couldn't load your profile. Please try again.
          </p>
          <div className="mt-10 w-64">
            <Link href="/">
              <button className="h-12 w-full rounded-full bg-gradient-to-r from-[#FD297B] to-[#FF5864] text-sm font-bold text-white shadow-md">
                GO TO LOGIN
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-white px-8">
      {/* Back Arrow */}
      <div className="absolute left-4 top-4 text-2xl text-gray-400">
        ←
      </div>

      <div className="flex w-full flex-col items-center m-1">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to Tinder, <br/> {userData.name}!
        </h1>
        
        <p className="mt-4 text-gray-500 text-sm">
          Please follow these House Rules.
        </p>

        {/* Display Profile Information and Photos */}
        <div className="mt-8 flex flex-col items-center">
          <div className="text-xl font-bold text-gray-800">
            Age: {userData.age}
          </div>
          <p className="mt-2 text-gray-500 text-sm">Your photos:</p>
          <div className="mt-2 grid grid-cols-3 gap-2 w-80">
            {userData.photos.length > 0 ? (
              userData.photos.map((photoUrl: string, index: number) => (
                <img
                  key={index}
                  src={photoUrl}
                  alt={`User photo ${index + 1}`}
                  className="h-32 w-24 object-cover rounded-lg shadow-md"
                />
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-400">No photos found.</p>
            )}
          </div>
        </div>
        
        <div className="mt-8 mb-8 flex w-80 flex-col space-y-4">
          <HouseRule 
            title="Be yourself." 
            description="Make sure your photos, age, and bio are true to who you are." 
          />
          <HouseRule 
            title="Stay safe." 
            description="Don't be too quick to give out personal information. Date Safely" 
          />
          <HouseRule 
            title="Play it cool." 
            description="Respect others and treat them as you would like to be treated." 
          />
          <HouseRule 
            title="Be proactive." 
            description="Always report bad behavior." 
          />
        </div>
      </div>
      
      {/* Continue Button */}
      <div className="w-64">
        <Link href="/dashboard">
          <button className="h-12 w-full rounded-full bg-gradient-to-r from-[#FD297B] to-[#FF5864] text-sm font-bold text-white shadow-md">
            I AGREE
          </button>
        </Link>
      </div>
    </div>
  );
}
