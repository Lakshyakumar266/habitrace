/*
  Warnings:

  - A unique constraint covering the columns `[raceSlug]` on the table `races` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `raceSlug` to the `races` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."races" ADD COLUMN     "raceSlug" VARCHAR(300) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "races_raceSlug_key" ON "public"."races"("raceSlug");
