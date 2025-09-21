/*
  Warnings:

  - Added the required column `frequency` to the `races` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Racefrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- AlterTable
ALTER TABLE "public"."races" ADD COLUMN     "frequency" "public"."Racefrequency" NOT NULL;
