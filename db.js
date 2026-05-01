const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'crudlivros',
  password: process.env.DB_PASSWORD || 'crudlivros123',
  database: process.env.DB_NAME || 'crudlivros',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForDb(maxAttempts = 15, delayMs = 3000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await pool.query('SELECT 1');
      return;
    } catch (err) {
      console.log(`[db] aguardando MySQL (tentativa ${attempt}/${maxAttempts})...`);
      if (attempt === maxAttempts) {
        throw new Error(`Não foi possível conectar ao MySQL: ${err.message}`);
      }
      await sleep(delayMs);
    }
  }
}

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS livros (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      autor VARCHAR(255) NOT NULL,
      paginas INT UNSIGNED NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

async function init() {
  await waitForDb();
  await ensureSchema();
  console.log('[db] conectado e schema pronto');
}

module.exports = { pool, init };
