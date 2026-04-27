require('dotenv').config();
require('reflect-metadata');
const { DataSource } = require('typeorm');
const path = require('path');

module.exports = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, '../db/entities/*.js')],
  migrations: [path.join(__dirname, '../db/seeder/*.js')],
  // Track seeder execution in the default migrations table so we don't rerun old ones
  synchronize: false,
  logging: true,
});
