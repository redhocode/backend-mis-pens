-- CreateTable
CREATE TABLE "Academic" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "username" TEXT,

    CONSTRAINT "Academic_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Academic" ADD CONSTRAINT "Academic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
