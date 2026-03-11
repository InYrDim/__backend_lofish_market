// config/data-source.js
const { DataSource } = require('typeorm');
const path = require('path');

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNC === "true", // ⚠️ Auto create table (dev only)
  logging: process.env.DB_LOGG,
  entities: [path.join(__dirname, '../db/entities/*.js')],
  migrations: [path.join(__dirname, '../db/migrations/*.js')],
});

module.exports = AppDataSource;
