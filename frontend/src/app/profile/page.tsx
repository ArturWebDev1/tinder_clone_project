"use client";

import React, { useState, useEffect, useRef } from 'react';

// Mock user data
const users = [
  { id: 1, name: 'Alice', age: 24, city: 'New York', distance: '2 miles away', photo: '/temp/woman1.avif', profilePhoto: '/temp/woman1.avif' },
  { id: 2, name: 'Bob', age: 26, city: 'Brooklyn', distance: '5 miles away', photo: '/temp/man1.avif', profilePhoto: '/temp/man1.avif' },
  { id: 3, name: 'Charlie', age: 25, city: 'Queens', distance: '3 miles away', photo: '/temp/man2.jpg', profilePhoto: '/temp/man2.jpg' },
  { id: 4, name: 'Diana', age: 22, city: 'Manhattan', distance: '1 mile away', photo: '/temp/woman2.jpg', profilePhoto: '/temp/woman2.jpg' },
];

/**
 * Main application component to handle page routing.
 * A simple state-based router is used for navigation between pages.
 */
export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const loggedInUser = users[0]; // For this example, we'll assume the first user is the logged-in user.

  // Component to render the dashboard page
  const DashboardPage = ({ onNavigate, currentPage }) => {
    const [cardStack, setCardStack] = useState(() => users.slice(0, 2));
    const [isSwiping, setIsSwiping] = useState(false);
    const [translation, setTranslation] = useState({ x: 0, rotation: 0 });
    const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

    const cardRef = useRef(null);
    const startX = useRef(0);

    // Function to handle the actual card swipe logic, called by buttons and drag events
    const handleSwipe = (direction: 'left' | 'right') => {
      if (cardStack.length === 0) return;
      setSwipeDirection(direction);
      const offScreenX = direction === 'right' ? window.innerWidth : -window.innerWidth;
      const rotation = direction === 'right' ? 20 : -20;
      setTranslation({ x: offScreenX, rotation });
      setTimeout(() => {
        setCardStack(prevStack => {
          const nextIndex = users.findIndex(u => u.id === prevStack[prevStack.length - 1]?.id) + 1;
          const newStack = [...prevStack.slice(1)];
          if (nextIndex < users.length) {
            newStack.push(users[nextIndex]);
          }
          return newStack;
        });
        setTranslation({ x: 0, rotation: 0 });
        setSwipeDirection(null);
      }, 300);
    };

    const handleStart = (clientX: number) => {
      if (!cardRef.current) return;
      setIsSwiping(true);
      startX.current = clientX;
      (cardRef.current as HTMLDivElement).style.transition = 'none';
    };

    const handleMove = (clientX: number) => {
      if (!isSwiping || !cardRef.current) return;
      const deltaX = clientX - startX.current;
      const rotation = deltaX * 0.05;
      setTranslation({ x: deltaX, rotation: rotation });
      if (deltaX > 50) {
        setSwipeDirection('right');
      } else if (deltaX < -50) {
        setSwipeDirection('left');
      } else {
        setSwipeDirection(null);
      }
    };

    const handleEnd = () => {
      if (!cardRef.current) return;
      setIsSwiping(false);
      if (Math.abs(translation.x) > 100) {
        const direction = translation.x > 0 ? 'right' : 'left';
        handleSwipe(direction);
      } else {
        setTranslation({ x: 0, rotation: 0 });
        setSwipeDirection(null);
      }
    };

    useEffect(() => {
      const card = cardRef.current;
      if (!card) return;
      const onMouseDown = (e: MouseEvent) => handleStart(e.clientX);
      const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
      const onMouseUp = () => handleEnd();
      const onTouchStart = (e: TouchEvent) => handleStart(e.touches[0].clientX);
      const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
      const onTouchEnd = () => handleEnd();
      card.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      card.addEventListener('touchstart', onTouchStart);
      card.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onTouchEnd);
      return () => {
        card.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        card.removeEventListener('touchstart', onTouchStart);
        card.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
      };
    }, [cardStack, isSwiping, translation.x]);

    const handleReset = () => {
      setCardStack(users.slice(0, 2));
      setTranslation({ x: 0, rotation: 0 });
      setSwipeDirection(null);
      setIsSwiping(false);
    };

    return (
      <div className="flex h-screen w-screen flex-col items-center bg-white font-inter overflow-x-hidden">
        {/* Header */}
        <header className="py-4 text-center">
          <h1 className="bg-gradient-to-r from-[#FD297B] to-[#FF5864] bg-clip-text text-2xl font-bold text-transparent">tinder</h1>
        </header>
        {/* Main Content - Card Deck */}
        <main className="relative flex-1 w-full max-w-sm flex flex-col items-center justify-center">
          {cardStack.length > 0 ? (
            <>
              {cardStack.map((user, index) => {
                const isTopCard = index === 0;
                const isSecondCard = index === 1;
                return (
                  <div key={user.id} ref={isTopCard ? cardRef : null} className={`absolute h-[80vh] w-full rounded-xl shadow-lg transition-transform duration-300 ease-out`} style={{
                    transform: isTopCard ? `translate(${translation.x}px, 0px) rotate(${translation.rotation}deg)` : `scale(${isSecondCard ? 1 : 0.95}) translateY(${isSecondCard ? '0px' : '-20px'})`,
                    transition: isSwiping && isTopCard ? 'none' : 'transform 0.3s ease-out',
                    zIndex: cardStack.length - index,
                    cursor: isTopCard ? 'grab' : 'default',
                  }}>
                    <img src={user.photo} alt={`${user.name}'s photo`} className="h-full w-full object-cover rounded-xl" draggable="false" />
                    {isTopCard && swipeDirection === 'left' && (<div className="absolute top-8 right-8 rotate-[25deg] rounded border-2 border-red-500 px-4 py-2 text-xl font-bold uppercase text-red-500">Nope</div>)}
                    {isTopCard && swipeDirection === 'right' && (<div className="absolute top-8 left-8 rotate-[-25deg] rounded border-2 border-green-500 px-4 py-2 text-xl font-bold uppercase text-green-500">Like</div>)}
                    <div className="absolute bottom-0 h-40 w-full rounded-b-xl bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-24 left-0 right-0 p-6 text-white">
                      <div className="flex justify-between items-end">
                        <div>
                          <h2 className="text-3xl font-bold">{user.name}, {user.age}</h2>
                          <p className="text-sm">{user.city}, {user.distance}</p>
                        </div>
                        <button className="h-8 w-8 rounded-full bg-white bg-opacity-30 text-gray-500 font-bold flex items-center justify-center">i</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (<div className="text-center text-gray-500">No more users to show!</div>)}
        </main>
        {/* Action Buttons Bar */}
        <div className="absolute bottom-[80px] left-0 right-0 flex justify-center items-center gap-4 z-10">
          <button onClick={handleReset} className="h-10 w-10 flex items-center justify-center rounded-full border border-yellow-500">
            <svg className="h-6 w-6 text-yellow-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.5C7.30558 21.5 3.5 17.6944 3.5 13C3.5 8.30558 7.30558 4.5 12 4.5V1.5L16.5 6L12 10.5V7.5C8.96243 7.5 6.5 9.96243 6.5 13C6.5 16.0376 8.96243 18.5 12 18.5C15.0376 18.5 17.5 16.0376 17.5 13H20.5C20.5 17.6944 16.6944 21.5 12 21.5Z" fill="currentColor"/></svg>
          </button>
          <button onClick={() => handleSwipe('left')} className={`h-16 w-16 flex items-center justify-center rounded-full border-1 border-red-500 transition-all duration-300 ${swipeDirection === 'left' ? 'bg-red-500' : 'bg-transparent'}`}>
            <svg className={`h-8 w-8 transition-colors duration-300 ${swipeDirection === 'left' ? 'text-white' : 'text-red-500'}`} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M44.0254 15.9746C42.0628 14.012 39.0494 14.012 37.0868 15.9746L30.0001 23.0613L22.9134 15.9746C20.9508 14.012 17.9374 14.012 15.9748 15.9746C14.0122 17.9372 14.0122 20.9506 15.9748 22.9132L23.0615 30L15.9748 37.0867C14.0122 39.0493 14.0122 42.0627 15.9748 44.0253C17.9374 45.9879 20.9508 45.9879 22.9134 44.0253L30.0001 36.9386L37.0868 44.0253C39.0494 45.9879 42.0628 45.9879 44.0254 44.0253C45.988 42.0627 45.988 39.0493 44.0254 37.0867L36.9387 30L44.0254 22.9132C45.988 20.9506 45.988 17.9372 44.0254 15.9746Z" fill="currentColor"/></svg>
          </button>
          <button className="h-10 w-10 flex items-center justify-center rounded-full border border-blue-500">
            <svg className="h-6 w-6 text-blue-500" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 1.5L9.3 8.3L1.5 9.4L7.5 14.3L6.1 21.5L12.5 17.9L18.9 21.5L17.5 14.3L23.5 9.4L15.7 8.3L12.5 1.5Z" fill="currentColor" /></svg>
          </button>
          <button onClick={() => handleSwipe('right')} className={`h-16 w-16 flex items-center justify-center rounded-full border-1 border-green-500 transition-all duration-300 ${swipeDirection === 'right' ? 'bg-green-500' : 'bg-transparent'}`}>
            <svg className={`h-8 w-8 transition-colors duration-300 ${swipeDirection === 'right' ? 'text-white' : 'text-green-500'}`} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.108 23.513c0 0 14.108-7.234 14.108-16.264 0-3.937-3.358-7.235-7.364-7.235 -4.741 0-6.744 3.3-6.744 3.3s-2.003-3.3-6.744-3.3c-4.007 0-7.365 3.3-7.365 7.235 0 9.03 14.108 16.264 14.108 16.264z" fill="currentColor"/></svg>
          </button>
          <button className="h-10 w-10 flex items-center justify-center rounded-full border border-purple-500">
            <svg className="h-6 w-6 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.25 1.25L5.75 12.25H10.75L9.75 22.75L17.25 11.75H12.25L13.25 1.25Z" fill="currentColor"/></svg>
          </button>
        </div>
        {/* Navigation Bar */}
        <footer className="w-full max-w-xs h-16 flex justify-around items-center border-t border-gray-200">
          <button onClick={() => onNavigate('dashboard')}><img src={currentPage === 'dashboard' ? "/images/tinderColor.svg" : "/images/tinderGray.svg"} alt="Tinder Logo" className="h-6"/></button>
          <button><img src="/images/premium.svg" alt="Premium Icon" className="h-6"/></button>
          <button><img src="/images/search.svg" alt="Search Icon" className="h-6"/></button>
          <button><img src="/images/chat.svg" alt="Chat Icon" className="h-6"/></button>
          <button onClick={() => onNavigate('profile')}><img src={currentPage === 'profile' ? "/images/profileColor.svg" : "/images/profileGray.svg"} alt="Person Icon" className="h-6"/></button>
        </footer>
      </div>
    );
  };
  
  // Component to render the profile page
  const ProfilePage = ({ onNavigate, currentPage, user }) => {
    return (
      <div className="flex h-screen w-screen flex-col items-center bg-white font-inter">
        {/* Header */}
        <header className="py-4 text-center">
          <h1 className="bg-gradient-to-r from-[#FD297B] to-[#FF5864] bg-clip-text text-2xl font-bold text-transparent">tinder</h1>
        </header>

        {/* Profile Content */}
        <main className="flex-1 w-full max-w-sm flex flex-col items-center justify-center pt-10">
          {/* Profile Photo Section */}
          <div className="relative mb-8">
            {/* Gray circle behind the photo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[154px] h-[154px] rounded-full border-2 border-gray-200"></div>
            {/* User photo with white stroke */}
            <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-white shadow-lg">
              <img src={user.profilePhoto} alt={`${user.name}'s profile photo`} className="object-cover w-full h-full" />
            </div>
          </div>
          
          {/* User Name and Age */}
          <h2 className="text-3xl font-bold text-gray-800 mb-8">{user.name}, {user.age}</h2>
          
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
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                </svg>
              </button>
              <p className="mt-2 text-sm text-primary font-semibold">Edit Profile</p>
            </div>
            {/* Safety Button */}
            <div className="flex flex-col items-center">
              <button className="relative w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
                <svg className="h-6 w-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM5.5 8a.5.5 0 01.5-.5h8a.5.5 0 01.5.5v5a.5.5 0 01-.5.5h-8a.5.5 0 01-.5-.5V8zM10 7a.5.5 0 00-.5.5V12a.5.5 0 001 0V7.5A.5.5 0 0010 7z" clipRule="evenodd"></path>
                </svg>
              </button>
              <p className="mt-2 text-xs text-gray-600 font-semibold">Safety</p>
            </div>
          </div>
        </main>
        
        {/* Navigation Bar */}
        <footer className="w-full max-w-xs h-16 flex justify-around items-center border-t border-gray-200">
          <button onClick={() => onNavigate('dashboard')}><img src={currentPage === 'dashboard' ? "/images/tinderColor.svg" : "/images/tinderGray.svg"} alt="Tinder Logo" className="h-6"/></button>
          <button><img src="/images/premium.svg" alt="Premium Icon" className="h-6"/></button>
          <button><img src="/images/search.svg" alt="Search Icon" className="h-6"/></button>
          <button><img src="/images/chat.svg" alt="Chat Icon" className="h-6"/></button>
          <button onClick={() => onNavigate('profile')}><img src={currentPage === 'profile' ? "/images/profileColor.svg" : "/images/profileGray.svg"} alt="Person Icon" className="h-6"/></button>
        </footer>
      </div>
    );
  };

  // Render the current page based on state
  switch (currentPage) {
    case 'dashboard':
      return <DashboardPage onNavigate={setCurrentPage} currentPage={currentPage} />;
    case 'profile':
      return <ProfilePage onNavigate={setCurrentPage} currentPage={currentPage} user={loggedInUser} />;
    default:
      return null;
  }
}
