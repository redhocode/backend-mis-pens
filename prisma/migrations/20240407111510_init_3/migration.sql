/*
  Warnings:

  - Added the required column `date` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Scholarship` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "date" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Scholarship" ADD COLUMN     "date" TEXT NOT NULL;
