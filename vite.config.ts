import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'admin-api',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/prompts' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });
              req.on('end', async () => {
                try {
                  const data = JSON.parse(body);
                  const { title, prompt, category, imageBase64, fileName } = data;

                  // Save image to assets
                  const assetPath = path.resolve(__dirname, 'public/assets', fileName);
                  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
                  fs.writeFileSync(assetPath, Buffer.from(base64Data, 'base64'));

                  // Update prompts.json
                  const promptsPath = path.resolve(__dirname, 'src/prompts.json');
                  const prompts = JSON.parse(fs.readFileSync(promptsPath, 'utf-8'));
                  
                  const newPrompt = {
                    id: String(Date.now()),
                    title,
                    prompt,
                    imageUrl: `/assets/${fileName}`,
                    category
                  };
                  
                  prompts.push(newPrompt);
                  fs.writeFileSync(promptsPath, JSON.stringify(prompts, null, 2));

                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true, item: newPrompt }));
                } catch (error) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ success: false, error: error.message }));
                }
              });
              return;
            }
            next();
          });
        }
      }
    ],
    define: {},
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
