-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "receivedAwardId" TEXT;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_receivedAwardId_fkey" FOREIGN KEY ("receivedAwardId") REFERENCES "Scholarship"("id") ON DELETE SET NULL ON UPDATE CASCADE;
