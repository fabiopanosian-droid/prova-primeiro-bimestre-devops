
require('dotenv').config();

const express = require('express');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');

    res.status(200).json({
      status: 'ok',
      database: 'connected'
    });
  } catch (error) {
    console.error('Erro ao conectar ao banco:', error.message);

    res.status(503).json({
      status: 'error',
      database: 'disconnected'
    });
  }
});

app.post('/reservas', async (req, res) => {
  try {
    const { cliente, data, status } = req.body;

    if (!cliente || !data || !status) {
      return res.status(400).json({
        erro: 'cliente, data e status são obrigatórios'
      });
    }

    const result = await pool.query(
      `INSERT INTO reservas (cliente, data, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [cliente, data, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar reserva:', error.message);

    res.status(500).json({
      erro: 'Erro ao criar reserva'
    });
  }
});

app.get('/reservas', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM reservas ORDER BY id'
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar reservas:', error.message);

    res.status(500).json({
      erro: 'Erro ao buscar reservas'
    });
  }
});

app.get('/reservas/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM reservas WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        erro: 'Reserva não encontrada'
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar reserva:', error.message);

    res.status(500).json({
      erro: 'Erro ao buscar reserva'
    });
  }
});

app.put('/reservas/:id', async (req, res) => {
  try {
    const { cliente, data, status } = req.body;

    if (!cliente || !data || !status) {
      return res.status(400).json({
        erro: 'cliente, data e status são obrigatórios'
      });
    }

    const result = await pool.query(
      `UPDATE reservas
       SET cliente = $1, data = $2, status = $3
       WHERE id = $4
       RETURNING *`,
      [cliente, data, status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        erro: 'Reserva não encontrada'
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar reserva:', error.message);

    res.status(500).json({
      erro: 'Erro ao atualizar reserva'
    });
  }
});


app.delete('/reservas/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM reservas WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        erro: 'Reserva não encontrada'
      });
    }

    res.status(200).json({
      mensagem: 'Reserva excluída com sucesso',
      reserva: result.rows[0]
    });
  } catch (error) {
    console.error('Erro ao excluir reserva:', error.message);

    res.status(500).json({
      erro: 'Erro ao excluir reserva'
    });
  }
});

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reservas (
      id SERIAL PRIMARY KEY,
      cliente VARCHAR(150) NOT NULL,
      data DATE NOT NULL,
      status VARCHAR(50) NOT NULL
    )
  `);

  console.log('Banco de dados inicializado com sucesso');
}

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`API de Reservas rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao inicializar o banco:', error.message);
    process.exit(1);
  }
}

startServer();
;
