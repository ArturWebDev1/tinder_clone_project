import React from 'react';
import Link from 'next/link';

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
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-white px-8">
      {/* Back Arrow */}
      <div className="absolute left-4 top-4 text-2xl text-gray-400">
        ←
      </div>

      <div className="flex w-full flex-col items-center m-1">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to Tinder</h1>
        
        <p className="mt-4 text-gray-500 text-sm">
          Please follow these House Rules.
        </p>

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
        <Link href="/profile">
          <button className="h-12 w-full rounded-full bg-gradient-to-r from-[#FD297B] to-[#FF5864] text-sm font-bold text-white shadow-md">
            I AGREE
          </button>
        </Link>
      </div>
    </div>
  );
}
