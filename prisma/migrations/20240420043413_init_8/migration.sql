/*
  Warnings:

  - You are about to drop the column `accestoken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refreshtoken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "accestoken",
DROP COLUMN "refreshtoken";
