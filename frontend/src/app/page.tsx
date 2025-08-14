import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
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
          <Link href="/oops-page">
            <button className="h-12 w-full rounded-full border-2 border-white bg-transparent text-sm font-bold text-white shadow-sm">
              SIGN IN WITH PHONE NUMBER
            </button>
          </Link>
          <Link href="/oops-page">
            <button className="h-12 w-full rounded-full border-2 border-white bg-transparent text-sm font-bold text-white shadow-sm">
              SIGN IN WITH FACEBOOK
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
