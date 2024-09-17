-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('nomecompleto', 'cpf', 'cnpj', 'datadeadmissao', 'dataderecisao', 'data', 'dia', 'mes', 'ano', 'prateleira', 'caixa', 'pasta');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'CREATOR';

-- CreateTable
CREATE TABLE "Sector" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Sector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileTemplate" (
    "id" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "sectorId" TEXT NOT NULL,

    CONSTRAINT "FileTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Field" (
    "id" TEXT NOT NULL,
    "fieldType" "FieldType" NOT NULL,
    "fieldLabel" TEXT NOT NULL,
    "fileTemplateId" TEXT NOT NULL,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "fileTemplateId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "commonId" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SectorToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Sector_name_key" ON "Sector"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_SectorToUser_AB_unique" ON "_SectorToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SectorToUser_B_index" ON "_SectorToUser"("B");

-- AddForeignKey
ALTER TABLE "FileTemplate" ADD CONSTRAINT "FileTemplate_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_fileTemplateId_fkey" FOREIGN KEY ("fileTemplateId") REFERENCES "FileTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_fileTemplateId_fkey" FOREIGN KEY ("fileTemplateId") REFERENCES "FileTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SectorToUser" ADD CONSTRAINT "_SectorToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Sector"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SectorToUser" ADD CONSTRAINT "_SectorToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
