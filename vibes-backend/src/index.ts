import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import animeRouter from './routes/anime';
import musicRouter from './routes/music';
import petsRouter from './routes/pets';

const app = express();
const PORT = parseInt(process.env.PORT ?? '8080', 10);

// CORS
const allowedOrigins = [
  'https://vibes.suprateekyawagal.in',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-admin-secret'],
    credentials: false,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/anime', animeRouter);
app.use('/api/music', musicRouter);
app.use('/api/pets', petsRouter);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'not_found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[vibes-backend] listening on port ${PORT}`);
});

export default app;
