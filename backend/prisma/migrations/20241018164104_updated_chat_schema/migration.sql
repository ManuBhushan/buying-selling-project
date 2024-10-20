/*
  Warnings:

  - You are about to drop the column `conversationId` on the `Messages` table. All the data in the column will be lost.
  - You are about to drop the `Conversation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `adId` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_conversationId_fkey";

-- DropIndex
DROP INDEX "Messages_conversationId_key";

-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "conversationId",
ADD COLUMN     "adId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "participants" INTEGER[];

-- DropTable
DROP TABLE "Conversation";

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
