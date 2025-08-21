// src/app/profile/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define the UserProfile interface for better type safety
interface UserProfile {
  name: string;
  age: number;
  photos: string[];
}

/**
 * Renders the user profile page and fetches data from the backend.
 */
export default function ProfilePage() {
  const router = useRouter();

  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch the user profile from the backend API
    const fetchUserProfile = async () => {
      // Get the userId from localStorage, as it's a client-side value
      const userId = localStorage.getItem('userId');
      
      // If the userId doesn't exist, we can't fetch the profile.
      if (!userId) {
        console.error('User ID not found in localStorage. Redirecting.');
        setError('User not authenticated.');
        setLoading(false);
        // Optional: Redirect the user back to the login page
        // router.push('/');
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
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data: UserProfile = await response.json();
        setUserData(data);

      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white font-inter">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white font-inter">
        <p className="text-red-500">{error || 'No user data found.'}</p>
      </div>
    );
  }

  // Use the first photo from the photos array as the profile photo
  const profilePhoto = userData.photos.length > 0 ? userData.photos[0] : '/images/placeholder.svg';

  return (
    <div className="flex h-screen w-screen flex-col items-center bg-white font-inter overflow-hidden">
      {/* Profile Content */}
      <main className="flex-1 w-full max-w-sm flex flex-col items-center justify-center pt-10">
        {/* Header */}
        <h1 className="bg-gradient-to-r from-[#FD297B] to-[#FF5864] bg-clip-text text-2xl font-bold text-transparent mb-4">tinder</h1>

        {/* Profile Photo Section */}
        <div className="relative mb-8">
          {/* Gray circle behind the photo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[154px] h-[154px] rounded-full border-2 border-gray-200"></div>
          {/* User photo with white stroke */}
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-white shadow-lg">
            <img src={profilePhoto} alt={`${userData.name}'s profile photo`} className="object-cover w-full h-full" />
          </div>
        </div>
        
        {/* User Name and Age */}
        <h2 className="text-3xl font-bold text-gray-800 mb-8">{userData.name}, {userData.age}</h2>
        
        {/* Profile Buttons */}
        <div className="flex items-start justify-center gap-4">
          {/* Settings Button */}
          <div className="flex flex-col items-center">
            <button className="relative w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
              <svg className="h-6 w-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.25 10c0 .414-.336.75-.75.75h-2.12c-.084.288-.184.568-.29.84l1.192 1.192a.75.75 0 01-1.06 1.06L12.553 12.63c-.272.106-.552.206-.84.29v2.12c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-2.12c-.288-.084-.568-.184-.84-.29L6.192 14.192a.75.75 0 01-1.06-1.06l1.192-1.192c-.106-.272-.206-.552-.29-.84H2.75c-.414 0-.75-.336-.75-.75s.336-.75.75-.75h2.12c.084-.288.184-.568.29-.84L4.192 6.192a.75.75 0 011.06-1.06l1.192 1.192c.272-.106.552-.206.84-.29V2.75c0-.414.336-.75.75-.75s.75.336.75.75v2.12c.288.084.568.184.84.29l1.192-1.192a.75.75 0 011.06 1.06l-1.192 1.192c.106.272.206.552.29.84h2.12c.414 0 .75.336.75.75zM10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"></path>
              </svg>
            </button>
            <p className="mt-2 text-xs text-gray-600 font-semibold">Settings</p>
          </div>
          {/* Edit Profile Button */}
          <div className="flex flex-col items-center">
            <button className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
              <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM14.5 5.5l1.5-1.5M4 14.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"></path>
                {/* Fixed fill-rule and clip-rule */}
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
              </svg>
            </button>
            <p className="mt-2 text-sm text-primary font-semibold">Edit Profile</p>
          </div>
          {/* Safety Button */}
          <div className="flex flex-col items-center">
            <button className="relative w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
              <svg className="h-6 w-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                {/* Fixed fill-rule and clip-rule */}
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM5.5 8a.5.5 0 01.5-.5h8a.5.5 0 01.5.5v5a.5.5 0 01-.5.5h-8a.5.5 0 01-.5-.5V8zM10 7a.5.5 0 00-.5.5V12a.5.5 0 001 0V7.5A.5.5 0 0010 7z" clipRule="evenodd"></path>
              </svg>
            </button>
            <p className="mt-2 text-xs text-gray-600 font-semibold">Safety</p>
          </div>
        </div>
      </main>
      
      {/* Navigation Bar */}
      <footer className="w-full max-w-xs h-16 flex justify-around items-center border-t border-gray-200">
        <button onClick={() => router.push('/dashboard')}>
          <img src={"/images/tinderGray.svg"} alt="Tinder Logo" className="h-6" />
        </button>
        <button><img src="/images/premium.svg" alt="Premium Icon" className="h-6"/></button>
        <button><img src="/images/search.svg" alt="Search Icon" className="h-6"/></button>
        <button><img src="/images/chat.svg" alt="Chat Icon" className="h-6"/></button>
        <button onClick={() => router.push('/profile')}>
          <img src={"/images/profileColor.svg"} alt="Person Icon" className="h-6" />
        </button>
      </footer>
    </div>
  );
}
