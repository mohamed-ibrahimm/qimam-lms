import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const stateParam = url.searchParams.get('state');
  const errorParam = url.searchParams.get('error');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (req.headers.get('x-forwarded-host') ? `https://${req.headers.get('x-forwarded-host')}` : 'http://localhost:3000');

  if (errorParam || !code) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(errorParam || 'google_auth_failed')}`, req.url));
  }

  let stateObj: any = { role: 'STUDENT', callbackUrl: '' };
  try {
    if (stateParam) {
      stateObj = JSON.parse(Buffer.from(stateParam, 'base64url').toString('utf8'));
    }
  } catch {}

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${appUrl}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/auth/google-setup?error=missing_credentials', req.url));
  }

  try {
    // 1. Exchange authorization code for tokens directly with Google API
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('Google token exchange error:', tokenData);
      return NextResponse.redirect(new URL('/login?error=token_exchange_failed', req.url));
    }

    // 2. Fetch real verified user profile from Google UserInfo endpoint
    const userProfileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userProfileRes.json();
    if (!userProfileRes.ok || !googleUser.email) {
      console.error('Google userinfo fetch error:', googleUser);
      return NextResponse.redirect(new URL('/login?error=userinfo_failed', req.url));
    }

    const email = googleUser.email.toLowerCase().trim();
    const fullName = googleUser.name || `${googleUser.given_name || ''} ${googleUser.family_name || ''}`.trim() || 'مستخدم جوجل';
    const avatarUrl = googleUser.picture || null;
    const requestedRole = stateObj.role === 'INSTRUCTOR' ? 'INSTRUCTOR' : 'STUDENT';
    const isInstructor = requestedRole === 'INSTRUCTOR';

    // 3. Find or create user in Database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const generatedUsername = `google_${email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '')}_${randomSuffix}`.slice(0, 30);
      const defaultPasswordHash = await hashPassword(`google_oauth_${Date.now()}_${Math.random()}`);

      const now = new Date();
      const trialEndsAt = isInstructor ? new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) : null;

      user = await prisma.user.create({
        data: {
          email,
          officialFullName: fullName,
          firstName: googleUser.given_name || fullName.split(' ')[0] || 'مستخدم',
          lastName: googleUser.family_name || fullName.split(' ').slice(1).join(' ') || 'جوجل',
          username: generatedUsername,
          passwordHash: defaultPasswordHash,
          role: requestedRole,
          avatarUrl,
          isEmailVerified: true,
          instructorStatus: isInstructor ? 'TRIAL' : 'TRIAL',
          trialEndsAt,
          subscriptionPlan: isInstructor ? 'FREE_TRIAL' : 'FREE_TRIAL',
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_REGISTERED_GOOGLE_OAUTH',
          entity: 'USER',
          entityId: user.id,
          detailsJson: JSON.stringify({ email, provider: 'google', sub: googleUser.sub }),
        },
      });
    } else {
      // If user exists, update avatar and mark verified
      if (!user.avatarUrl && avatarUrl) {
        await prisma.user.update({
          where: { id: user.id },
          data: { avatarUrl, isEmailVerified: true },
        });
      }
    }

    // 4. Create Session Token
    const sessionToken = await createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
      officialFullName: user.officialFullName,
    });

    // 5. Determine Redirect
    let target = user.role === 'INSTRUCTOR' ? '/instructor' : user.role === 'ADMIN' ? '/admin' : '/dashboard';
    if (stateObj.callbackUrl && !stateObj.callbackUrl.startsWith('/login') && !stateObj.callbackUrl.startsWith('/register')) {
      target = stateObj.callbackUrl;
    }

    const response = NextResponse.redirect(new URL(target, req.url));
    response.cookies.set(AUTH_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (err: any) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(new URL('/login?error=oauth_error', req.url));
  }
}
