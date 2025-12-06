-- CreateTable
CREATE TABLE "PackagingRecords" (
    "code" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "source" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PackagingRecords_code_key" ON "PackagingRecords"("code");
