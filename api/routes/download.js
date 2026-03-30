import { Router } from 'express';
import { jiosaavnFetch } from '../lib/jiosaavn.js';

const router = Router();

// POST /api/download
// Download a song from JioSaavn and upload it to Convex storage
// Body: { songId: string, quality?: "12kbps"|"48kbps"|"96kbps"|"160kbps"|"320kbps" }
router.post('/', async (req, res) => {
  try {
    const { songId, quality } = req.body;
    if (!songId) return res.status(400).json({ success: false, error: 'songId is required' });

    // 1. Fetch song details from JioSaavn to get download URLs
    const songData = await jiosaavnFetch(`/api/songs/${songId}`);
    if (!songData.success || !songData.data?.length) {
      return res.status(404).json({ success: false, error: 'Song not found' });
    }

    const song = songData.data[0];
    const downloadUrls = song.downloadUrl;

    if (!downloadUrls || !downloadUrls.length) {
      return res.status(404).json({ success: false, error: 'No download URLs available for this song' });
    }

    // 2. Pick the requested quality or the highest available
    const preferredQuality = quality || '320kbps';
    let downloadEntry = downloadUrls.find((d) => d.quality === preferredQuality);
    if (!downloadEntry) {
      downloadEntry = downloadUrls[downloadUrls.length - 1];
    }

    const audioUrl = downloadEntry.url;

    // 3. Download the audio file
    const audioRes = await fetch(audioUrl, {
      headers: { 'User-Agent': 'HeartNote/1.0' },
    });

    if (!audioRes.ok) {
      return res.status(502).json({ success: false, error: `Failed to download audio: ${audioRes.status}` });
    }

    const audioBuffer = await audioRes.arrayBuffer();
    const contentType = audioRes.headers.get('content-type') || 'audio/mpeg';

    // 4. Upload to Convex storage if client is available
    if (!req.convex) {
      return res.status(500).json({ success: false, error: 'Convex client not configured. Set CONVEX_URL env variable.' });
    }

    const uploadUrl = await req.convex.mutation('files:generateUploadUrl');

    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': contentType },
      body: audioBuffer,
    });

    if (!uploadRes.ok) {
      return res.status(502).json({ success: false, error: 'Failed to upload to Convex storage' });
    }

    const { storageId } = await uploadRes.json();
    const storedUrl = await req.convex.query('files:getUrl', { storageId });

    res.json({
      success: true,
      data: {
        songId: song.id,
        title: song.name,
        artist: song.artists?.primary?.map((a) => a.name).join(', ') || song.primaryArtists,
        album: song.album?.name || '',
        image: song.image,
        duration: song.duration,
        quality: downloadEntry.quality,
        storageId,
        storedUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/download/batch
// Body: { songIds: string[], quality?: string }
router.post('/batch', async (req, res) => {
  try {
    const { songIds, quality } = req.body;
    if (!songIds || !Array.isArray(songIds) || songIds.length === 0) {
      return res.status(400).json({ success: false, error: 'songIds array is required' });
    }

    if (songIds.length > 10) {
      return res.status(400).json({ success: false, error: 'Maximum 10 songs per batch' });
    }

    const results = await Promise.allSettled(
      songIds.map(async (songId) => {
        const songData = await jiosaavnFetch(`/api/songs/${songId}`);
        if (!songData.success || !songData.data?.length) {
          throw new Error(`Song ${songId} not found`);
        }

        const song = songData.data[0];
        const downloadUrls = song.downloadUrl;
        if (!downloadUrls?.length) throw new Error(`No download URLs for ${songId}`);

        const preferredQuality = quality || '320kbps';
        let downloadEntry = downloadUrls.find((d) => d.quality === preferredQuality);
        if (!downloadEntry) downloadEntry = downloadUrls[downloadUrls.length - 1];

        const audioRes = await fetch(downloadEntry.url, {
          headers: { 'User-Agent': 'HeartNote/1.0' },
        });
        if (!audioRes.ok) throw new Error(`Download failed for ${songId}`);

        const audioBuffer = await audioRes.arrayBuffer();
        const contentType = audioRes.headers.get('content-type') || 'audio/mpeg';

        if (!req.convex) throw new Error('Convex not configured');

        const uploadUrl = await req.convex.mutation('files:generateUploadUrl');
        const uploadRes = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': contentType },
          body: audioBuffer,
        });
        if (!uploadRes.ok) throw new Error(`Upload failed for ${songId}`);

        const { storageId } = await uploadRes.json();
        const storedUrl = await req.convex.query('files:getUrl', { storageId });

        return {
          songId: song.id,
          title: song.name,
          artist: song.artists?.primary?.map((a) => a.name).join(', ') || song.primaryArtists,
          album: song.album?.name || '',
          image: song.image,
          duration: song.duration,
          quality: downloadEntry.quality,
          storageId,
          storedUrl,
        };
      })
    );

    const data = results.map((r, i) =>
      r.status === 'fulfilled'
        ? { success: true, data: r.value }
        : { success: false, songId: songIds[i], error: r.reason?.message }
    );

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/download/url/:songId?quality=
// Get the direct download URL without uploading to Convex
router.get('/url/:songId', async (req, res) => {
  try {
    const { songId } = req.params;
    const { quality } = req.query;

    const songData = await jiosaavnFetch(`/api/songs/${songId}`);
    if (!songData.success || !songData.data?.length) {
      return res.status(404).json({ success: false, error: 'Song not found' });
    }

    const song = songData.data[0];
    const downloadUrls = song.downloadUrl;
    if (!downloadUrls?.length) {
      return res.status(404).json({ success: false, error: 'No download URLs available' });
    }

    const preferredQuality = quality || '320kbps';
    let downloadEntry = downloadUrls.find((d) => d.quality === preferredQuality);
    if (!downloadEntry) downloadEntry = downloadUrls[downloadUrls.length - 1];

    res.json({
      success: true,
      data: {
        songId: song.id,
        title: song.name,
        artist: song.artists?.primary?.map((a) => a.name).join(', ') || song.primaryArtists,
        album: song.album?.name || '',
        image: song.image,
        duration: song.duration,
        quality: downloadEntry.quality,
        downloadUrl: downloadEntry.url,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
