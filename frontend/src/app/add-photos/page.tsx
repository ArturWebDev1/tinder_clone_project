"use client";

import React, { useState } from 'react';
import Link from 'next/link';

// Reusing the ProgressBar component
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

// Placeholder Photo Component
const PhotoPlaceholder = ({
  photoUrl,
  onAdd,
  onRemove
}: {
  photoUrl: string | null;
  onAdd: () => void;
  onRemove: () => void;
}) => {
  return (
    <div className="relative h-32 w-24 rounded-lg bg-gray-200 border-2 border-gray-300">
      {photoUrl ? (
        <>
          <img src={photoUrl} alt="User Photo" className="h-full w-full object-cover rounded-lg" />
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white text-gray-500 text-xs font-bold flex items-center justify-center shadow-md border"
          >
            x
          </button>
        </>
      ) : (
        <button
          onClick={onAdd}
          className="absolute bottom-1 right-1 h-6 w-6 rounded-full bg-gradient-to-r from-[#FD297B] to-[#FF5864] text-white flex items-center justify-center shadow-md text-xs font-bold"
        >
          +
        </button>
      )}
    </div>
  );
};

export default function AddPhotosPage() {
  const [photos, setPhotos] = useState<string[]>([]);
  
  const handleAddPhoto = () => {
    if (photos.length < 6) {
      // Simulate adding a photo. In a real app, this would trigger a file picker.
      const newPhoto = `https://picsum.photos/200/300?random=${Date.now()}`;
      setPhotos([...photos, newPhoto]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };
  
  const isButtonDisabled = photos.length < 2;
  const photoGrid = Array(6).fill(null);

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-white px-8">
      {/* Back Arrow */}
      <div className="absolute left-4 top-4 text-2xl text-gray-400">
        ←
      </div>
      
      <div className="flex w-full flex-col items-center m-1">
        {/* Progress Bar */}
        <div className="mt-12 mb-8">
          <ProgressBar step={4} totalSteps={5} />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800">Add photos</h1>
        
        <p className="mt-4 text-xs text-gray-400 text-center w-80">
          Add at least 2 photos to continue.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-2 w-80">
          {photoGrid.map((_, index) => (
            <PhotoPlaceholder
              key={index}
              photoUrl={photos[index] || null}
              onAdd={handleAddPhoto}
              onRemove={() => handleRemovePhoto(index)}
            />
          ))}
        </div>
      </div>
      
      {/* Continue Button */}
      <div className="mt-10 w-64">
        <Link href="/welcome">
          <button
            className="h-12 w-full rounded-full bg-gradient-to-r from-[#FD297B] to-[#FF5864] text-sm font-bold text-white shadow-md disabled:opacity-50"
            disabled={isButtonDisabled}
          >
            CONTINUE
          </button>
        </Link>
      </div>
    </div>
  );
}
