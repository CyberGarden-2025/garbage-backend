-- CreateTable
CREATE TABLE "RecognitionTask" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "result" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecognitionTask_pkey" PRIMARY KEY ("id")
);
