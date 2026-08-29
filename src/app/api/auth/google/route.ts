import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const role = url.searchParams.get('role') || 'STUDENT';
  const callbackUrl = url.searchParams.get('callbackUrl') || '';

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (req.headers.get('x-forwarded-host') ? `https://${req.headers.get('x-forwarded-host')}` : 'http://localhost:3000');
  const redirectUri = `${appUrl}/api/auth/google/callback`;

  // If GOOGLE_CLIENT_ID is not configured yet, redirect to the Google setup instructions page
  if (!clientId) {
    return NextResponse.redirect(
      new URL(`/auth/google-setup?role=${role}&callbackUrl=${encodeURIComponent(callbackUrl)}`, req.url)
    );
  }

  const stateObj = {
    role,
    callbackUrl,
    nonce: Math.random().toString(36).substring(2),
  };
  const state = Buffer.from(JSON.stringify(stateObj)).toString('base64url');

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('prompt', 'select_account'); // Forces real Google Account Chooser
  googleAuthUrl.searchParams.set('access_type', 'online');
  googleAuthUrl.searchParams.set('state', state);

  return NextResponse.redirect(googleAuthUrl.toString());
}
