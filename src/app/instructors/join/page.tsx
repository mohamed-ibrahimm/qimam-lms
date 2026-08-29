'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Video, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  DollarSign, 
  Award, 
  Users, 
  Clock, 
  Percent, 
  Gift, 
  TrendingUp, 
  Smartphone,
  Flame,
  Star,
  Check
} from 'lucide-react';

export default function InstructorJoinPage() {
  const [studentCount, setStudentCount] = useState(50);
  const [coursePrice, setCoursePrice] = useState(350);

  const totalRevenue = studentCount * coursePrice;
  const platformFeeWithOtherPlatforms = totalRevenue * 0.40;
  const platformProfitOurPlatform = totalRevenue;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Moving Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="dynamic-drift-1 absolute top-[5%] right-[15%] w-[550px] h-[550px] bg-purple-600/15 dark:bg-purple-600/20 rounded-full blur-[130px]" />
        <div className="dynamic-drift-2 absolute top-[35%] left-[10%] w-[600px] h-[600px] bg-amber-500/15 dark:bg-amber-500/15 rounded-full blur-[140px]" />
        <div className="dynamic-drift-3 absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-blue-600/15 dark:bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto text-center pt-6 pb-14 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 via-amber-500/20 to-purple-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-black shadow-lg shadow-amber-500/10 animate-bounce">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>عروض إطلاق حصرية ومحروقة لفترة محدودة للمحاضرين والمدربين 🚀</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight sm:leading-tight">
          درّس لآلاف الطلاب واحتفظ بـ{' '}
          <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 bg-clip-text text-transparent underline decoration-amber-500/50 decoration-wavy decoration-2">
            100% من أرباحك
          </span>{' '}
          مباشرة!
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed font-medium">
          وداعاً لعمولات المنصات الخيالية (30% و 50%)! في أكاديميتنا ستحصل على استوديو تعليمي سحابي متكامل، وترسل لك أموال طلابك في ثوانٍ على <span className="font-bold text-purple-600 dark:text-purple-400">انستاباي (InstaPay)</span> و <span className="font-bold text-rose-600 dark:text-rose-400">فودافون كاش</span> فوراً!
        </p>

        {/* 14-Day Free Trial Notice Banner */}
        <div className="max-w-2xl mx-auto p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-purple-900/40 border border-purple-500/50 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-right">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black text-xl shrink-0 shadow-md">
              0ج
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">ابدأ الآن بفترة تجريبية مجانية 14 يوماً!</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black">بدون فيزا</span>
              </div>
              <p className="text-xs text-zinc-300">ارفع كورساتك، استقبل الطلاب، وجرب كل مميزات المنصة بالكامل مجاناً.</p>
            </div>
          </div>
          <Link
            href="/register?role=instructor"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-zinc-950 font-black text-sm transition-all shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 whitespace-nowrap flex items-center justify-center gap-2"
          >
            <span>ابدأ الـ 14 يوماً مجاناً</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* WHY INSTRUCTORS CHOOSE US */}
      <section className="max-w-6xl mx-auto py-12">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            لماذا تختار منصتنا؟
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            كل ما تحتاجه للتحكم الكامل في تدريبك وأرباحك
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#120e24]/90 border border-slate-200 dark:border-purple-500/20 shadow-xl space-y-3 relative overflow-hidden group hover:border-amber-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Percent className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">0% عمولة على المبيعات!</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
              أنت صاحب الجهد والمحتوى، لذلك 100% من سعر الكورس يذهب لك مباشرة. نحن لا نخصم أي نسبة من مبيعات كورساتك نهائياً.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#120e24]/90 border border-slate-200 dark:border-purple-500/20 shadow-xl space-y-3 relative overflow-hidden group hover:border-amber-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">تحويل مباشر (انستاباي & كاش)</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
              يضع الطلاب إيصال التحويل على حسابك الشخصي في InstaPay أو فودافون كاش، وتوافق بضغطة زر واحدة وتستلم أموالك في جيبك لحظياً.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#120e24]/90 border border-slate-200 dark:border-purple-500/20 shadow-xl space-y-3 relative overflow-hidden group hover:border-amber-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">حماية المحتوى وسيرفرات فائقة</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
              مشغل فيديو سينمائي مشفر يمنع التحميل والسرقة، مع سرعة تشغيل فائقة الجودة على جميع الأجهزة والهواتف بدون أي تقطيع.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#120e24]/90 border border-slate-200 dark:border-purple-500/20 shadow-xl space-y-3 relative overflow-hidden group hover:border-amber-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">شهادات تخرج معتمدة لطلابك</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
              تصدر المنصة شهادات تخرج ذكية تلقائياً باسمك كمدرب للكورس، برمز تحقق QR Code رسمي يرفع ثقة الطلاب في محتواك.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#120e24]/90 border border-slate-200 dark:border-purple-500/20 shadow-xl space-y-3 relative overflow-hidden group hover:border-amber-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">كوبونات خصم وعروض خاصة بك</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
              أنشئ أكواد خصم حصرية لكورساتك مع تحديد عدد مرات الاستخدام وتاريخ الانتهاء لتشجيع الطلاب على الشراء السريع.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/90 dark:bg-[#120e24]/90 border border-slate-200 dark:border-purple-500/20 shadow-xl space-y-3 relative overflow-hidden group hover:border-amber-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">استوديو إدارة ذكي ودردشة فورية</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
              لوحة تحكم خاصة بك لإدارة المنهج والدروس والواجبات، مع نظام شات مباشر وتواصل فوري مع طلابك لتجربة تعليمية تفاعلية.
            </p>
          </div>
        </div>
      </section>

      {/* PROFIT CALCULATOR */}
      <section className="max-w-4xl mx-auto py-10">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 border border-amber-500/30 shadow-2xl space-y-8 text-white">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black">
              <TrendingUp className="w-4 h-4" />
              <span>حاسبة أرباح المحاضر التفاعلية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">احسب كم ستكسب مع نموذج الـ 0% عمولة!</h2>
            <p className="text-xs sm:text-sm text-zinc-300">قارن بين أرباحك معنا وبين المنصات التي تقتطع 40% من جهدك</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span>عدد الطلاب المتوقع:</span>
                  <span className="text-amber-400 text-base font-black">{studentCount} طالب</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={studentCount}
                  onChange={(e) => setStudentCount(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span>متوسط سعر الكورس:</span>
                  <span className="text-amber-400 text-base font-black">{coursePrice} ج.م</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={coursePrice}
                  onChange={(e) => setCoursePrice(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4 text-center">
              <div>
                <span className="text-xs text-zinc-400 block mb-1">أرباحك الصافية معنا (100% لك):</span>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                  {platformProfitOurPlatform.toLocaleString()} ج.م
                </div>
                <span className="text-[11px] text-emerald-300 font-bold">تدخل في حسابك البنكي/انستاباي فوراً!</span>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between text-xs text-zinc-400">
                <span>أرباحك في منصات أخرى (-40% عمولة):</span>
                <span className="line-through text-rose-400 font-bold">{(totalRevenue - platformFeeWithOtherPlatforms).toLocaleString()} ج.م</span>
              </div>
              <div className="text-[11px] font-bold text-amber-300 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                🚀 وفرت معنا: {platformFeeWithOtherPlatforms.toLocaleString()} ج.م عمولة كانت ستؤخذ منك!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section className="max-w-5xl mx-auto py-12 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-black">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>عرض حرق الأسعار لموسم الإطلاق 🏷️</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            اختر الخطة المناسبة وابدأ أرباحك اليوم
          </h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400">
            جميع الباقات تشمل 14 يوماً تجربة مجانية كاملة بدون أي التزام!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Plan 1: Free Trial */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#120e24] border border-slate-200 dark:border-purple-500/20 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">فترة التجربة</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 text-xs font-black">
                  مجاناً 100%
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400">لتجربة المنصة ورفع كورساتك الأولى بدون أي مخاطرة.</p>
              <div className="py-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white">0</span>
                <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 mr-1">ج.م / 14 يوماً</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-zinc-300 font-medium">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> تجربة كاملة لمدة 14 يوماً</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> رفع ونشر الكورسات</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> ربط بيانات InstaPay وفودافون كاش</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 0% عمولة على المبيعات</li>
              </ul>
            </div>
            <Link
              href="/register?role=instructor"
              className="w-full py-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-900 dark:text-white font-bold text-xs text-center transition-all"
            >
              ابدأ الـ 14 يوماً مجاناً
            </Link>
          </div>

          {/* Plan 2: Yearly */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-purple-950 via-[#161033] to-slate-950 border-2 border-amber-400 shadow-2xl shadow-amber-500/20 flex flex-col justify-between space-y-6 relative -translate-y-2">
            <div className="absolute -top-3.5 right-1/2 translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 text-xs font-black shadow-md whitespace-nowrap animate-pulse">
              🔥 الأكثر طلباً وتوفيراً (خصم 60%)
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-white">الباقة السنوية الذهبية</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black">
                  شهرين مجاناً 🎁
                </span>
              </div>
              <p className="text-xs text-zinc-300">الحل الأمثل للمحاضر المستمر لزيادة أرباحه واستقراره.</p>
              
              <div className="py-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-amber-400">1,499</span>
                  <span className="text-xs font-bold text-zinc-400">ج.م / سنة</span>
                </div>
                <div className="text-[11px] text-zinc-400 line-through mt-0.5">بدلاً من 3,999 ج.م سنوياً</div>
              </div>

              <ul className="space-y-2.5 text-xs text-zinc-200 font-medium">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> <span className="font-bold text-white">14 يوم مجاناً في البداية</span></li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> عدد كورسات وطلاب غير محدود</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> 0% عمولة نهائياً على كل مبيعاتك</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> إبراز كورساتك في الصفحة الرئيسية للمنصة</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> نظام كوبونات خصم خاص بطلابك</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 shrink-0" /> دعم فني ومساعدة VIP على مدار الساعة</li>
              </ul>
            </div>

            <Link
              href="/register?role=instructor"
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-zinc-950 font-black text-sm text-center transition-all shadow-lg shadow-amber-500/25 hover:scale-105 active:scale-95"
            >
              🚀 اشترك الآن مع 14 يوماً مجاناً
            </Link>
          </div>

          {/* Plan 3: Monthly */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#120e24] border border-slate-200 dark:border-purple-500/20 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">الباقة الشهرية</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 text-xs font-black">
                  مرونة كاملة
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400">ادفع شهراً بشهر مع إمكانية الإلغاء في أي وقت.</p>
              
              <div className="py-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">299</span>
                  <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">ج.م / شهر</span>
                </div>
                <div className="text-[11px] text-slate-400 line-through mt-0.5">بدلاً من 599 ج.م شهرياً</div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-zinc-300 font-medium">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 14 يوم تجربة مجانية في البداية</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> عدد كورسات وطلاب غير محدود</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> 0% عمولة على المبيعات</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> تحويل فوري لأرباحك عبر InstaPay وكاش</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> شهادات تخرج معتمدة لطلابك</li>
              </ul>
            </div>

            <Link
              href="/register?role=instructor"
              className="w-full py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs text-center transition-all shadow-md shadow-purple-600/20"
            >
              ابدأ بالاشتراك الشهري
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-4xl mx-auto py-12 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-indigo-900/40 border border-purple-500/40 shadow-2xl backdrop-blur-2xl space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            جاهز للانطلاق ومضاعفة أرباحك كمدرب معتمد؟ 🎓
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto">
            سجل الآن في دقيقة واحدة، واستمتع بـ 14 يوماً مجاناً وابدأ بيع أول دورة تدريبية لك اليوم!
          </p>
          <Link
            href="/register?role=instructor"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-zinc-950 font-black text-base shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <span>🚀 أنشئ حسابك كمحاضر وابدأ مجاناً</span>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
