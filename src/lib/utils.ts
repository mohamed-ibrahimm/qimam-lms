import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: string = 'ج.م'): string {
  if (amount === 0) return 'مجانـاً';
  return `${amount.toLocaleString('ar-EG')} ${currency}`;
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatDuration(hours: number): string {
  if (hours <= 0) return 'أقل من ساعة';
  if (hours === 1) return 'ساعة واحدة';
  if (hours === 2) return 'ساعتان';
  if (hours <= 10) return `${hours} ساعات`;
  return `${hours} ساعة`;
}

export function formatSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function generateRandomCouponCode(prefix: string = 'QIMAM'): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${randomPart}`;
}

export function generateCertificateNumber(prefix: string = 'QIMAM-CERT'): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${randomNum}`;
}

export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [name, domain] = email.split('@');
  if (name.length <= 2) return `${name[0]}*@${domain}`;
  const maskedName = name[0] + '*'.repeat(Math.max(1, name.length - 2)) + name[name.length - 1];
  return `${maskedName}@${domain}`;
}