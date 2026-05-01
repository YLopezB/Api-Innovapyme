/*
  Warnings:

  - Added the required column `id_inventario` to the `Venta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Venta` ADD COLUMN `id_inventario` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Venta` ADD CONSTRAINT `Venta_id_inventario_fkey` FOREIGN KEY (`id_inventario`) REFERENCES `Inventario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
