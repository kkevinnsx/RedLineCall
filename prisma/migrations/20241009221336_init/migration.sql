/*
  Warnings:

  - You are about to alter the column `status` on the `viatura` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - Added the required column `statusLiberado` to the `chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusChat` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusChat` to the `viatura` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chat` ADD COLUMN `statusLiberado` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `statusChat` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `viatura` ADD COLUMN `responsavelId` INTEGER NULL,
    ADD COLUMN `statusChat` BOOLEAN NOT NULL,
    MODIFY `identificacao` VARCHAR(191) NULL,
    MODIFY `status` BOOLEAN NOT NULL;

-- CreateIndex
CREATE INDEX `viatura_responsavelId_fkey` ON `viatura`(`responsavelId`);

-- AddForeignKey
ALTER TABLE `viatura` ADD CONSTRAINT `viatura_responsavelId_fkey` FOREIGN KEY (`responsavelId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
