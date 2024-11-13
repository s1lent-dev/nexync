-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "tagline" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "bio" SET DEFAULT 'Hey there! I''m using Nexync.';
