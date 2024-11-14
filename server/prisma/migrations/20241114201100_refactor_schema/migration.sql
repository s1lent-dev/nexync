/*
  Warnings:

  - The values [VIDEO,AUDIO,FILE,LOCATION,CONTACT] on the enum `MessageType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `groupMessages` on the `Chat` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MessageType_new" AS ENUM ('TEXT', 'IMAGE', 'GROUP');
ALTER TABLE "Message" ALTER COLUMN "messageType" TYPE "MessageType_new" USING ("messageType"::text::"MessageType_new");
ALTER TYPE "MessageType" RENAME TO "MessageType_old";
ALTER TYPE "MessageType_new" RENAME TO "MessageType";
DROP TYPE "MessageType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "groupMessages";
