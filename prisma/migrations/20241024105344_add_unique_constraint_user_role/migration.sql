/*
  Warnings:

  - A unique constraint covering the columns `[userId,groupId]` on the table `UserRole` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_groupId_key" ON "UserRole"("userId", "groupId");
