/*
  Warnings:

  - Added the required column `publicId` to the `Ads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ads" ADD COLUMN     "publicId" TEXT NOT NULL;
