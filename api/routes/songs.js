import { Router } from 'express';
import { jiosaavnFetch } from '../lib/jiosaavn.js';

const router = Router();

// GET /api/songs?id=...  or  ?link=...
router.get('/', async (req, res) => {
  try {
    const { id, link } = req.query;
    if (!id && !link) return res.status(400).json({ success: false, error: 'id or link parameter is required' });

    const data = await jiosaavnFetch('/api/songs', { id, link });
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/songs/:id
router.get('/:id', async (req, res) => {
  try {
    const data = await jiosaavnFetch(`/api/songs/${req.params.id}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/songs/:id/suggestions?limit=
router.get('/:id/suggestions', async (req, res) => {
  try {
    const { limit } = req.query;
    const data = await jiosaavnFetch(`/api/songs/${req.params.id}/suggestions`, { limit });
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
