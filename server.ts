import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { SyncEngine } from './src/lib/sync';

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  const syncEngine = new SyncEngine();
  let history: any[] = [];
  const MAX_HISTORY = 100;

  app.use(express.json());

  // Background update loop (10Hz for simulation)
  setInterval(() => {
    const data = syncEngine.update();
    history.push({
      timestamp: Date.now(),
      ...data
    });
    if (history.length > MAX_HISTORY) history.shift();
  }, 100);

  // API Routes
  app.get('/api/state', (req, res) => {
    const data = syncEngine.update(); // Get latest
    res.json(data);
  });

  app.get('/api/history', (req, res) => {
    res.json(history);
  });

  app.post('/api/inject-fault', (req, res) => {
    syncEngine.injectFault();
    res.json({ status: 'Fault injected into physical system' });
  });

  app.post('/api/reset', (req, res) => {
    syncEngine.reset();
    history = [];
    res.json({ status: 'System reset' });
  });

  app.post('/api/drift', (req, res) => {
    const { factor } = req.body;
    syncEngine.setDrift(factor);
    res.json({ status: `Drift set to ${factor}` });
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CERN Digital Twin Server running on http://localhost:${PORT}`);
  });
}

startServer();
