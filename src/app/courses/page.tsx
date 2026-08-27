import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatPrice, formatDuration } from '@/lib/utils';
import { Search, Filter, BookOpen, Clock, Layers, Star } from 'lucide-react';

interface Props {
  searchParams: {
    q?: string;
    category?: string;
    level?: string;
    sort?: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function CoursesPage({ searchParams }: Props) {
  const q = searchParams.q || '';
  const categorySlug = searchParams.category || '';
  const level = searchParams.level || '';
  const sort = searchParams.sort || 'newest';

  const where: any = {
    status: 'PUBLISHED',
  };

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { shortDescription: { contains: q } },
    ];
  }

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (level && level !== 'ALL') {
    where.level = level;
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price-low') orderBy = { price: 'asc' };
  if (sort === 'price-high') orderBy = { price: 'desc' };
  if (sort === 'duration') orderBy = { durationHours: 'desc' };

  let courses: any[] = [];
  let categories: any[] = [];
  try {
    const res = await Promise.all([
      prisma.course.findMany({
        where,
        orderBy,
        include: {
          instructor: { select: { officialFullName: true, avatarUrl: true } },
          category: true,
          _count: { select: { sections: true, enrollments: true } },
        },
      }),
      prisma.category.findMany({ orderBy: { orderIndex: 'asc' } }),
    ]);
    courses = res[0];
    categories = res[1];
  } catch (e) {
    console.error('Failed to fetch courses:', e);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-black text-white">دليل الكورسات التدريبية</h1>
          <p className="text-xs text-zinc-400 mt-1">
            استكشف الدورات البرمجية والتقنية المطابقة لسوق العمل من الصفر حتى الاحتراف
          </p>
        </div>

        {/* Search Bar */}
        <form className="w-full md:w-96 relative">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="ابحث عن اسم الكورس أو الموضوع..."
            className="w-full pl-4 pr-10 py-3 rounded-2xl bg-surface border border-border text-white text-xs focus:outline-none focus:border-primary-500"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3.5" />
          {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
          {level && <input type="hidden" name="level" value={level} />}
        </form>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <span className="text-xs font-bold text-zinc-400 pl-2">التصنيف:</span>
        <Link
          href="/courses"
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            !categorySlug ? 'bg-primary-600 text-white' : 'bg-surface-raised text-zinc-300 hover:bg-surface-card'
          }`}
        >
          الكل ({courses.length})
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/courses?category=${cat.slug}${q ? `&q=${q}` : ''}${level ? `&level=${level}` : ''}`}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              categorySlug === cat.slug
                ? 'bg-primary-600 text-white'
                : 'bg-surface-raised text-zinc-300 hover:bg-surface-card'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-surface border border-border space-y-4">
          <BookOpen className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">لم يتم العثور على كورسات مطابقة</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً لعرض المحتوى المتاح.
          </p>
          <Link
            href="/courses"
            className="inline-block px-5 py-2 rounded-xl bg-primary-600 text-white text-xs font-bold"
          >
            إعادة تعيين الفلاتر
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="glass-card rounded-2xl p-5 flex flex-col justify-between overflow-hidden"
            >
              <div className="space-y-4">
                <div className="relative h-44 rounded-xl overflow-hidden bg-zinc-900">
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  {course.category && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-[11px] font-bold text-zinc-200 border border-white/10">
                      {course.category.name}
                    </span>
                  )}
                  <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-purple-950/80 backdrop-blur-md text-[10px] font-bold text-purple-300 border border-purple-800/60">
                    {course.level === 'BEGINNER' ? 'مبتدئ' : course.level === 'INTERMEDIATE' ? 'متوسط' : course.level === 'ADVANCED' ? 'متقدم' : 'شامل لجميع المستويات'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary-400" />
                      {formatDuration(course.durationHours)}
                    </span>
                    <span>•</span>
                    <span>{course._count.sections} وحدات</span>
                    <span>•</span>
                    <span>{course._count.enrollments} طالب مسجل</span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {course.shortDescription || course.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1 text-xs text-zinc-300">
                  <div className="w-6 h-6 rounded-full bg-primary-900 border border-primary-700 flex items-center justify-center text-[10px] font-bold text-white">
                    {course.instructor.officialFullName[0]}
                  </div>
                  <span className="truncate">{course.instructor.officialFullName}</span>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-zinc-400">سعر الاشتراك</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-black text-white">{formatPrice(course.price)}</span>
                    {course.compareAtPrice && (
                      <span className="text-xs text-zinc-500 line-through">
                        {formatPrice(course.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/courses/${course.slug}`}
                  className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold transition-all shadow-md shadow-primary-900/30"
                >
                  تفاصيل الكورس
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}