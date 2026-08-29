'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

import Link from 'next/link';
import { Headphones } from 'lucide-react';

interface FloatingWhatsAppProps {
  settings?: Record<string, string>;
}

export default function FloatingWhatsApp({ settings = {} }: FloatingWhatsAppProps) {
  const pathname = usePathname();

  // Hide in video classroom to keep full focus on the lessons
  if (pathname.startsWith('/learn')) {
    return null;
  }

  const candidateNum = settings.WHATSAPP_NUMBER || settings.CONTACT_WHATSAPP || settings.CONTACT_PHONE || '';
  const rawNum = (candidateNum && !candidateNum.includes('1001234567')) ? candidateNum : '01555791568';
  const cleanNum = rawNum.replace(/[^0-9]/g, '');
  let formattedWhatsapp = cleanNum;
  if (formattedWhatsapp.startsWith('002')) {
    formattedWhatsapp = formattedWhatsapp.slice(2);
  } else if (formattedWhatsapp.startsWith('0')) {
    formattedWhatsapp = '2' + formattedWhatsapp;
  } else if (formattedWhatsapp.length === 10 && formattedWhatsapp.startsWith('1')) {
    formattedWhatsapp = '20' + formattedWhatsapp;
  }
  const whatsappUrl = `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent('السلام عليكم، أود الاستفسار عن تفاصيل الكورسات والدبلومات')}`;

  return (
    <aside aria-label="أدوات المساعدة والتواصل" className="fixed bottom-5 left-4 sm:left-6 z-50 flex items-center gap-2.5 pointer-events-auto">
      {/* Floating Support Button */}
      <Link
        href="/support"
        className="flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-800 dark:bg-zinc-900/95 dark:hover:bg-zinc-800 text-white shadow-xl shadow-slate-900/40 border border-slate-700/80 dark:border-zinc-700/80 backdrop-blur-md hover:scale-105 active:scale-95 transition-all group cursor-pointer"
        title="تذاكر الدعم الفني والمساعدة"
      >
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-600/20 dark:bg-amber-500/20 text-blue-400 dark:text-amber-400 flex items-center justify-center shrink-0">
          <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-[10px] text-zinc-400 font-medium leading-none">مساعدة فورية</span>
          <span className="text-xs font-black leading-tight mt-0.5 whitespace-nowrap text-white">الدعم الفني</span>
        </div>
      </Link>

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-emerald-600/35 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all group border border-white/30 backdrop-blur-md cursor-pointer"
        title="تحدث مباشرة مع إدارة الأكاديمية عبر الواتساب"
      >
        <div className="relative flex items-center justify-center shrink-0">
          <span className="absolute -inset-1 rounded-full bg-white/40 animate-ping pointer-events-none" />
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white text-[#25D366] flex items-center justify-center shadow-xs">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </div>
        </div>
        <div className="hidden sm:flex flex-col text-right">
          <div className="flex items-center gap-1 leading-none">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] text-emerald-100 font-bold leading-none">متاح أونلاين</span>
          </div>
          <span className="text-xs font-black leading-tight mt-0.5 whitespace-nowrap">واتساب</span>
        </div>
      </a>
    </aside>
  );
}
