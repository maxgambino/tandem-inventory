import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import api from './api/index';

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true, service: 'tandem-api' }));

app.use('/api', api); // toutes les routes "modules" sous /api

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API up on http://localhost:${PORT}`));