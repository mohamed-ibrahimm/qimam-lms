import { prisma } from './prisma';

export interface InstructorSubscriptionState {
  active: boolean;
  status: 'ADMIN' | 'ACTIVE' | 'TRIAL' | 'EXPIRED' | 'PAUSED';
  plan: string;
  daysRemaining: number;
  expiresAt: Date | null;
  canCreateCourse: boolean;
  canAcceptOrders: boolean;
}

export function evaluateInstructorSubscription(user: any): InstructorSubscriptionState {
  if (!user) {
    return {
      active: false,
      status: 'EXPIRED',
      plan: 'NONE',
      daysRemaining: 0,
      expiresAt: null,
      canCreateCourse: false,
      canAcceptOrders: false,
    };
  }

  // Admin has unlimited permanent access
  if (user.role === 'ADMIN') {
    return {
      active: true,
      status: 'ADMIN',
      plan: 'LIFETIME_ADMIN',
      daysRemaining: 9999,
      expiresAt: null,
      canCreateCourse: true,
      canAcceptOrders: true,
    };
  }

  const now = new Date();

  // Check paid active subscription
  if (user.instructorStatus === 'ACTIVE' && user.subscriptionEndsAt) {
    const subEnd = new Date(user.subscriptionEndsAt);
    if (subEnd > now) {
      const diffMs = subEnd.getTime() - now.getTime();
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return {
        active: true,
        status: 'ACTIVE',
        plan: user.subscriptionPlan || 'MONTHLY',
        daysRemaining: Math.max(0, days),
        expiresAt: subEnd,
        canCreateCourse: true,
        canAcceptOrders: true,
      };
    }
  }

  // Check 14-day free trial
  const trialEnd = user.trialEndsAt
    ? new Date(user.trialEndsAt)
    : new Date(new Date(user.createdAt || now).getTime() + 14 * 24 * 60 * 60 * 1000);

  if (trialEnd > now && user.instructorStatus !== 'PAUSED') {
    const diffMs = trialEnd.getTime() - now.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return {
      active: true,
      status: 'TRIAL',
      plan: 'FREE_TRIAL_14D',
      daysRemaining: Math.max(0, days),
      expiresAt: trialEnd,
      canCreateCourse: true,
      canAcceptOrders: true,
    };
  }

  // Expired
  return {
    active: false,
    status: 'EXPIRED',
    plan: user.subscriptionPlan || 'EXPIRED',
    daysRemaining: 0,
    expiresAt: trialEnd,
    canCreateCourse: false,
    canAcceptOrders: false,
  };
}

export async function getInstructorPaymentConfig(instructorId?: string | null) {
  // Default platform settings
  let defaultSettings: Record<string, string> = {};
  try {
    const settings = await prisma.platformSetting.findMany();
    defaultSettings = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  } catch (e) {}

  if (!instructorId) {
    return {
      isCustomInstructor: false,
      instapayAddress: defaultSettings['INSTAPAY_ACCOUNT'] || 'qimam.edu@instapay',
      instapayName: defaultSettings['INSTAPAY_NAME'] || 'أكاديمية م / محمد إبراهيم',
      instapayInstructions: defaultSettings['INSTAPAY_INSTRUCTIONS'] || 'يرجى تحويل المبلغ بدقة لعنوان الدفع ثم كتابة رقم العملية ورفع لقطة الشاشة.',
      vodafoneCashNumber: defaultSettings['VODAFONE_CASH_NUMBER'] || '01555791568',
      vodafoneCashName: defaultSettings['VODAFONE_CASH_NAME'] || 'أكاديمية م / محمد إبراهيم',
      vodafoneCashInstructions: defaultSettings['VODAFONE_CASH_INSTRUCTIONS'] || 'قم بالتحويل لرقم المحفظة وأدخل رقم العملية وصورة الإيصال.',
      whatsappNumber: defaultSettings['WHATSAPP_NUMBER'] || '01555791568',
    };
  }

  try {
    const instructor = await prisma.user.findUnique({
      where: { id: instructorId },
      select: {
        id: true,
        role: true,
        officialFullName: true,
        firstName: true,
        instapayAddress: true,
        instapayName: true,
        vodafoneCashNumber: true,
        paymentInstructions: true,
        phone: true,
      }
    });

    if (!instructor) {
      return {
        isCustomInstructor: false,
        instapayAddress: defaultSettings['INSTAPAY_ACCOUNT'] || 'qimam.edu@instapay',
        instapayName: defaultSettings['INSTAPAY_NAME'] || 'أكاديمية م / محمد إبراهيم',
        instapayInstructions: defaultSettings['INSTAPAY_INSTRUCTIONS'] || '',
        vodafoneCashNumber: defaultSettings['VODAFONE_CASH_NUMBER'] || '01555791568',
        vodafoneCashName: defaultSettings['VODAFONE_CASH_NAME'] || 'أكاديمية م / محمد إبراهيم',
        vodafoneCashInstructions: defaultSettings['VODAFONE_CASH_INSTRUCTIONS'] || '',
        whatsappNumber: defaultSettings['WHATSAPP_NUMBER'] || '01555791568',
      };
    }

    const hasCustomPayments = Boolean(instructor.instapayAddress || instructor.vodafoneCashNumber);

    return {
      isCustomInstructor: hasCustomPayments && instructor.role !== 'ADMIN',
      instructorName: instructor.officialFullName || instructor.firstName,
      instapayAddress: instructor.instapayAddress || defaultSettings['INSTAPAY_ACCOUNT'] || 'qimam.edu@instapay',
      instapayName: instructor.instapayName || instructor.officialFullName || defaultSettings['INSTAPAY_NAME'] || 'أكاديمية م / محمد إبراهيم',
      instapayInstructions: instructor.paymentInstructions || defaultSettings['INSTAPAY_INSTRUCTIONS'] || '',
      vodafoneCashNumber: instructor.vodafoneCashNumber || defaultSettings['VODAFONE_CASH_NUMBER'] || '01555791568',
      vodafoneCashName: instructor.officialFullName || defaultSettings['VODAFONE_CASH_NAME'] || 'أكاديمية م / محمد إبراهيم',
      vodafoneCashInstructions: instructor.paymentInstructions || defaultSettings['VODAFONE_CASH_INSTRUCTIONS'] || '',
      whatsappNumber: instructor.phone || defaultSettings['WHATSAPP_NUMBER'] || '01555791568',
    };
  } catch (e) {
    return {
      isCustomInstructor: false,
      instapayAddress: defaultSettings['INSTAPAY_ACCOUNT'] || 'qimam.edu@instapay',
      instapayName: defaultSettings['INSTAPAY_NAME'] || 'أكاديمية م / محمد إبراهيم',
      instapayInstructions: defaultSettings['INSTAPAY_INSTRUCTIONS'] || '',
      vodafoneCashNumber: defaultSettings['VODAFONE_CASH_NUMBER'] || '01555791568',
      vodafoneCashName: defaultSettings['VODAFONE_CASH_NAME'] || 'أكاديمية م / محمد إبراهيم',
      vodafoneCashInstructions: defaultSettings['VODAFONE_CASH_INSTRUCTIONS'] || '',
      whatsappNumber: defaultSettings['WHATSAPP_NUMBER'] || '01555791568',
    };
  }
}
