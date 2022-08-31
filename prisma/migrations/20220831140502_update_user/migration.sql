/*
  Warnings:

  - You are about to drop the `UserCreatedClub` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserCreatedClub` DROP FOREIGN KEY `UserCreatedClub_clubId_fkey`;

-- DropForeignKey
ALTER TABLE `UserCreatedClub` DROP FOREIGN KEY `UserCreatedClub_userId_fkey`;

-- DropTable
DROP TABLE `UserCreatedClub`;

-- AddForeignKey
ALTER TABLE `Club` ADD CONSTRAINT `Club_owner_fkey` FOREIGN KEY (`owner`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
