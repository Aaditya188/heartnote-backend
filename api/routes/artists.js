import { Router } from 'express';
import { jiosaavnFetch } from '../lib/jiosaavn.js';

const router = Router();

// GET /api/artists?id=...  or  ?link=...
router.get('/', async (req, res) => {
  try {
    const { id, link } = req.query;
    if (!id && !link) return res.status(400).json({ success: false, error: 'id or link parameter is required' });

    const data = await jiosaavnFetch('/api/artists', { id, link });
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/artists/:id
router.get('/:id', async (req, res) => {
  try {
    const data = await jiosaavnFetch(`/api/artists/${req.params.id}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/artists/:id/songs?page=&limit=
router.get('/:id/songs', async (req, res) => {
  try {
    const { page, limit } = req.query;
    const data = await jiosaavnFetch(`/api/artists/${req.params.id}/songs`, { page, limit });
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/artists/:id/albums?page=&limit=
router.get('/:id/albums', async (req, res) => {
  try {
    const { page, limit } = req.query;
    const data = await jiosaavnFetch(`/api/artists/${req.params.id}/albums`, { page, limit });
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
