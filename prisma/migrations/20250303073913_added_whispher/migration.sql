-- CreateTable
CREATE TABLE "WhisperComment" (
    "id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhisperComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WhisperComment_toId_fromId_idx" ON "WhisperComment"("toId", "fromId");

-- AddForeignKey
ALTER TABLE "WhisperComment" ADD CONSTRAINT "WhisperComment_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
