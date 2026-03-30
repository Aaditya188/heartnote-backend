// Local development server — not used in Vercel deployment
import app from './api/index.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`HeartNote API running at http://localhost:${PORT}`);
  console.log(`Convex URL: ${process.env.CONVEX_URL ? 'set' : 'NOT set'}`);
  console.log(`JioSaavn Base: ${process.env.JIOSAAVN_BASE_URL || 'NOT set'}`);
});
