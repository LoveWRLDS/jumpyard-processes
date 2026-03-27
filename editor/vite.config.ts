import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

// Dev-only plugin: POST /api/save-flow writes nodes+edges to pilotFlow.ts
function saveFlowPlugin() {
  return {
    name: 'save-flow',
    configureServer(server: any) {
      server.middlewares.use('/api/save-flow', (req: any, res: any) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return; }
        let body = '';
        req.on('data', (c: any) => { body += c; });
        req.on('end', () => {
          try {
            const { nodes, edges } = JSON.parse(body);
            const out = `// Auto-generated — do not edit by hand\n` +
              `export const pilotNodes = ${JSON.stringify(nodes, null, 2)} as any[];\n\n` +
              `export const pilotEdges = ${JSON.stringify(edges, null, 2)} as any[];\n`;
            fs.writeFileSync(path.resolve(__dirname, 'src/data/pilotFlow.ts'), out, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(e) }));
          }
        });
      });
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), saveFlowPlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
