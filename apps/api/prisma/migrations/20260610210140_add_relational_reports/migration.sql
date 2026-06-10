-- AlterTable
ALTER TABLE "User" ADD COLUMN     "coupleReportPurchased" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "groupReportPurchased" BOOLEAN NOT NULL DEFAULT false;
