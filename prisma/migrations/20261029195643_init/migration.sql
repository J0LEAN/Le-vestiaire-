-- CreateTable
CREATE TABLE "Outfit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "whyItWorks" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "occasion" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "budget" INTEGER,
    "mainImage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'brouillon',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "outfitId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "brand" TEXT,
    "price" REAL,
    "imageUrl" TEXT,
    "url" TEXT NOT NULL,
    "isAffiliate" BOOLEAN NOT NULL DEFAULT false,
    "linkStatus" TEXT NOT NULL DEFAULT 'inconnu',
    "linkError" TEXT,
    "linkCheckedAt" DATETIME,
    CONSTRAINT "Item_outfitId_fkey" FOREIGN KEY ("outfitId") REFERENCES "Outfit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Outfit_slug_key" ON "Outfit"("slug");

-- CreateIndex
CREATE INDEX "Outfit_status_publishedAt_idx" ON "Outfit"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "Item_outfitId_idx" ON "Item"("outfitId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_email_key" ON "Subscriber"("email");
