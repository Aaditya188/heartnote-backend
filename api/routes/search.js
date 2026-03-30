import { Router } from 'express';
import { jiosaavnFetch } from '../lib/jiosaavn.js';

const router = Router();

// GET /api/search?query=...
router.get('/', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, error: 'query parameter is required' });

    const data = await jiosaavnFetch('/api/search', { query });
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/search/songs?query=...&page=&limit=
router.get('/songs', async (req, res) => {
  try {
    const { query, page, limit } = req.query;
    if (!query) return res.status(400).json({ success: false, error: 'query parameter is required' });

    const data = await jiosaavnFetch('/api/search/songs', { query, page, limit });
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/search/albums?query=...&page=&limit=
router.get('/albums', async (req, res) => {
  try {
    const { query, page, limit } = req.query;
    if (!query) return res.status(400).json({ success: false, error: 'query parameter is required' });

    const data = await jiosaavnFetch('/api/search/albums', { query, page, limit });
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/search/artists?query=...&page=&limit=
router.get('/artists', async (req, res) => {
  try {
    const { query, page, limit } = req.query;
    if (!query) return res.status(400).json({ success: false, error: 'query parameter is required' });

    const data = await jiosaavnFetch('/api/search/artists', { query, page, limit });
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/search/playlists?query=...&page=&limit=
router.get('/playlists', async (req, res) => {
  try {
    const { query, page, limit } = req.query;
    if (!query) return res.status(400).json({ success: false, error: 'query parameter is required' });

    const data = await jiosaavnFetch('/api/search/playlists', { query, page, limit });
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
