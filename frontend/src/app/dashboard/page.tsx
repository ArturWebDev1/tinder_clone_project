"use client";

import React, { useState, useEffect, useRef } from 'react';

const users = [
  { id: 1, name: 'Alice', age: 24, city: 'New York', distance: '2 miles away', photo: '/temp/woman1.avif' },
  { id: 2, name: 'Bob', age: 26, city: 'Brooklyn', distance: '5 miles away', photo: '/temp/man1.avif' },
  { id: 3, name: 'Charlie', age: 25, city: 'Queens', distance: '3 miles away', photo: '/temp/man2.jpg' },
  { id: 4, name: 'Diana', age: 22, city: 'Manhattan', distance: '1 mile away', photo: '/temp/woman2.jpg' },
];

export default function DashboardPage() {
  // Use a stack to represent the visible cards
  const [cardStack, setCardStack] = useState(() => users.slice(0, 2));
  const [isSwiping, setIsSwiping] = useState(false);
  const [translation, setTranslation] = useState({ x: 0, rotation: 0 });
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);

  // Function to handle the actual card swipe logic, called by buttons and drag events
  const handleSwipe = (direction: 'left' | 'right') => {
    if (cardStack.length === 0) return;

    setSwipeDirection(direction);
    
    // Animate the card off-screen
    const offScreenX = direction === 'right' ? window.innerWidth : -window.innerWidth;
    const rotation = direction === 'right' ? 20 : -20;
    setTranslation({ x: offScreenX, rotation });
    
    // After the animation, update the card stack
    setTimeout(() => {
      setCardStack(prevStack => {
        const nextIndex = users.findIndex(u => u.id === prevStack[prevStack.length - 1]?.id) + 1;
        const newStack = [...prevStack.slice(1)];
        if (nextIndex < users.length) {
          newStack.push(users[nextIndex]);
        }
        return newStack;
      });
      
      // Reset translation for the new top card
      setTranslation({ x: 0, rotation: 0 });
      setSwipeDirection(null);
    }, 300); // The timeout matches the transition duration for a smooth feel
  };

  // Mouse and Touch Event Handlers
  const handleStart = (clientX: number) => {
    if (!cardRef.current) return;
    setIsSwiping(true);
    startX.current = clientX;
    cardRef.current.style.transition = 'none';
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
    
    // Check if the swipe was far enough to trigger a full swipe
    if (Math.abs(translation.x) > 100) {
      const direction = translation.x > 0 ? 'right' : 'left';
      handleSwipe(direction); // Now correctly calls the shared function
    } else {
      // Snap back to original position
      setTranslation({ x: 0, rotation: 0 });
      setSwipeDirection(null);
    }
  };

  // The useEffect hook now depends on cardStack to re-bind listeners when the stack changes
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
    card.addEventListener('touchend', onTouchEnd);

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
    // Resetting the stack and state to its initial state
    setCardStack(users.slice(0, 2));
    setTranslation({ x: 0, rotation: 0 });
    setSwipeDirection(null);
    setIsSwiping(false);
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center bg-white font-inter overflow-x-hidden">
      {/* Header */}
      <header className="py-4 text-center">
        <h1 className="bg-gradient-to-r from-[#FD297B] to-[#FF5864] bg-clip-text text-2xl font-bold text-transparent">
          tinder
        </h1>
      </header>

      {/* Main Content - Card Deck */}
      <main className="relative flex-1 w-full max-w-sm flex flex-col items-center justify-center">
        {cardStack.length > 0 ? (
          <>
            {cardStack.map((user, index) => {
              const isTopCard = index === 0;
              const isSecondCard = index === 1;
              
              return (
                <div 
                  key={user.id}
                  ref={isTopCard ? cardRef : null}
                  className={`absolute h-[80vh] w-full rounded-xl shadow-lg transition-transform duration-300 ease-out`}
                  style={{
                    // Apply different transforms based on card position in the stack
                    transform: isTopCard 
                      ? `translate(${translation.x}px, 0px) rotate(${translation.rotation}deg)`
                      : `scale(${isSecondCard ? 1 : 0.95}) translateY(${isSecondCard ? '0px' : '-20px'})`,
                    transition: isSwiping && isTopCard ? 'none' : 'transform 0.3s ease-out',
                    zIndex: cardStack.length - index, // Ensure top card is on top
                    cursor: isTopCard ? 'grab' : 'default',
                  }}
                >
                  <img
                    src={user.photo}
                    alt={`${user.name}'s photo`}
                    className="h-full w-full object-cover rounded-xl"
                    draggable="false"
                  />
                  
                  {isTopCard && swipeDirection === 'left' && (
                    <div className="absolute top-8 right-8 rotate-[25deg] rounded border-2 border-red-500 px-4 py-2 text-xl font-bold uppercase text-red-500">
                      Nope
                    </div>
                  )}
                  {isTopCard && swipeDirection === 'right' && (
                    <div className="absolute top-8 left-8 rotate-[-25deg] rounded border-2 border-green-500 px-4 py-2 text-xl font-bold uppercase text-green-500">
                      Like
                    </div>
                  )}

                  {/* Gradient overlay for text readability */}
                  <div className="absolute bottom-0 h-40 w-full rounded-b-xl bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                  <div className="absolute bottom-24 left-0 right-0 p-6 text-white">
                    <div className="flex justify-between items-end">
                      <div>
                        <h2 className="text-3xl font-bold">
                          {user.name}, {user.age}
                        </h2>
                        <p className="text-sm">
                          {user.city}, {user.distance}
                        </p>
                      </div>
                      <button className="h-8 w-8 rounded-full bg-white bg-opacity-30 text-gray-500 font-bold flex items-center justify-center">
                        i
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="text-center text-gray-500">No more users to show!</div>
        )}
      </main>

      {/* Action Buttons Bar */}
      <div className="absolute bottom-[80px] left-0 right-0 flex justify-center items-center gap-4 z-10">
        {/* Reset Button */}
        <button onClick={handleReset} className="h-10 w-10 flex items-center justify-center rounded-full border border-yellow-500">
          <svg className="h-6 w-6 text-yellow-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.5C7.30558 21.5 3.5 17.6944 3.5 13C3.5 8.30558 7.30558 4.5 12 4.5V1.5L16.5 6L12 10.5V7.5C8.96243 7.5 6.5 9.96243 6.5 13C6.5 16.0376 8.96243 18.5 12 18.5C15.0376 18.5 17.5 16.0376 17.5 13H20.5C20.5 17.6944 16.6944 21.5 12 21.5Z" fill="currentColor"/>
          </svg>
        </button>

        {/* Nope Button */}
        <button onClick={() => handleSwipe('left')} className={`h-16 w-16 flex items-center justify-center rounded-full border-1 border-red-500 transition-all duration-300 ${swipeDirection === 'left' ? 'bg-red-500' : 'bg-transparent'}`}>
          <svg className={`h-8 w-8 transition-colors duration-300 ${swipeDirection === 'left' ? 'text-white' : 'text-red-500'}`} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <button onClick={() => handleSwipe('right')} className={`h-16 w-16 flex items-center justify-center rounded-full border-1 border-green-500 transition-all duration-300 ${swipeDirection === 'right' ? 'bg-green-500' : 'bg-transparent'}`}>
          <svg className={`h-8 w-8 transition-colors duration-300 ${swipeDirection === 'right' ? 'text-white' : 'text-green-500'}`} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      
      {/* Navigation Bar */}
      <footer className="w-full max-w-xs h-16 flex justify-around items-center border-t border-gray-200">
        <button><img src="/images/tinderColor.svg" alt="Tinder Logo" className="h-6"/></button>
        <button><img src="/images/premium.svg" alt="Premium Icon" className="h-6"/></button>
        <button><img src="/images/search.svg" alt="Search Icon" className="h-6"/></button>
        <button><img src="/images/chat.svg" alt="Chat Icon" className="h-6"/></button>
        <button><img src="/images/profileGray.svg" alt="Person Icon" className="h-6"/></button>
      </footer>
    </div>
  );
}
