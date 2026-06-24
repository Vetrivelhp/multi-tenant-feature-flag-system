const Database = require('better-sqlite3');
const { drizzle } = require('drizzle-orm/better-sqlite3');
const schema = require('./schema');

const sqlite = new Database('./dev.db');
const db = drizzle(sqlite, { schema });

module.exports = db;