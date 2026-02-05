/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

const { TableColumn } = require("typeorm");

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class UpdateMember1763044426404 {

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {

        // await queryRunner.addColumn('member', new TableColumn({
        //     name: 'name',
        //     type: 'varchar',
        //     length: 60,
        //     isNullable: false,
        // }));

        await queryRunner.dropColumn('member', 'name');

        await queryRunner.query(`
            ALTER TABLE member 
            ADD COLUMN name VARCHAR(60) NOT NULL 
            AFTER id;
        `);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {

        await queryRunner.changeColumn(
            'member',
            'name',
            new TableColumn({
                name: 'name',
                type: 'varchar',
                length: '30',
                isNullable: false,
            })
        );

    }
}