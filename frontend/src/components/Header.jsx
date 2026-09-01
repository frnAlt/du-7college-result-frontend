import React from 'react';

export default function Header() {
  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow py-6 px-4 flex flex-col sm:flex-row items-center justify-center">
      <div className="flex items-center w-full sm:w-auto justify-center sm:justify-start">
        <img
          src="/images/logo/logo.svg"
          alt="DU Logo"
          className="w-13 h-15 object-contain"
        />
      </div>
      <div className="flex flex-col items-center sm:items-start mt-4 sm:mt-0 sm:ml-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Result Archive
        </h1>
        <h2 className="text-lg text-blue-700 dark:text-blue-300 font-semibold">
          Affiliated 7 Colleges
        </h2>
      </div>
    </header>
  );
}
