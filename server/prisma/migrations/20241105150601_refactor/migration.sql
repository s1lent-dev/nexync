/*
  Warnings:

  - The primary key for the `followRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `followRequest` table. All the data in the column will be lost.
  - The required column `requestId` was added to the `followRequest` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "followRequest" DROP CONSTRAINT "followRequest_pkey",
DROP COLUMN "id",
ADD COLUMN     "requestId" TEXT NOT NULL,
ADD CONSTRAINT "followRequest_pkey" PRIMARY KEY ("requestId");
