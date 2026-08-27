# 🎓 أكاديمية م / محمد إبراهيم (Qimam LMS)

منصة تعليمية متكاملة واحترافية لإدارة التعلم (Learning Management System)، مبنية بأحدث معايير الويب العالمية باستخدام **Next.js 14 (App Router)** و **TypeScript** و **Prisma ORM** و **Tailwind CSS**.

---

## ✨ المميزات الرئيسية (Key Features)

- 👑 **تصميم ملكي فخم وعصري (Royal Purple & Imperial Gold)**:
  - واجهة ليلية هادئة وجذابة مع لمعان ذهبي وبنفسجي مريح للعين.
  - شريط إخباري متحرك وديناميكي مستمر (`Dynamic Running Marquee`).
  - متجاوبة 100% مع كافة الشاشات والأجهزة (Mobile, Tablet, Desktop).

- 🔐 **نظام صلاحيات متقدم (Role-Based Access Control)**:
  - حسابات مخصصة لكل من: **مدير المنصة (ADMIN)**، **المحاضر المعتمد (INSTRUCTOR)**، **الطلاب (STUDENT)**.
  - حماية المسارات وصفحات الإدارة ولوحات التحكم عبر Next.js Middleware.

- 📚 **إدارة الكورسات والدبلومات الشاملة (Courses & Diplomas)**:
  - مشغل دروس آمن ومتطور مع تتبع نسبة الإنجاز وعلامات المائية لمنع التسريب.
  - دبلومات مهنية شاملة تجمع عدة كورسات بسعر خاص وتخفيضات استثنائية.
  - إمكانية حذف الكورسات وتعديلها مباشرة من لوحات الإدارة والمحاضر.

- 📜 **نظام الشهادات الرقمية الذكي (Digital Certificates & QR Verification)**:
  - إصدار شهادات إتمام معتمدة فور إكمال متطلبات الكورس.
  - مصمم شهادات تفاعلي في لوحة التحكم لتخصيص القوالب والنصوص والتواقيع.
  - بوابة تحقق عامة وسريعة عبر مسح رمز الـ QR أو إدخال رقم الشهادة `/verify`.

- 💳 **بوابة دفع وتسجيل مرنة (Checkout & Manual Access)**:
  - دعم وسائل الدفع المحلية والدولية (إنستاباي InstaPay، فودافون كاش Vodafone Cash، البطاقات البنكية).
  - نظام كوبونات الخصم الديناميكي.
  - خاصية منح وتفعيل الكورسات يدوياً للطلاب من قِبل إدارة الأكاديمية بنقرة واحدة.

- ⚙️ **إعدادات المنصة الديناميكية (Dynamic Platform Settings)**:
  - تخصيص اسم المنصة والسطر التعريفي وتحديثها لحظياً عبر لوحة الإدارة.
  - ربط وتخصيص قنوات التواصل (واتساب، فيسبوك، تليجرام، يوتيوب، لينكد إن، جيميل) مع زر واتساب عائم فوري.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **Frontend & Backend**: Next.js 14 (App Router, Server Actions, API Routes)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & ORM**: Prisma ORM with SQLite (Development) / PostgreSQL (Production)
- **Icons**: Lucide React
- **Authentication**: JWT Cookies & Bcrypt Password Hashing
- **QR Code & Canvas**: qrcode, canvas-confetti

---

## 🚀 التشغيل والتثبيت محلياً (Local Development)

### 1. استنساخ المشروع (Clone Repository)
```bash
git clone https://github.com/mohamed-ibrahimm/qimam-lms.git
cd qimam-lms
```

### 2. تثبيت الحزم (Install Dependencies)
```bash
npm install
```

### 3. إعداد المتغيرات البيئية (Environment Variables)
قم بنسخ ملف `.env.example` إلى `.env`:
```bash
cp .env.example .env
```

### 4. إنشاء وتحديث قاعدة البيانات (Database Setup)
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 5. تشغيل خادم التطوير (Run Development Server)
```bash
npm run dev
```
افتح المتصفح على: `http://localhost:3000`

---

## 📦 تجهيز وبناء الإنتاج (Production Deployment)

لعمل بناء رسمي للإنتاج:
```bash
npm run build
npm start
```

---

## 📋 المتغيرات البيئية (Environment Variables)

| المتغير | الوصف | مثال |
|---|---|---|
| `DATABASE_URL` | رابط الاتصال بقاعدة البيانات | `file:./dev.db` أو `postgresql://...` |
| `JWT_SECRET` | مفتاح تشفير التوكنز وجلسات المستخدمين | `super-secret-jwt-key` |
| `NEXT_PUBLIC_APP_URL` | الرابط الأساسي للمنصة المستخدم في روابط الشهادات وإعادة التعيين | `https://your-domain.com` |
| `NEXT_PUBLIC_PLATFORM_NAME` | اسم المنصة الافتراضي | `أكاديمية م / محمد إبراهيم` |
| `SMTP_HOST` | خادم البريد الإلكتروني (اختياري) | `smtp.resend.com` |
| `SMTP_PORT` | منفذ البريد الإلكتروني | `587` |
| `SMTP_USER` | اسم مستخدم البريد | `apikey` |
| `SMTP_PASS` | كلمة مرور البريد | `re_...` |
| `SMTP_FROM` | بريد الإرسال | `noreply@yourdomain.com` |

---

## 📄 الترخيص (License)
هذا المشروع مخصص للأغراض التعليمية والتجارية للأكاديمية. جميع الحقوق محفوظة © 2026.