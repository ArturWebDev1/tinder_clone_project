"use client";

import React, { useState, useEffect } from 'react';

const users = [
  { id: 1, name: 'Alice', age: 24, city: 'New York', distance: '2 miles away', photo: 'https://picsum.photos/600/800?random=1' },
  { id: 2, name: 'Bob', age: 26, city: 'Brooklyn', distance: '5 miles away', photo: 'https://picsum.photos/600/800?random=2' },
  { id: 3, name: 'Charlie', age: 25, city: 'Queens', distance: '3 miles away', photo: 'https://picsum.photos/600/800?random=3' },
  { id: 4, name: 'Diana', age: 22, city: 'Manhattan', distance: '1 mile away', photo: 'https://picsum.photos/600/800?random=4' },
];

export default function DashboardPage() {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const currentUser = users[currentUserIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    // Simulate the animation
    setTimeout(() => {
      setCurrentUserIndex((prevIndex) => (prevIndex + 1) % users.length);
      setSwipeDirection(null);
    }, 800);
  };

  const handleReset = () => {
    if (currentUserIndex > 0) {
      setCurrentUserIndex(currentUserIndex - 1);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center bg-white">
      {/* Header */}
      <header className="py-4 text-center">
        <h1 className="bg-gradient-to-r from-[#FD297B] to-[#FF5864] bg-clip-text text-2xl font-bold text-transparent">
          tinder
        </h1>
      </header>

      {/* Main Content - Photo Card */}
      <main className="relative flex-1 w-full max-w-sm flex items-center justify-center">
        {currentUser ? (
          <div className={`relative h-[80vh] w-full rounded-xl shadow-lg transition-transform duration-300
            ${swipeDirection === 'left' ? '-translate-x-full rotate-[-10deg]' : ''}
            ${swipeDirection === 'right' ? 'translate-x-full rotate-[10deg]' : ''}
          `}>
            <img
              src={currentUser.photo}
              alt={`${currentUser.name}'s photo`}
              className="h-full w-full object-cover rounded-xl"
            />
            
            {/* NOPE and LIKE overlays */}
            {swipeDirection === 'left' && (
              <div className="absolute top-8 right-8 rotate-[25deg] rounded border-2 border-red-500 px-4 py-2 text-xl font-bold uppercase text-red-500">
                Nope
              </div>
            )}
            {swipeDirection === 'right' && (
              <div className="absolute top-8 left-8 rotate-[-25deg] rounded border-2 border-green-500 px-4 py-2 text-xl font-bold uppercase text-green-500">
                Like
              </div>
            )}

            {/* User Info & Info Button */}
            <div className="absolute bottom-20 left-0 right-0 p-6 text-white">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold">
                    {currentUser.name}, {currentUser.age}
                  </h2>
                  <p className="text-sm">
                    {currentUser.city}, {currentUser.distance}
                  </p>
                </div>
                <button className="h-8 w-8 rounded-full bg-white bg-opacity-30 text-gray-500 font-bold flex items-center justify-center">
                  i
                </button>
              </div>
            </div>

            {/* Action Buttons Bar */}
            <div className="absolute bottom-[+20px] left-0 right-0 flex justify-center items-center gap-4">
              {/* Reset Button */}
              <button onClick={handleReset} className="h-10 w-10 flex items-center justify-center rounded-full border border-yellow-500">
                <svg className="h-6 w-6 text-yellow-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.5C7.30558 21.5 3.5 17.6944 3.5 13C3.5 8.30558 7.30558 4.5 12 4.5V1.5L16.5 6L12 10.5V7.5C8.96243 7.5 6.5 9.96243 6.5 13C6.5 16.0376 8.96243 18.5 12 18.5C15.0376 18.5 17.5 16.0376 17.5 13H20.5C20.5 17.6944 16.6944 21.5 12 21.5Z" fill="currentColor"/>
                </svg>
              </button>

              {/* Nope Button */}
              <button onClick={() => handleSwipe('left')} className={`h-16 w-16 flex items-center justify-center rounded-full border-1 border-red-500 transition-all duration-300
                ${swipeDirection === 'left' ? 'bg-red-500' : 'bg-transparent'}
              `}>
                <svg className={`h-8 w-8 transition-colors duration-300
                  ${swipeDirection === 'left' ? 'text-white' : 'text-red-500'}
                `} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M44.0254 15.9746C42.0628 14.012 39.0494 14.012 37.0868 15.9746L30.0001 23.0613L22.9134 15.9746C20.9508 14.012 17.9374 14.012 15.9748 15.9746C14.0122 17.9372 14.0122 20.9506 15.9748 22.9132L23.0615 30L15.9748 37.0867C14.0122 39.0493 14.0122 42.0627 15.9748 44.0253C17.9374 45.9879 20.9508 45.9879 22.9134 44.0253L30.0001 36.9386L37.0868 44.0253C39.0494 45.9879 42.0628 45.9879 44.0254 44.0253C45.988 42.0627 45.988 39.0493 44.0254 37.0867L36.9387 30L44.0254 22.9132C45.988 20.9506 45.988 17.9372 44.0254 15.9746Z" fill="currentColor"/>
                </svg>
              </button>

              {/* Superlike Button */}
              <button className="h-10 w-10 flex items-center justify-center rounded-full border border-blue-500">
                <svg className="h-6 w-6 text-blue-500" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 1.5L9.3 8.3L1.5 9.4L7.5 14.3L6.1 21.5L12.5 17.9L18.9 21.5L17.5 14.3L23.5 9.4L15.7 8.3L12.5 1.5Z" fill="currentColor" />
                </svg>
              </button>
              
              {/* Like Button */}
              <button onClick={() => handleSwipe('right')} className={`h-16 w-16 flex items-center justify-center rounded-full border-1 border-green-500 transition-all duration-300
                ${swipeDirection === 'right' ? 'bg-green-500' : 'bg-transparent'}
              `}>
                <svg className={`h-8 w-8 transition-colors duration-300
                  ${swipeDirection === 'right' ? 'text-white' : 'text-green-500'}
                `} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.108 23.513c0 0 14.108-7.234 14.108-16.264 0-3.937-3.358-7.235-7.364-7.235 -4.741 0-6.744 3.3-6.744 3.3s-2.003-3.3-6.744-3.3c-4.007 0-7.365 3.3-7.365 7.235 0 9.03 14.108 16.264 14.108 16.264z" fill="currentColor"/>
                </svg>
              </button>

              {/* Boost Button */}
              <button className="h-10 w-10 flex items-center justify-center rounded-full border border-purple-500">
                <svg className="h-6 w-6 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.25 1.25L5.75 12.25H10.75L9.75 22.75L17.25 11.75H12.25L13.25 1.25Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">No more users to show!</div>
        )}
      </main>

      {/* Navigation Bar */}
      <footer className="w-full h-16 flex justify-around items-center border-t border-gray-200">
        <button><img src="https://cloud-data.protopie.io/xid/upload/pies/8773762393/res/2af152aedfb9fe5189b404167ee2fd59935a24ad.svg?response-content-type=image%2Fsvg%2Bxml&Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6Imh0dHBzOi8vY2xvdWQtZGF0YS5wcm90b3BpZS5pby94aWQvdXBsb2FkL3BpZXMvODc3Mzc2MjM5My9yZXMvMmFmMTUyYWVkZmI5ZmU1MTg5YjQwNDE2N2VlMmZkNTk5MzVhMjRhZC5zdmc~cmVzcG9uc2UtY29udGVudC10eXBlPWltYWdlJTJGc3ZnJTJCeG1sIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzU1MjM3NjAwfSwiSXBBZGRyZXNzIjp7IkFXUzpTb3VyY2VJcCI6IjAuMC4wLjAvMCJ9LCJEYXRlR3JlYXRlclRoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc1NTIyMzIwMH19fV19&Signature=CluIQscaCTaOr1X0Zq-6endA-cDj7sFp5roIK0FPtXK2nYhGsIHmd~PXp9hpTAsW08nkv-RIH2agNBbPYU9tB9afRxNhMRbFjtZy8atTI2J9yhkln3QS6nQBmRIt4o~jkG4SB67ynDNG1ykHs1T45ZxZWadsnLdMdGewrBrdmAO-Qr13mSNKPhLwP5KY94M9UD2BnV2o9vUec3dYGX0kGnOmYFkdyM52IvHIU8mYcM9~bg6EiiZYKjLs-MqRwlT4pO19n6nqG4crn9K73d~SJLcnZ1eoor3NX22umGgoWJbTNXf4ovcCZ2g1ax3lQCc0MFdMcqHv2vFVDwd0gaRRsA__&Key-Pair-Id=APKAJWJARUN3H6JALWTA" alt="Tinder Logo" className="h-8"/></button>
        <button><img src="https://cloud-data.protopie.io/xid/upload/pies/8773762393/res/30d98cde28242cd38bfe1822cbf0f8f1ee846984.svg" alt="Fire Icon" className="h-8"/></button>
        <button><img src="https://cloud-data.protopie.io/xid/upload/pies/8773762393/res/935070a60cfb352e19b31f48dec65ff115ae734d.svg" alt="Chat Icon" className="h-8"/></button>
        <button><img src="https://cloud-data.protopie.io/xid/upload/pies/8773762393/res/2f2d8476de8b4e0b793514ccc0d8ee47b8e52646.svg" alt="Person Icon" className="h-8"/></button>
        <button><img src="https://cloud-data.protopie.io/xid/upload/pies/8773762393/res/abb5b2718c26332a0dc94e403713e9e911d74097.svg" alt="Star Icon" className="h-8"/></button>
      </footer>
    </div>
  );
}
