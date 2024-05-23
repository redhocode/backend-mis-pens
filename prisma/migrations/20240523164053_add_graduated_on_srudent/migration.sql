/*
  Warnings:

  - You are about to drop the column `graduted` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "graduted",
ADD COLUMN     "graduated" INTEGER;
