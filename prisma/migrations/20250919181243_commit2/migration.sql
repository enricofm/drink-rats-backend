-- CreateTable
CREATE TABLE "postagem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "legenda" TEXT,
    "datePublished" DATETIME NOT NULL,
    "drink" TEXT NOT NULL,
    "photoPath" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "postagem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_usuarios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "telephone" TEXT,
    "password" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_usuarios" ("email", "id", "name", "telephone", "username") SELECT "email", "id", "name", "telephone", "username" FROM "usuarios";
DROP TABLE "usuarios";
ALTER TABLE "new_usuarios" RENAME TO "usuarios";
CREATE UNIQUE INDEX "usuarios_id_key" ON "usuarios"("id");
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
CREATE UNIQUE INDEX "usuarios_telephone_key" ON "usuarios"("telephone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "postagem_id_key" ON "postagem"("id");
