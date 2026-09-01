import React from 'react';

export default function Header() {
  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow py-6 px-4 flex flex-col sm:flex-row items-center justify-center">
      <div className="flex items-center w-full sm:w-auto justify-center sm:justify-start">
        <img
          src="/images/logo/logo.svg"
          alt="DU Logo"
          className="w-16 h-16 mr-4 object-contain"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            University of Dhaka
          </h1>
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-400">
            Affiliated 7 Colleges
          </h2>
        </div>
      </div>
    </header>
  );
}
