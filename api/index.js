import express from 'express';
import cors from 'cors';
import { ConvexHttpClient } from 'convex/browser';
import searchRouter from './routes/search.js';
import songsRouter from './routes/songs.js';
import albumsRouter from './routes/albums.js';
import artistsRouter from './routes/artists.js';
import playlistsRouter from './routes/playlists.js';
import downloadRouter from './routes/download.js';

const app = express();

app.use(cors());
app.use(express.json());

// Attach Convex client to requests if CONVEX_URL is set
app.use((req, _res, next) => {
  if (process.env.CONVEX_URL) {
    req.convex = new ConvexHttpClient(process.env.CONVEX_URL);
  }
  next();
});

// Routes
app.use('/api/search', searchRouter);
app.use('/api/songs', songsRouter);
app.use('/api/albums', albumsRouter);
app.use('/api/artists', artistsRouter);
app.use('/api/playlists', playlistsRouter);
app.use('/api/download', downloadRouter);

// Health check
app.get('/api', (_req, res) => {
  res.json({ status: 'ok', message: 'HeartNote Music API' });
});

export default app;
