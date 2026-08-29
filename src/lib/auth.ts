import { cookies, headers } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'qimam-super-secure-production-ready-jwt-secret-key-2026'
);

export const AUTH_COOKIE_NAME = 'qimam_session';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  username: string;
  officialFullName: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  let token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    const headerList = headers();
    const authHeader = headerList.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload?.userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        fatherName: true,
        lastName: true,
        officialFullName: true,
        username: true,
        phone: true,
        avatarUrl: true,
        bio: true,
        isEmailVerified: true,
        parentNotificationEnabled: true,
        createdAt: true,
      }
    });
    if (!user && payload.userId.startsWith('demo-')) {
      return {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
        firstName: payload.username || 'مستخدم',
        fatherName: null,
        lastName: '',
        officialFullName: payload.officialFullName || payload.email,
        username: payload.username || 'user',
        phone: '',
        avatarUrl: null,
        bio: '',
        isEmailVerified: true,
        parentNotificationEnabled: false,
        createdAt: new Date(),
      };
    }
    return user;
  } catch (error) {
    if (payload?.userId?.startsWith('demo-')) {
      return {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
        firstName: payload.username || 'مستخدم',
        fatherName: null,
        lastName: '',
        officialFullName: payload.officialFullName || payload.email,
        username: payload.username || 'user',
        phone: '',
        avatarUrl: null,
        bio: '',
        isEmailVerified: true,
        parentNotificationEnabled: false,
        createdAt: new Date(),
      };
    }
    return null;
  }
}

export async function requireAuth(allowedRoles?: string[]) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error('FORBIDDEN');
  }
  return user;
}