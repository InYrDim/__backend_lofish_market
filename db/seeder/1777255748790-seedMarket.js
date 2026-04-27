/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class SeedMarket1777255748790 {

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        console.log('Menjalankan seeder market (profile)');

        const profilesToSeed = [
            { id: "MKT01", name: "Gudang Utama", address: "Makassar", city: "Makassar", timezone: "Asia/Makassar", time_dif: 8, phone_number: "0811xxxx" },
            { id: "MKT02", name: "Outlet Lelong", address: "Pelelangan Ikan", city: "Makassar", timezone: "Asia/Makassar", time_dif: 8, phone_number: "0812xxxx" },
            { id: "MKT03", name: "Outlet Maros", address: "Maros", city: "Maros", timezone: "Asia/Makassar", time_dif: 8, phone_number: "0813xxxx" }
        ];

        for (const profile of profilesToSeed) {
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into('profile')
                .values(profile)
                .execute();
        }

        console.log('Seeder market selesai.');
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        console.log('Menjalankan rollback market (profile)');
        
        const profileIds = ["MKT01", "MKT02", "MKT03"];
        await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from('profile')
            .where("id IN (:...ids)", { ids: profileIds })
            .execute();
            
        console.log('Rollback Seeder market selesai.');
    }

}
