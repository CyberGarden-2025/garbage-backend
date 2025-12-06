/*
  Warnings:

  - You are about to drop the `RecognitionTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "RecognitionTask";

-- CreateTable
CREATE TABLE "advice" (
    "garbage_type" TEXT NOT NULL,
    "garbage_subtype" TEXT NOT NULL,
    "garbage_state" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "advice_pkey" PRIMARY KEY ("garbage_type","garbage_subtype","garbage_state")
);
