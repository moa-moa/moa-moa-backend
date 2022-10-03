/*
  Warnings:

  - The primary key for the `ClubImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `imageName` on the `Image` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `ClubImage` DROP FOREIGN KEY `ClubImage_imageId_fkey`;

-- AlterTable
ALTER TABLE `ClubImage` DROP PRIMARY KEY,
    MODIFY `imageId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`imageId`, `clubId`);

-- AlterTable
ALTER TABLE `Image` DROP PRIMARY KEY,
    DROP COLUMN `imageName`,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Image_id_key` ON `Image`(`id`);

-- AddForeignKey
ALTER TABLE `ClubImage` ADD CONSTRAINT `ClubImage_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
