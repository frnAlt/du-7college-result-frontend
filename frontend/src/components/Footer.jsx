import React from 'react';
import { ShieldCheck, Lock, Globe } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Secure SSL Encrypted • Direct Verification Portal</span>
          </div>

          <div className="text-center md:text-right">
            <p className="font-medium text-slate-600">
              © {currentYear} Office of the Controller of Examinations. All Rights Reserved.
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Developed for Academic Results Archiving & Verification System
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
