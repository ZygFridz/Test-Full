/*
  Warnings:

  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `role_permission` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[User_id]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role_id` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `User_id` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `permission` ADD COLUMN `role_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `role` ADD COLUMN `User_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `role`;

-- DropTable
DROP TABLE `role_permission`;

-- CreateIndex
CREATE UNIQUE INDEX `Role_User_id_key` ON `Role`(`User_id`);

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_User_id_fkey` FOREIGN KEY (`User_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
