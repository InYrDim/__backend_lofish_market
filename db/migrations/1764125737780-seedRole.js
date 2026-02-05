/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class SeedRole1764125737780 {

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        console.log('Menjalankan seeder: Menyisipkan data role awal...');

        // 1. Data Roles yang akan di-seed
        // ID harus berupa VARCHAR(4) seperti yang didefinisikan dalam EntitySchema Anda
        const rolesToSeed = [
            {
                id: "ADMN", // ID untuk Admin
                name: "Admin",
                guard_name: "web",
            },
            {
                id: "MNGR", // ID untuk Manager (Contoh Tambahan)
                name: "Manager",
                guard_name: "web",
            },
            {
                id: "USER", // ID untuk User Standar
                name: "User",
                guard_name: "web",
            }
        ];

        // 2. Menyisipkan data menggunakan Query Builder
        for (const role of rolesToSeed) {
            // Kita hanya perlu menyisipkan kolom yang tidak otomatis (id, name, guard_name).
            // created_at dan updated_at akan diisi secara otomatis oleh database/TypeORM.
            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into('role') // Nama tabel sesuai EntitySchema Anda
                .values(role)
                .execute();
        }

        console.log('Seeder Role selesai.');
    }

    /**
     * @param {QueryRunner} queryRunner
     */

    async down(queryRunner) {
        console.log('Menjalankan rollback: Menghapus data role awal...');
        
        // 1. Daftar ID Role yang disisipkan
        const roleIds = ["ADMN", "MNGR", "USER"];

        // 2. Menghapus data berdasarkan ID Role (primary key)
        await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from('role') // Nama tabel sesuai EntitySchema Anda
            .where("id IN (:...roleIds)", { roleIds: roleIds })
            .execute();
            
        console.log('Rollback Seeder Role selesai.');
    }

}
