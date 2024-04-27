/*
  Warnings:

  - Changed the type of `image` on the `Activity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `image` on the `Scholarship` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "image",
ADD COLUMN     "image" BYTEA NOT NULL;

-- AlterTable
ALTER TABLE "Scholarship" DROP COLUMN "image",
ADD COLUMN     "image" BYTEA NOT NULL;
