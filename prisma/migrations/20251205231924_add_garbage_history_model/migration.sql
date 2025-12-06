-- CreateTable
CREATE TABLE "GarbageHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "garbageType" TEXT NOT NULL,
    "garbageSubtype" TEXT NOT NULL,
    "garbageState" TEXT NOT NULL,
    "coinAmount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GarbageHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GarbageHistory_userId_idx" ON "GarbageHistory"("userId");

-- AddForeignKey
ALTER TABLE "GarbageHistory" ADD CONSTRAINT "GarbageHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
