// app/oops-page/page.tsx

import React from 'react';
import Link from 'next/link';

export default function OopsPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-white">
      {/* Back Arrow goes here, but it's a separate component we'll add later. */}
      
      <div className="flex flex-col items-center text-center">
        <h2 className="text-4xl font-bold text-gray-800">Oops!</h2>
        <p className="mt-4 text-gray-500">
          We couldn't find a Tinder account<br />
          connected to that information.
        </p>

        {/* The gradient button */}
        <div className="mt-10 w-64">
          <Link href="/signin-phone">
            <button className="h-12 w-full rounded-full bg-gradient-to-r from-[#FD297B] to-[#FF5864] text-sm font-bold text-white shadow-md">
              CREATE NEW ACCOUNT
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
