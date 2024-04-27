/*
  Warnings:

  - You are about to drop the column `image` on the `Academic` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Academic" DROP COLUMN "image",
ADD COLUMN     "link" TEXT;
