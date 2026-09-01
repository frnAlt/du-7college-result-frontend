import React from 'react';

const alertStyles = {
  success: {
    container: 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15',
    icon: 'text-emerald-500'
  },
  error: {
    container: 'border-red-500 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/15',
    icon: 'text-red-500'
  },
  warning: {
    container: 'border-amber-500 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/15',
    icon: 'text-amber-500'
  },
  info: {
    container: 'border-blue-500 bg-blue-50 text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/15',
    icon: 'text-blue-500'
  }
};

const icons = {
  success: (
    <svg className="fill-current w-6 h-6 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  ),
  error: (
    <svg className="fill-current w-6 h-6 shrink-0 text-red-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  ),
  warning: (
    <svg className="fill-current w-6 h-6 shrink-0 text-amber-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  ),
  info: (
    <svg className="fill-current w-6 h-6 shrink-0 text-blue-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  )
};

export default function Alert({ variant = 'error', title, message }) {
  const current = alertStyles[variant] || alertStyles.error;

  return (
    <div className={`rounded-xl border p-4 shadow-sm animate-fadeIn ${current.container}`}>
      <div className="flex items-start gap-3">
        <div className={`-mt-0.5 ${current.icon}`}>
          {icons[variant] || icons.error}
        </div>
        <div>
          <h4 className="mb-1 text-sm font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
