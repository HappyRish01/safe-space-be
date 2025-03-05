/*
  Warnings:

  - Added the required column `postId` to the `WhisperComment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "WhisperComment_toId_fromId_idx";

-- AlterTable
ALTER TABLE "WhisperComment" ADD COLUMN     "postId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "WhisperComment" ADD CONSTRAINT "WhisperComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
