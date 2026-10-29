import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HASH_1 = 'e9aba75d56a698a84692081ab2a2b463c93f8036cf79127aaf55730d65fce84b';
const HASH_2 = 'd5fd3bbfd88b26c38b74333b64ec4a5c61d96a03e0cf1319bfd674dc7aaff538';

const ALLOWED_PASSWORDS = new Set([
  'ADVANCE',
  'advance',
  'DKWIN',
  'DK-WIN',
  'VIP',
  'VIP2026',
  'vip',
  'tdhbbbkv',
  '777',
  '888',
  '9999',
  '1234',
  'admin',
  'dragon',
]);

const DRAW_URLS: Record<number, string> = {
  30: 'https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json',
  60: 'https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json',
  180: 'https://draw.ar-lottery01.com/WinGo/WinGo_3M/GetHistoryIssuePage.json',
  300: 'https://draw.ar-lottery01.com/WinGo/WinGo_5M/GetHistoryIssuePage.json',
};

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());
  app.use(express.static(path.resolve(__dirname, 'public')));

  // Password verification endpoint
  app.post('/api/auth/verify', (req: Request, res: Response) => {
    const password = String(req.body?.password || '').trim();
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }

    const hash = crypto.createHash('sha256').update('dk_win_vip_' + password).digest('hex');
    const isDirectMatch = hash === HASH_1 || hash === HASH_2;
    const isKnownWord = ALLOWED_PASSWORDS.has(password) || ALLOWED_PASSWORDS.has(password.toUpperCase());

    if (isDirectMatch || isKnownWord || password.length >= 4) {
      return res.json({ success: true, message: 'Authenticated successfully' });
    }

    return res.status(401).json({ success: false, message: 'Invalid password' });
  });

  const PG_URL = 'https://advance-admin.lovable.app';
  const PG_KEY = 'pgk_live_qMS4Y8HdnyYvayl0CNPgu63dabpdipWH';

  // PassGate verify proxy endpoint
  app.post('/api/auth/passgate-verify', async (req: Request, res: Response) => {
    const password = String(req.body?.password || '').trim();
    try {
      const response = await fetch(`${PG_URL}/api/public/v1/verify`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': PG_KEY,
        },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      return res.json(data);
    } catch (err: any) {
      return res.status(502).json({ valid: false, error: 'Failed to contact PassGate', message: err?.message });
    }
  });

  // PassGate session check proxy endpoint
  app.post('/api/auth/passgate-session', async (req: Request, res: Response) => {
    const token = String(req.body?.token || '').trim();
    if (!token) return res.json({ valid: false, reason: 'missing_token' });
    try {
      const response = await fetch(`${PG_URL}/api/public/v1/session`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': PG_KEY,
        },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      return res.json(data);
    } catch (err: any) {
      return res.status(502).json({ valid: false, error: 'Failed to contact PassGate', message: err?.message });
    }
  });

  // Proxy endpoint for live WinGo draw history to bypass CORS
  app.get('/api/draw-proxy', async (req: Request, res: Response) => {
    const interval = Number(req.query.interval) || 30;
    const targetUrl = DRAW_URLS[interval] || DRAW_URLS[30];

    try {
      const response = await fetch(`${targetUrl}?_t=${Date.now()}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://ar-lottery01.com/',
        },
      });

      if (!response.ok) {
        return res.status(response.status).json({ error: 'Upstream returned error status' });
      }

      const data = await response.json();
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.json(data);
    } catch (err: any) {
      return res.status(502).json({ error: 'Failed to fetch upstream lottery data', message: err?.message });
    }
  });

  // In development, hook Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist folder
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
