/*
  Warnings:

  - You are about to drop the column `enderecoDP` on the `viatura` table. All the data in the column will be lost.
  - Added the required column `cepDP` to the `viatura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numeroDP` to the `viatura` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `viatura` DROP COLUMN `enderecoDP`,
    ADD COLUMN `cepDP` VARCHAR(191) NOT NULL,
    ADD COLUMN `numeroDP` VARCHAR(191) NOT NULL;
