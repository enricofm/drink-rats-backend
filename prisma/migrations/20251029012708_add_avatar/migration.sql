/*
  Warnings:

  - You are about to drop the `produto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `datePublished` on the `postagem` table. All the data in the column will be lost.
  - You are about to drop the column `drinkId` on the `postagem` table. All the data in the column will be lost.
  - You are about to drop the column `legenda` on the `postagem` table. All the data in the column will be lost.
  - You are about to drop the column `photoPath` on the `postagem` table. All the data in the column will be lost.
  - You are about to drop the column `telephone` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `usuarios` table. All the data in the column will be lost.
  - Added the required column `beerName` to the `postagem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place` to the `postagem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `postagem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `postagem` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `usuarios` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "produto_id_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "produto";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_postagem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "beerName" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "notes" TEXT,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "postagem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_postagem" ("id", "userId") SELECT "id", "userId" FROM "postagem";
DROP TABLE "postagem";
ALTER TABLE "new_postagem" RENAME TO "postagem";
CREATE TABLE "new_usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_usuarios" ("email", "id", "name", "password") SELECT "email", "id", "name", "password" FROM "usuarios";
DROP TABLE "usuarios";
ALTER TABLE "new_usuarios" RENAME TO "usuarios";
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
