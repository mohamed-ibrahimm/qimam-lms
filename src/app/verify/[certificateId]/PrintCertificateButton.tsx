'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export default function PrintCertificateButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="px-5 py-2.5 rounded-xl bg-surface-raised hover:bg-surface-card border border-border text-xs font-bold text-white transition-all flex items-center gap-2 shadow-md hover:scale-105"
    >
      <Printer className="w-4 h-4 text-primary-400" />
      <span>طباعة / حفظ الشهادة PDF</span>
    </button>
  );
}