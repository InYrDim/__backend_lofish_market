/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class SeedPrice1777255988000 {

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        console.log('Menjalankan seeder price');

        const pricesToSeed = [
            {
                id: "PRC01",
                selling: 25000,
                initial: 20000,
                disc: 0,
                product: "PRD01", // Ikan Bandeng
                grade: "GR01",    // GRADE A
                size: "SZ01"      // BESAR
            },
            {
                id: "PRC02",
                selling: 35000,
                initial: 30000,
                disc: 0,
                product: "PRD02", // Udang Vaname
                grade: "GR01",
                size: "SZ02"
            },
            {
                id: "PRC03",
                selling: 15000,
                initial: 12000,
                disc: 0,
                product: "PRD03", // Cumi-cumi
                grade: "GR02",
                size: "SZ03"
            }
        ];

        for (const price of pricesToSeed) {
            await queryRunner.query(
                `INSERT IGNORE INTO \`price\` (\`id\`, \`selling\`, \`initial\`, \`disc\`, \`product_id\`, \`grade_id\`, \`size_id\`) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [price.id, price.selling, price.initial, price.disc, price.product, price.grade, price.size]
            );
        }

        console.log('Seeder price selesai.');
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        console.log('Menjalankan rollback price');
        await queryRunner.query(
            `DELETE FROM \`price\` WHERE \`id\` IN (?, ?, ?)`,
            ['PRC01', 'PRC02', 'PRC03']
        );
        console.log('Rollback Seeder price selesai.');
    }

}
