/*
  Warnings:

  - You are about to drop the column `updated_ats` on the `packaging_records` table. All the data in the column will be lost.
  - You are about to drop the `GarbageHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `packaging_records` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GarbageHistory" DROP CONSTRAINT "GarbageHistory_userId_fkey";

-- AlterTable
ALTER TABLE "packaging_records" DROP COLUMN "updated_ats",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "GarbageHistory";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "hashed_password" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "garbage_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "garbage_type" TEXT NOT NULL,
    "garbage_subtype" TEXT NOT NULL,
    "garbage_state" TEXT NOT NULL,
    "coin_amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "garbage_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_name_key" ON "user"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_login_key" ON "user"("login");

-- CreateIndex
CREATE INDEX "garbage_history_user_id_idx" ON "garbage_history"("user_id");

-- AddForeignKey
ALTER TABLE "garbage_history" ADD CONSTRAINT "garbage_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
