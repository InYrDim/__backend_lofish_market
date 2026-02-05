/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

const bcrypt = require('bcrypt'); // Impor bcrypt untuk hashing
// Perlu diingat: Karena ini CommonJS, proses hashing harus dijalankan secara synchronous jika tidak menggunakan helper

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class SeedSizeCat1764127951306 {

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        console.log('Menjalankan seeder');

        const sizeToSeed = [
            {
                id: "SZ01",
                name: "BESAR"
            },
            {
                id: "SZ02",
                name: "SEDANG"
            },
            {
                id: "SZ03",
                name: "KECIL"
            },
            {
                id: "SZ04",
                name: "BABY"
            },
            
        ];

        for (const size of sizeToSeed) {
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into('size')
                .values(size)
                .execute();
        }

        const categoryToSeed = [
            {
                id: "CT01",
                name: "IKAN"
            },
            {
                id: "CT02",
                name: "SAYUR"
            }
        ];

        for (const category of categoryToSeed) {
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into('category')
                .values(category)
                .execute();
        }

        console.log('Seeder selesai.');
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        console.log('Menjalankan rollback');
        
        await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from('size')
            .execute();

        await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from('category')
            .execute();
            
        console.log('Rollback Seeder selesai.');
    }

}