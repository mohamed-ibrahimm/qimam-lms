import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { clientId, clientSecret } = await req.json();

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'يرجى إدخال Client ID و Client Secret' }, { status: 400 });
    }

    const envPath = path.join(process.cwd(), '.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Update or append GOOGLE_CLIENT_ID
    if (envContent.includes('GOOGLE_CLIENT_ID=')) {
      envContent = envContent.replace(/GOOGLE_CLIENT_ID=.*/g, `GOOGLE_CLIENT_ID="${clientId.trim()}"`);
    } else {
      envContent += `\nGOOGLE_CLIENT_ID="${clientId.trim()}"`;
    }

    // Update or append GOOGLE_CLIENT_SECRET
    if (envContent.includes('GOOGLE_CLIENT_SECRET=')) {
      envContent = envContent.replace(/GOOGLE_CLIENT_SECRET=.*/g, `GOOGLE_CLIENT_SECRET="${clientSecret.trim()}"`);
    } else {
      envContent += `\nGOOGLE_CLIENT_SECRET="${clientSecret.trim()}"`;
    }

    fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf8');

    // Update current process env
    process.env.GOOGLE_CLIENT_ID = clientId.trim();
    process.env.GOOGLE_CLIENT_SECRET = clientSecret.trim();

    return NextResponse.json({ success: true, message: 'تم حفظ إعدادات ربط Google بنجاح!' });
  } catch (err: any) {
    console.error('Error saving Google keys:', err);
    return NextResponse.json({ error: 'فشل حفظ الإعدادات' }, { status: 500 });
  }
}
