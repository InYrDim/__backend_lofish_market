/**
 * Seeder untuk tabel Price (Harga Produk)
 * Setiap produk dapat memiliki banyak harga tergantung variant Grade + Size.
 * 
 * Kombinasi UNIK: product_id + grade_id + size_id
 *
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

module.exports = class SeedPrice1777255988000 {

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        console.log('Menjalankan seeder Price (Harga Produk)');

        const pricesToSeed = [
            // ========================================
            // PRD01: Ikan Bandeng (899000111222)
            // ========================================
            {
                id: "PRC001",
                product: "PRD01",
                grade: "GR01",
                size: "SZ01",
                barcode: "7701A",
                initial: 25000,
                selling: 35000,
                disc: 0,
            },
            {
                id: "PRC002",
                product: "PRD01",
                grade: "GR01",
                size: "SZ02",
                barcode: "7701B",
                initial: 22000,
                selling: 32000,
                disc: 0,
            },
            {
                id: "PRC003",
                product: "PRD01",
                grade: "GR01",
                size: "SZ03",
                barcode: "7701C",
                initial: 18000,
                selling: 28000,
                disc: 0,
            },
            {
                id: "PRC004",
                product: "PRD01",
                grade: "GR02",
                size: "SZ01",
                barcode: "7702A",
                initial: 20000,
                selling: 28000,
                disc: 0,
            },
            {
                id: "PRC005",
                product: "PRD01",
                grade: "GR02",
                size: "SZ02",
                barcode: "7702B",
                initial: 18000,
                selling: 25000,
                disc: 0,
            },

            // ========================================
            // PRD02: Ikan Tongkol (899000111333)
            // ========================================
            {
                id: "PRC006",
                product: "PRD02",
                grade: "GR01",
                size: "SZ01",
                barcode: "7801A",
                initial: 30000,
                selling: 45000,
                disc: 0,
            },
            {
                id: "PRC007",
                product: "PRD02",
                grade: "GR01",
                size: "SZ02",
                barcode: "7801B",
                initial: 28000,
                selling: 42000,
                disc: 0,
            },
            {
                id: "PRC008",
                product: "PRD02",
                grade: "GR01",
                size: "SZ03",
                barcode: "7801C",
                initial: 25000,
                selling: 38000,
                disc: 0,
            },
            {
                id: "PRC009",
                product: "PRD02",
                grade: "GR02",
                size: "SZ01",
                barcode: "7802A",
                initial: 25000,
                selling: 38000,
                disc: 0,
            },
            {
                id: "PRC010",
                product: "PRD02",
                grade: "GR02",
                size: "SZ02",
                barcode: "7802B",
                initial: 22000,
                selling: 35000,
                disc: 0,
            },
            {
                id: "PRC011",
                product: "PRD02",
                grade: "GR03",
                size: "SZ01",
                barcode: "7803A",
                initial: 18000,
                selling: 28000,
                disc: 0,
            },

            // ========================================
            // PRD03: Ikan Layang (899000111444)
            // ========================================
            {
                id: "PRC012",
                product: "PRD03",
                grade: "GR01",
                size: "SZ01",
                barcode: "7901A",
                initial: 22000,
                selling: 35000,
                disc: 0,
            },
            {
                id: "PRC013",
                product: "PRD03",
                grade: "GR01",
                size: "SZ02",
                barcode: "7901B",
                initial: 20000,
                selling: 32000,
                disc: 0,
            },
            {
                id: "PRC014",
                product: "PRD03",
                grade: "GR01",
                size: "SZ03",
                barcode: "7901C",
                initial: 17000,
                selling: 28000,
                disc: 0,
            },
            {
                id: "PRC015",
                product: "PRD03",
                grade: "GR01",
                size: "SZ04",
                barcode: "7901D",
                initial: 12000,
                selling: 20000,
                disc: 0,
            },
            {
                id: "PRC016",
                product: "PRD03",
                grade: "GR02",
                size: "SZ01",
                barcode: "7902A",
                initial: 18000,
                selling: 30000,
                disc: 0,
            },
            {
                id: "PRC017",
                product: "PRD03",
                grade: "GR02",
                size: "SZ02",
                barcode: "7902B",
                initial: 16000,
                selling: 27000,
                disc: 0,
            },
            {
                id: "PRC018",
                product: "PRD03",
                grade: "GR02",
                size: "SZ03",
                barcode: "7902C",
                initial: 14000,
                selling: 24000,
                disc: 0,
            },
        ];

        for (const price of pricesToSeed) {
            const exists = await queryRunner.query(`
                SELECT id FROM price 
                WHERE product_id = ? AND grade_id = ? AND size_id = ?
            `, [price.product, price.grade, price.size]);

            if (exists.length === 0) {
                await queryRunner.query(
                    `INSERT INTO \`price\` (
                        \`id\`, 
                        \`product_id\`, 
                        \`grade_id\`, 
                        \`size_id\`, 
                        \`barcode\`, 
                        \`initial\`, 
                        \`selling\`, 
                        \`disc\`
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        price.id,
                        price.product,
                        price.grade,
                        price.size,
                        price.barcode,
                        price.initial,
                        price.selling,
                        price.disc,
                    ]
                );
                console.log(`  [OK] Insert price ${price.barcode} - ${price.initial}/${price.selling}`);
            } else {
                console.log(`  [Skip] Price untuk ${price.product}+${price.grade}+${price.size} sudah ada`);
            }
        }

        console.log('Seeder Price selesai.');
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        console.log('Menjalankan rollback seeder Price');
        
        const allPriceIds = [
            "PRC001", "PRC002", "PRC003", "PRC004", "PRC005",
            "PRC006", "PRC007", "PRC008", "PRC009", "PRC010", "PRC011",
            "PRC012", "PRC013", "PRC014", "PRC015", "PRC016", "PRC017", "PRC018",
        ];

        const placeholders = allPriceIds.map(() => '?').join(',');
        
        await queryRunner.query(
            `DELETE FROM \`price\` WHERE \`id\` IN (${placeholders})`,
            allPriceIds
        );

        console.log('Rollback seeder Price selesai.');
    }
}
