'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, ShieldCheck, GraduationCap, UserCheck, ShieldAlert, ArrowUpDown, Filter } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const loadUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (roleFilter) params.set('role', roleFilter);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers();
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    setMessage('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        setMessage('تم تعديل دور وصلاحيات المستخدم بنجاح! ✅');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (e) {
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-primary-400" />
            إدارة المستخدمين والطلاب وهيئة التدريس (Users & RBAC)
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            التحكم في حسابات الطلاب، ترقية المحاضرين، ضبط صلاحيات المشرفين، ومتابعة تسجيلات المنصة.
          </p>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-lg">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو البريد أو اسم المستخدم أو الهاتف..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-amber-400"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-500 shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-surface-raised border border-border text-white text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="">جميع الأدوار ({users.length})</option>
            <option value="STUDENT">الطلاب فقط (Students)</option>
            <option value="INSTRUCTOR">المحاضرين (Instructors)</option>
            <option value="ADMIN">المشرفين (Admins)</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-surface border border-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-raised/60 text-zinc-400">
                <th className="p-4">المستخدم</th>
                <th className="p-4">البريد الإلكتروني</th>
                <th className="p-4">الدور الحالي (Role)</th>
                <th className="p-4">الكورسات المشترك بها</th>
                <th className="p-4">تاريخ الانضمام</th>
                <th className="p-4 text-left">تعديل الصلاحية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-400">جاري تحميل قائمة المستخدمين...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-400">لا يوجد مستخدمون يطابقون معايير البحث.</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-raised/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-amber-400">
                          {u.firstName?.[0] || 'م'}
                        </div>
                        <div>
                          <p className="font-bold text-white">{u.officialFullName || `${u.firstName} ${u.lastName}`}</p>
                          <p className="text-[11px] text-zinc-500 font-mono">@{u.username}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-zinc-300">{u.email}</td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-amber-950/80 border border-amber-600 text-amber-300'
                            : u.role === 'INSTRUCTOR'
                            ? 'bg-purple-950/80 border border-purple-600 text-purple-300'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {u.role === 'ADMIN' && <ShieldAlert className="w-3 h-3" />}
                        {u.role === 'INSTRUCTOR' && <GraduationCap className="w-3 h-3" />}
                        {u.role === 'STUDENT' && <UserCheck className="w-3 h-3" />}
                        <span>{u.role === 'ADMIN' ? 'مدير المنصة' : u.role === 'INSTRUCTOR' ? 'محاضر معتمد' : 'طالب'}</span>
                      </span>
                    </td>

                    <td className="p-4 font-mono text-amber-400 font-bold">
                      {u._count?.enrollments || 0} كورس
                    </td>

                    <td className="p-4 text-zinc-400">{formatDate(u.createdAt)}</td>

                    <td className="p-4 text-left">
                      <select
                        disabled={updatingId === u.id}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-[11px] focus:outline-none focus:border-amber-400"
                      >
                        <option value="STUDENT">طالب (STUDENT)</option>
                        <option value="INSTRUCTOR">محاضر (INSTRUCTOR)</option>
                        <option value="ADMIN">مدير (ADMIN)</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
