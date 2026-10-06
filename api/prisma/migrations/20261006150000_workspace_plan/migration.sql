-- CreateEnum
CREATE TYPE "BillingPlan" AS ENUM ('TRIAL', 'STARTER', 'GROWTH');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN "plan" "BillingPlan" NOT NULL DEFAULT 'TRIAL';
