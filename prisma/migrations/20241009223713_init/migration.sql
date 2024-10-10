/*
  Warnings:

  - Added the required column `latitude` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `viatura` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `viatura` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `latitude` VARCHAR(191) NOT NULL,
    ADD COLUMN `longitude` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `viatura` ADD COLUMN `latitude` VARCHAR(191) NOT NULL,
    ADD COLUMN `longitude` VARCHAR(191) NOT NULL;
