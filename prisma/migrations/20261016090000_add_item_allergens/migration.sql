-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "allergens" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "allergensConfirmed" BOOLEAN NOT NULL DEFAULT false;
