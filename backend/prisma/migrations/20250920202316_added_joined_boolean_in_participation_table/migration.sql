/*
  Warnings:

  - Added the required column `joined` to the `participants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."participants" ADD COLUMN     "joined" BOOLEAN NOT NULL;
