/*
  Warnings:

  - You are about to drop the `PackagingRecords` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "PackagingRecords";

-- CreateTable
CREATE TABLE "packaging_records" (
    "code" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "source" TEXT NOT NULL,
    "updated_ats" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "packaging_records_code_key" ON "packaging_records"("code");
