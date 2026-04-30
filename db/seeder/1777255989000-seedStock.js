/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class SeedStock1777255989000 {

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        console.log('Menjalankan seeder stock');

        const stocksToSeed = [
            { id: "STK01", product: "PRD01", market: "MKT01", qty: 100 },
            { id: "STK02", product: "PRD02", market: "MKT01", qty: 100 },
            { id: "STK03", product: "PRD03", market: "MKT01", qty: 100 },
            { id: "STK04", product: "PRD01", market: "MKT02", qty: 100 },
            { id: "STK05", product: "PRD02", market: "MKT02", qty: 100 },
            { id: "STK06", product: "PRD03", market: "MKT02", qty: 100 }
        ];

        for (const stock of stocksToSeed) {
            await queryRunner.query(
                `INSERT IGNORE INTO \`stock\` (\`id\`, \`product_id\`, \`market_id\`, \`qty\`) VALUES (?, ?, ?, ?)`,
                [stock.id, stock.product, stock.market, stock.qty]
            );
        }

        console.log('Seeder stock selesai.');
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        console.log('Menjalankan rollback stock');
        await queryRunner.query(
            `DELETE FROM \`stock\` WHERE \`id\` IN (?, ?, ?, ?, ?, ?)`,
            ['STK01', 'STK02', 'STK03', 'STK04', 'STK05', 'STK06']
        );
        console.log('Rollback Seeder stock selesai.');
    }

}
