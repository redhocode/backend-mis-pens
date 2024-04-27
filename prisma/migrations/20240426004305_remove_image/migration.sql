/*
  Warnings:

  - You are about to drop the column `image` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Scholarship` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "Scholarship" DROP COLUMN "image";
