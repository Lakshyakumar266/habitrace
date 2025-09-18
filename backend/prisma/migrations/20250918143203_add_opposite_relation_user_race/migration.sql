-- CreateTable
CREATE TABLE "public"."races" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "races_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."participants" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "raceId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."checkins" (
    "id" TEXT NOT NULL,
    "participationId" TEXT NOT NULL,
    "checkinDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "checkins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "participants_userId_raceId_key" ON "public"."participants"("userId", "raceId");

-- CreateIndex
CREATE UNIQUE INDEX "checkins_participationId_checkinDate_key" ON "public"."checkins"("participationId", "checkinDate");

-- AddForeignKey
ALTER TABLE "public"."races" ADD CONSTRAINT "races_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."participants" ADD CONSTRAINT "participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."participants" ADD CONSTRAINT "participants_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "public"."races"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checkins" ADD CONSTRAINT "checkins_participationId_fkey" FOREIGN KEY ("participationId") REFERENCES "public"."participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
