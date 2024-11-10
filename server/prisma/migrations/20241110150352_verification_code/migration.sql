-- CreateTable
CREATE TABLE "verificationCode" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT now() + INTERVAL '1 minute',

    CONSTRAINT "verificationCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verificationCode_email_key" ON "verificationCode"("email");

-- CreateIndex
CREATE INDEX "verificationCode_expiresAt_idx" ON "verificationCode"("expiresAt");
