-- CreateTable
CREATE TABLE "SiteEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "href" TEXT,
    "linkLabel" TEXT,
    "metricName" TEXT,
    "metricValue" DOUBLE PRECISION,
    "referrerHost" TEXT,
    "countryCode" TEXT,
    "countryName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SiteEvent_type_createdAt_idx" ON "SiteEvent"("type", "createdAt");
