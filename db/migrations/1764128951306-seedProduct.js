/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class SeedProduct1764128951306 {

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        console.log('Menjalankan seeder: Memasukkan data awal ke tabel "product"...');

        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into('product')
            .values([
                {
                    id: "PROD0002",
                    name: "Ikan Salmon",
                    barcode: "1234567890122",
                    unit: "1",
                    is_non_stock: "1",
                    is_show: "1",
                    image: "images/product/PROD0002.jpg",
                    size: { id: "SZ02" },
                    category: { id: "CT01" },
                },
                {
                    id: "PROD0003",
                    name: "Ikan Salmon",
                    barcode: "1234567890123",
                    unit: "1",
                    is_non_stock: "1",
                    is_show: "1",
                    image: "images/product/PROD0003.jpg",
                    size: { id: "SZ03" },
                    category: { id: "CT01" },
                },
                {
                    id: "PROD0004",
                    name: "Ikan Tuna",
                    barcode: "1234568890122",
                    unit: "1",
                    is_non_stock: "1",
                    is_show: "1",
                    image: "images/product/PROD0004.jpg",
                    size: { id: "SZ01" },
                    category: { id: "CT01" },
                },
                {
                    id: "PROD0005",
                    name: "Ikan Paus",
                    barcode: "1234569890122",
                    unit: "1",
                    is_non_stock: "1",
                    is_show: "1",
                    image: "images/product/PROD0005.jpg",
                    size: { id: "SZ01" },
                    category: { id: "CT01" },
                }
            ])
            .execute();

        console.log('Seeder Product selesai. Total 4 produk dimasukkan.');
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        console.log('Menjalankan rollback: Menghapus semua data dari tabel "product"...');

        await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from('product')
            .execute();

        console.log('Rollback Seeder Product selesai.');
    }

}
