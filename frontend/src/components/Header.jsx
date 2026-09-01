import React from 'react';

export default function Header() {
  return (
    <header className="w-full bg-white shadow py-5 px-4 flex flex-col items-center justify-center text-center">
      <img
        src="/images/logo/logo.jpg"
        alt="DU Logo"
        className="w-12 h-12 object-contain mx-auto mb-2"
      />
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
        Result Archive
      </h1>
      <h2 className="text-base sm:text-lg font-bold text-blue-700 leading-tight">
        Affiliated 7 Colleges
      </h2>
    </header>
  );
}
