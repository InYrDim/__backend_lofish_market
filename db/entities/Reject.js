const {
  EntitySchema
} = require('typeorm');

module.exports = new EntitySchema({
  name: 'Reject',
  tableName: 'reject',
  columns: {
    id: {
      primary: true,
      type: 'varchar',
      length: 16,
    },
    barcode: {
      type: 'varchar',
      length: 30,
      nullable: true,
    },
    status: {
      type: 'enum',
      enum: ['1', '2', '3', '4'],
      default: '1',
      comment: 'Satuan produk (1 = expired, 2 = broken, 3 = other)',
    },
    unit: {
      type: 'enum',
      enum: ['1', '2'],
      default: '1',
      comment: 'Satuan produk (2 = per item, 1 = per kilogram)',
    },
    qty: {
      type: 'double',
      default: 0,
    },
    desc: {
      type: 'text',
      nullable: true,
      comment: 'Deskripsi/keterangan reject'
    },
    created_at: {
      type: 'timestamp',
      createDate: true,
    },
    updated_at: {
      type: 'timestamp',
      updateDate: true,
    }
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'user_id',
        referencedColumnName: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      nullable: true,
      eager: true,
    },
    stock: {
      type: 'many-to-one',
      target: 'Stock',
      joinColumn: {
        name: 'stock_id',
        referencedColumnName: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      nullable: false,
      eager: true,
    },
  },
});