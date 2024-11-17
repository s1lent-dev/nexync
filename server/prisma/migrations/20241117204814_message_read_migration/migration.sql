/*
  Warnings:

  - Added the required column `chatId` to the `MessageRead` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MessageRead" ADD COLUMN     "chatId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "MessageRead" ADD CONSTRAINT "MessageRead_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("chatId") ON DELETE RESTRICT ON UPDATE CASCADE;
