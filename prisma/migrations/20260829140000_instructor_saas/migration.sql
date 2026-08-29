-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "instructorStatus" TEXT NOT NULL DEFAULT 'TRIAL';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "trialEndsAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "subscriptionPlan" TEXT NOT NULL DEFAULT 'FREE_TRIAL';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "subscriptionEndsAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "instapayAddress" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "instapayName" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "vodafoneCashNumber" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "paymentInstructions" TEXT;

-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN IF NOT EXISTS "instructorId" TEXT;

-- CreateTable
CREATE TABLE IF NOT EXISTS "InstructorSubscriptionPayment" (
    "id" TEXT NOT NULL,
    "instructorId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "transactionId" TEXT,
    "screenshotUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "durationMonths" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstructorSubscriptionPayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Coupon_instructorId_fkey') THEN
    ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'InstructorSubscriptionPayment_instructorId_fkey') THEN
    ALTER TABLE "InstructorSubscriptionPayment" ADD CONSTRAINT "InstructorSubscriptionPayment_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'InstructorSubscriptionPayment_reviewedById_fkey') THEN
    ALTER TABLE "InstructorSubscriptionPayment" ADD CONSTRAINT "InstructorSubscriptionPayment_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
