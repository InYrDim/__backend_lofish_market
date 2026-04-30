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
            await queryRunner.query(
                `INSERT IGNORE INTO \`product\` (\`id\`, \`name\`, \`barcode\`, \`unit\`, \`is_non_stock\`, \`is_show\`, \`category_id\`) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [product.id, product.name, product.barcode, product.unit, product.is_non_stock, product.is_show, product.category]
            );
        }

        console.log('Seeder product selesai.');
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        console.log('Menjalankan rollback product');
        await queryRunner.query(
            `DELETE FROM \`product\` WHERE \`id\` IN (?, ?, ?)`,
            ['PRD01', 'PRD02', 'PRD03']
        );
        console.log('Rollback Seeder product selesai.');
    }

}
