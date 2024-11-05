/*
  Warnings:

  - You are about to drop the column `isGroup` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `notifications` on the `UserChat` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "chatType" AS ENUM ('PRIVATE', 'GROUP');

-- DropIndex
DROP INDEX "Chat_isGroup_idx";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "isGroup",
ADD COLUMN     "chatType" "chatType" NOT NULL DEFAULT 'PRIVATE';

-- AlterTable
ALTER TABLE "UserChat" DROP COLUMN "notifications";

-- CreateIndex
CREATE INDEX "Chat_chatType_idx" ON "Chat"("chatType");
