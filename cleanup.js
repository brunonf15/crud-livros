const cron = require('node-cron');
const { pool } = require('./db');

async function truncateLivros() {
  await pool.query('TRUNCATE TABLE livros');
  console.log('[cleanup] livros truncados em', new Date().toISOString());
}

function startCleanupJob() {
  cron.schedule('0 * * * *', async () => {
    try {
      await truncateLivros();
    } catch (err) {
      console.error('[cleanup] falha ao truncar livros:', err.message);
    }
  });
  console.log('[cleanup] job agendado: TRUNCATE livros a cada hora cheia');
}

module.exports = { startCleanupJob, truncateLivros };
