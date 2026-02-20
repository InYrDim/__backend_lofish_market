/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class SeedPaymentMethods1771600000000 {

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        console.log('Menjalankan migrasi: Menambahkan payment methods (cash, qris)...');

        const paymentMethods = [
            { id: "cash", name: "cash", icon: "cash" },
            { id: "qris", name: "qris", icon: "qris" }
        ];

        // Using REPLACE to handle potential duplicates gracefully or INSERT IGNORE in MySQL syntax
        // QueryBuilder insert handles this if we want, or we can just iterate.
        for (const pm of paymentMethods) {
            // Because TypeORM insert() builder doesn't easily do ON DUPLICATE KEY UPDATE in a raw JS way without specific drivers, we can do raw query or standard insert.
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into('payment_method')
                .values(pm)
                // Using try/catch to ignore duplicates just in case
                .execute().catch(e => console.log(`Payment method ${pm.id} already exists.`));
        }

        console.log('Migrasi Payment Methods selesai.');
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        console.log('Menjalankan rollback: Menghapus payment methods (cash, qris)...');

        await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from('payment_method')
            .where("id IN (:...ids)", { ids: ["cash", "qris"] })
            .execute();

        console.log('Rollback Migrasi Payment Methods selesai.');
    }

}
