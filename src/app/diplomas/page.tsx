import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatPrice, formatDuration } from '@/lib/utils';
import { Award, Layers, Clock, CheckCircle2, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DiplomasPage() {
  let diplomas: any[] = [];
  try {
    diplomas = await prisma.diploma.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        diplomaCourses: {
          orderBy: { orderIndex: 'asc' },
          include: {
            course: {
              select: { id: true, title: true, durationHours: true, price: true }
            }
          }
        },
        _count: { select: { enrollments: true } }
      }
    });
  } catch (e) {
    console.error('Failed to fetch diplomas:', e);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-xs font-bold">
          <Award className="w-3.5 h-3.5" />
          <span>المسارات الشاملة المعتمدة</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">الدبلومات المهنية المتكاملة</h1>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          دبلومات مكثفة تجمع أهم الكورسات التخصصية لإعدادك لسوق العمل وتوفير أكثر من 50% مقارنة بشراء الكورسات منفردة، مع شهادة تخرج كبرى.
        </p>
      </div>

      {/* Diplomas List */}
      <div className="space-y-8">
        {diplomas.map((diploma: any) => {
          const totalOriginalPrice = diploma.diplomaCourses.reduce((sum: number, dc: any) => sum + dc.course.price, 0);
          const totalHours = diploma.diplomaCourses.reduce((sum: number, dc: any) => sum + dc.course.durationHours, diploma.durationHours);

          return (
            <div
              key={diploma.id}
              className="p-6 sm:p-8 rounded-3xl bg-surface border border-purple-800/40 hover:border-purple-600/70 shadow-2xl transition-all grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left Column (Details) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-bold flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    دبلومة مهنية كبرى
                  </span>
                  {diploma.category && (
                    <span className="px-3 py-1 rounded-full bg-surface-raised border border-border text-zinc-300">
                      {diploma.category.name}
                    </span>
                  )}
                  <span className="text-zinc-400 flex items-center gap-1 pr-2">
                    <Clock className="w-3.5 h-3.5 text-primary-400" />
                    {formatDuration(totalHours)} تدريب مكثف
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {diploma.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {diploma.description}
                  </p>
                </div>

                {/* Included Courses Grid */}
                <div className="p-4 sm:p-5 rounded-2xl bg-surface-raised border border-border/80 space-y-3">
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-primary-400" />
                    <span>الكورسات المتضمنة في هذه الدبلومة ({diploma.diplomaCourses.length} دورات):</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {diploma.diplomaCourses.map((dc: any, i: number) => (
                      <div
                        key={dc.id}
                        className="p-2.5 px-3 rounded-xl bg-surface-card border border-border flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-5 h-5 rounded-md bg-purple-950 text-purple-300 font-bold text-[10px] flex items-center justify-center shrink-0 border border-purple-800">
                            {i + 1}
                          </span>
                          <span className="font-semibold text-zinc-200 truncate">{dc.course.title}</span>
                        </div>
                        <span className="text-zinc-500 shrink-0 text-[11px] mr-2">
                          {formatDuration(dc.course.durationHours)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column (Card & CTA) */}
              <div className="lg:col-span-1 p-6 rounded-2xl bg-surface-raised border border-border flex flex-col justify-between space-y-6">
                <div className="relative h-44 rounded-xl overflow-hidden bg-zinc-900">
                  <img
                    src={diploma.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'}
                    alt={diploma.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      شهادة تخرج موثقة بالـ QR Code
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-zinc-400">سعر الدبلومة الشاملة</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-white">{formatPrice(diploma.price)}</span>
                    {totalOriginalPrice > diploma.price && (
                      <span className="text-xs text-zinc-500 line-through">
                        {formatPrice(totalOriginalPrice)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-400 font-semibold pt-1">
                    وفر أكثر من {formatPrice(totalOriginalPrice - diploma.price)} عند الاشتراك في الدبلومة
                  </p>
                </div>

                <Link
                  href={`/diplomas/${diploma.slug}`}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-primary-900/30 text-center transition-all hover:scale-[1.02]"
                >
                  تفاصيل الدبلومة والتسجيل
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}