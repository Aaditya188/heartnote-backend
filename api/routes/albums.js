import { Router } from 'express';
import { jiosaavnFetch } from '../lib/jiosaavn.js';

const router = Router();

// GET /api/albums?id=...  or  ?link=...
router.get('/', async (req, res) => {
  try {
    const { id, link } = req.query;
    if (!id && !link) return res.status(400).json({ success: false, error: 'id or link parameter is required' });

    const data = await jiosaavnFetch('/api/albums', { id, link });
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
