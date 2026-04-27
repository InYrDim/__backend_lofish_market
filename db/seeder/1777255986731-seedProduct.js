/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class SeedProduct1777255986731 {

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        console.log('Menjalankan seeder product');

        const productsToSeed = [
            {
                id: "PRD01",
                name: "Ikan Bandeng",
                barcode: "899000111222",
                unit: "1", // per KG
                is_non_stock: "1",
                is_show: "1",
                category: "CT01"
            },
            {
                id: "PRD02",
                name: "Ikan Tongkol",
                barcode: "899000111333",
                unit: "1", // per KG
                is_non_stock: "1",
                is_show: "1",
                category: "CT01"
            },
            {
                id: "PRD03",
                name: "Ikan Layang",
                barcode: "899000111444",
                unit: "1", // per KG
                is_non_stock: "1",
                is_show: "1",
                category: "CT01"
            }
        ];

        for (const product of productsToSeed) {
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into('product')
                .values(product)
                .execute();
        }

        console.log('Seeder product selesai.');
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        console.log('Menjalankan rollback product');
        
        const productIds = ["PRD01", "PRD02", "PRD03"];
        await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from('product')
            .where("id IN (:...ids)", { ids: productIds })
            .execute();
            
        console.log('Rollback Seeder product selesai.');
    }

}
