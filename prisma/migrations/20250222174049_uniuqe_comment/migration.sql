/*
  Warnings:

  - A unique constraint covering the columns `[comment,postId,userId]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Comment_comment_postId_userId_key" ON "Comment"("comment", "postId", "userId");
