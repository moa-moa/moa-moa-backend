/*
  Warnings:

  - You are about to drop the column `imageId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `ClubImage` DROP FOREIGN KEY `ClubImage_clubId_fkey`;

-- DropForeignKey
ALTER TABLE `ClubImage` DROP FOREIGN KEY `ClubImage_imageId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_imageId_fkey`;

-- DropForeignKey
ALTER TABLE `UserCreatedClub` DROP FOREIGN KEY `UserCreatedClub_clubId_fkey`;

-- DropForeignKey
ALTER TABLE `UserCreatedClub` DROP FOREIGN KEY `UserCreatedClub_userId_fkey`;

-- DropForeignKey
ALTER TABLE `UserJoinedClub` DROP FOREIGN KEY `UserJoinedClub_clubId_fkey`;

-- DropForeignKey
ALTER TABLE `UserJoinedClub` DROP FOREIGN KEY `UserJoinedClub_userId_fkey`;

-- DropForeignKey
ALTER TABLE `UserLikedClub` DROP FOREIGN KEY `UserLikedClub_clubId_fkey`;

-- DropForeignKey
ALTER TABLE `UserLikedClub` DROP FOREIGN KEY `UserLikedClub_userId_fkey`;

-- AlterTable
ALTER TABLE `Image` ADD COLUMN `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `imageId`;

-- CreateIndex
CREATE UNIQUE INDEX `Image_userId_key` ON `Image`(`userId`);

-- AddForeignKey
ALTER TABLE `ClubImage` ADD CONSTRAINT `ClubImage_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClubImage` ADD CONSTRAINT `ClubImage_clubId_fkey` FOREIGN KEY (`clubId`) REFERENCES `Club`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLikedClub` ADD CONSTRAINT `UserLikedClub_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLikedClub` ADD CONSTRAINT `UserLikedClub_clubId_fkey` FOREIGN KEY (`clubId`) REFERENCES `Club`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserJoinedClub` ADD CONSTRAINT `UserJoinedClub_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserJoinedClub` ADD CONSTRAINT `UserJoinedClub_clubId_fkey` FOREIGN KEY (`clubId`) REFERENCES `Club`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCreatedClub` ADD CONSTRAINT `UserCreatedClub_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCreatedClub` ADD CONSTRAINT `UserCreatedClub_clubId_fkey` FOREIGN KEY (`clubId`) REFERENCES `Club`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
