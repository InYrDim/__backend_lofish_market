const bcrypt = require('bcrypt'); // Impor bcrypt untuk hashing

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class AddKasirRoleAndUser1771570598000 {

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        console.log('Menjalankan migrasi: Menambahkan role KSR dan user kasir1...');

        // 1. Data Roles yang akan di-seed
        const kasirRole = {
            id: "KSR", 
            name: "Kasir",
            guard_name: "web",
        };

        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into('role')
            .values(kasirRole)
            .execute();

        // 2. Data User kasir1
        const hashedPasswordKasir = bcrypt.hashSync("kasir123", 10);
        
        const kasirUser = {
            id: "KSR001",
            name: "Kasir 1",
            username: "kasir1",
            email: "kasir1@lofish.market",
            password: hashedPasswordKasir,
            role: "KSR"
        };

        await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into('user')
            .values(kasirUser)
            .execute();

        console.log('Migrasi Kasir selesai.');
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        console.log('Menjalankan rollback: Menghapus data kasir...');
        
        await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from('user')
            .where("username = :username", { username: "kasir1" })
            .execute();
            
        await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from('role')
            .where("id = :id", { id: "KSR" })
            .execute();

        console.log('Rollback Migrasi Kasir selesai.');
    }

}
