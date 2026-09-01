import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-5 text-center text-xs text-slate-500 bg-white border-t border-slate-200 mt-auto px-4">
      <div className="max-w-4xl mx-auto space-y-1">
        <p className="font-medium text-slate-600">
          Developed and maintained by the Office of the Controller of Examinations, University of Dhaka
        </p>
        <p className="text-[11px] text-slate-400">
          © {currentYear} University of Dhaka • Affiliated 7 Colleges Result Archive. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
