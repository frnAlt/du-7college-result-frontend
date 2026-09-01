import React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="w-full max-w-xl mx-auto p-10 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 text-center animate-pulse">
      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600">
        <Loader2 className="w-7 h-7 animate-spin" />
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-1">
        Verifying Result with Allowed Archive...
      </h3>
      <p className="text-xs text-slate-500 font-bengali">
        ডাটাবেজ ও প্রাতিষ্ঠানিক রেকর্ডে ফলাফল যাচাই করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...
      </p>

      {/* Skeleton bars */}
      <div className="mt-8 space-y-3 max-w-sm mx-auto">
        <div className="h-4 bg-slate-200/70 rounded-full w-3/4 mx-auto"></div>
        <div className="h-3 bg-slate-100 rounded-full w-1/2 mx-auto"></div>
      </div>
    </div>
  );
}
