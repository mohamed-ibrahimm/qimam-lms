import React from 'react';

interface JsonLdProps {
  platformName: string;
  platformTagline: string;
  settings?: Record<string, string>;
}

export default function JsonLd({
  platformName,
  platformTagline,
  settings = {},
}: JsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mohamedibrahim-chi.vercel.app';

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      // 1. WebSite Schema with Sitelinks SearchBox (For Google Search & Answer Engines)
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: platformName,
        description: platformTagline,
        inLanguage: 'ar',
        publisher: {
          '@id': `${baseUrl}/#organization`,
        },
        potentialAction: [
          {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${baseUrl}/courses?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        ],
      },

      // 2. EducationalOrganization Schema (High-authority Entity for AI engines)
      {
        '@type': 'EducationalOrganization',
        '@id': `${baseUrl}/#organization`,
        name: platformName,
        alternateName: ['Qimam LMS', 'أكاديمية قمم التعليمية', platformName],
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/icon.svg`,
          width: '512',
          height: '512',
        },
        description: `${platformName} — ${platformTagline}. منصة تدريب هندسية معتمدة تقدم دبلومات احترافية في البرمجة، هندسة النظم، والذكاء الاصطناعي مع مشاريع عملية وسوق مذكرات رقمي.`,
        email: settings.CONTACT_EMAIL || 'support@qimam.academy',
        telephone: settings.CONTACT_PHONE || settings.WHATSAPP_NUMBER || '+201555791568',
        sameAs: [
          settings.SOCIAL_FACEBOOK || 'https://facebook.com',
          settings.SOCIAL_TELEGRAM || 'https://t.me',
          settings.SOCIAL_YOUTUBE || 'https://youtube.com',
          settings.SOCIAL_LINKEDIN || 'https://linkedin.com',
        ].filter(Boolean),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'المسارات والدبلومات الهندسية',
          itemListElement: [
            {
              '@type': 'Course',
              name: 'دبلومة هندسة البرمجيات والذكاء الاصطناعي الشاملة',
              description: 'مسار تدريبي متكامل يؤهلك لسوق العمل من الصفر حتى بناء أنظمة إنتاجية حقيقية وشهادات معتمدة برمز QR.',
              provider: {
                '@type': 'Organization',
                name: platformName,
                sameAs: baseUrl,
              },
              educationalCredentialAwarded: 'شهادة إتمام هندسية معتمدة برمز تحقق QR',
              inLanguage: 'ar',
            },
            {
              '@type': 'Course',
              name: 'سوق المذكرات والكتب الهندسية الرقمية',
              description: 'مكتبة رقمية مشفرة ومحمية تتيح معاينة وتحميل وقراءة أحدث المذكرات البرمجية والكتب الهندسية.',
              provider: {
                '@type': 'Organization',
                name: platformName,
              },
              inLanguage: 'ar',
            },
          ],
        },
      },

      // 3. FAQPage Schema (Answer Engine Optimization for AI Overviews, Perplexity & ChatGPT)
      {
        '@type': 'FAQPage',
        '@id': `${baseUrl}/#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: `ما هي ${platformName} وما الخدمات التي تقدمها؟`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${platformName} هي منصة تدريب هندسية تعليمية معتمدة متخصصة في تقديم دبلومات برمجية عملية، كورسات في هندسة النظم والذكاء الاصطناعي، وسوق مذكرات وكتب رقمية مع شهادات إتمام معتمدة موثقة برمز QR.`,
            },
          },
          {
            '@type': 'Question',
            name: 'هل الشهادات الصادرة من المنصة معتمدة وموثقة؟',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'نعم، جميع شهادات إتمام الكورسات والدبلومات تصدر بكود استعلام وتحقق رقمي فوري ورمز QR معتمد يثبت مصداقية التدريب وإنجاز المشاريع العملية.',
            },
          },
          {
            '@type': 'Question',
            name: 'كيف يمكن الانضمام كـ مدرس أو كـ محاضر طالب؟',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'يمكنك الانضمام مباشرة من خلال صفحة الانضمام للمحاضرين، حيث تمنحك الأكاديمية فترة تجريبية مجانية 14 يوماً واستوديو تدريس سحابي مستقل مع عمولة 0% وميزات إدارة الكوبونات ومتابعة الطلاب.',
            },
          },
          {
            '@type': 'Question',
            name: 'ما هي طرق الدفع المتاحة للاشتراك في الكورسات والمذكرات؟',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'تدعم المنصة جميع وسائل الدفع الإلكتروني الحديثة بما في ذلك المحافظ الإلكترونية (فودافون كاش، أورنج كاش، اتصالات كاش، وي باي)، البطاقات الائتمانية، وإنستاباي (InstaPay) مع تفعيل فوري للاشتراك.',
            },
          },
        ],
      },

      // 4. Speakable Specification (For Voice Search & Answer Engines Summarization)
      {
        '@type': 'WebPage',
        '@id': `${baseUrl}/#webpage`,
        url: baseUrl,
        name: platformName,
        isPartOf: {
          '@id': `${baseUrl}/#website`,
        },
        about: {
          '@id': `${baseUrl}/#organization`,
        },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['h1', 'p.lead', 'meta[name="description"]'],
        },
        inLanguage: 'ar',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
