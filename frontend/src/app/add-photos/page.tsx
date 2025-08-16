// app/photos/page.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

// Interface for photo object to manage file and URL
interface Photo {
  file: File | null;
  url: string | null;
}

// A component representing a single photo placeholder or a filled photo
const PhotoPlaceholder = ({
  photo,
  onClick,
  onRemove
}: {
  photo: Photo;
  onClick: () => void;
  onRemove: () => void;
}) => {
  return (
    <div className="relative h-32 w-24 rounded-lg border-2 border-gray-300">
      {photo.url ? (
        <>
          <img src={photo.url} alt="User Photo" className="h-full w-full object-cover rounded-lg" />
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white text-gray-500 text-xs font-bold flex items-center justify-center shadow-md border"
          >
            x
          </button>
        </>
      ) : (
        <button
          onClick={onClick}
          className="h-full w-full flex items-center justify-center bg-gray-200 rounded-lg text-white"
        >
          <span className="text-xl font-bold bg-gradient-to-r from-[#FD297B] to-[#FF5864] pt-0.5 pb-0.5 pr-2 pl-2 rounded-full">+</span>
        </button>
      )}
    </div>
  );
};

export default function AddPhotosPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>(Array(6).fill({ file: null, url: null }));
  const [loading, setLoading] = useState(false);

  // Ref to the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentPhotoIndex = useRef<number | null>(null);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      photos.forEach(photo => {
        if (photo.url && photo.file) {
          URL.revokeObjectURL(photo.url);
        }
      });
    };
  }, [photos]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentPhotoIndex.current !== null) {
      const newPhotos = [...photos];
      newPhotos[currentPhotoIndex.current] = {
        file: file,
        url: URL.createObjectURL(file), // Create a temporary URL for preview
      };
      setPhotos(newPhotos);
      e.target.value = ''; // Reset file input to allow re-upload of same file
    }
  };

  const handleAddPhotoClick = (index: number) => {
    currentPhotoIndex.current = index;
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...photos];
    const photoToRemove = newPhotos[index];
    if (photoToRemove.url && photoToRemove.file) {
      URL.revokeObjectURL(photoToRemove.url); // Revoke temporary URL
    }
    newPhotos[index] = { file: null, url: null };
    setPhotos(newPhotos);
  };
  
  const handleContinue = async () => {
    setLoading(true);
    const userId = localStorage.getItem('tinderCloneUserId');

    if (!userId) {
      console.error('Error: User ID not found in local storage.');
      setLoading(false);
      return;
    }

    try {
      const uploadPromises = photos.map(async (photo) => {
        if (photo.file) {
          const formData = new FormData();
          formData.append('file', photo.file);

          const response = await fetch(`http://localhost:8080/api/profile/${userId}/photos/upload`, {
            method: 'PATCH',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to upload photo');
          }
          
          const result = await response.json();
          return result.photoLink; // Assuming backend returns a link to the uploaded photo
        }
        return null;
      });

      const uploadedPhotoLinks = await Promise.all(uploadPromises);

      console.log('Photos uploaded successfully:', uploadedPhotoLinks);
      router.push('/welcome'); // Redirect to the welcome page
    } catch (error) {
      console.error('Error:', error);
      // Display an error message to the user
    } finally {
      setLoading(false);
    }
  };

  const uploadedPhotosCount = photos.filter(photo => photo.url).length;
  const isButtonDisabled = uploadedPhotosCount < 2 || loading;

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-white px-8">
      {/* Back Arrow */}
      <div className="absolute left-4 top-4 text-2xl text-gray-400">
        ←
      </div>
      
      {/* Hidden file input element */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg"
      />
      
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
          {photos.map((photo, index) => (
            <PhotoPlaceholder
              key={index}
              photo={photo}
              onClick={() => handleAddPhotoClick(index)}
              onRemove={() => handleRemovePhoto(index)}
            />
          ))}
        </div>
      </div>
      
      {/* Continue Button */}
      <div className="mt-10 w-64">
        <button
          onClick={handleContinue}
          className="h-12 w-full rounded-full bg-gradient-to-r from-[#FD297B] to-[#FF5864] text-sm font-bold text-white shadow-md disabled:opacity-50"
          disabled={isButtonDisabled}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}
