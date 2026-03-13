import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

function loadEnvKey() {
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) return '';
  const content = readFileSync(envPath, 'utf-8');
  const match = content.match(/^GEMINI_API_KEY=(.+)$/m);
  return match ? match[1].trim() : '';
}

function geminiProxy() {
  return {
    name: 'gemini-proxy',
    configureServer(server) {
      server.middlewares.use('/api/gemini', async (req, res) => {
        if (req.method === 'GET') {
          const key = loadEnvKey();
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ configured: !!key && key !== 'your-gemini-api-key-here' }));
          return;
        }
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }
        const serverKey = loadEnvKey();
        if (!serverKey || serverKey === 'your-gemini-api-key-here') {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'GEMINI_API_KEY not set in .env file' }));
          return;
        }
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const payload = JSON.parse(body);
            const model = payload.model || 'gemini-2.5-flash';
            delete payload.model;

            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${serverKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              }
            );
            const data = await response.json();
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = response.status;
            res.end(JSON.stringify(data));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), geminiProxy()],
  server: {
    port: 5174,
  },
})
