import React from 'react';

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-100 py-4 px-4 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <img
          src="/images/logo/logo.jpg"
          alt="DU Logo"
          className="w-11 h-11 object-contain"
        />
        <div className="flex flex-col text-left">
          <h1 className="text-xl font-bold text-gray-900 leading-tight">
            Result Archive
          </h1>
          <h2 className="text-base font-bold text-blue-700 leading-tight">
            Affiliated 7 Colleges
          </h2>
        </div>
      </div>
    </header>
  );
}
