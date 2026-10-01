import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

// Example API Endpoint — replace or extend with your actual API routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve built frontend assets in local static mode
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req: Request, res: Response) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).send('Build files not found. Run `npm run build` first.');
    }
  });
});

// Run local server when not hosted on Vercel
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
}

export default app;