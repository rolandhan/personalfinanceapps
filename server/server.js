// Express Server API for MySQL Portable Connection
import express from 'express';
import cors from 'cors';
import { dbPool } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Healthcheck endpoint
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await dbPool.query('SELECT 1 + 1 AS solution');
    res.json({ status: 'connected', solution: rows[0].solution, mysqlHost: process.env.MYSQL_HOST || 'localhost:3306' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`FinanceCraft Portable MySQL Server running on http://localhost:${PORT}`);
});
