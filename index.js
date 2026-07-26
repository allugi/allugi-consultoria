import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  console.log(`📨 ${req.method} ${req.url}`);

  // Rota raiz
  if (req.url === '/' || req.url === '') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <html>
        <head>
          <meta charset="utf-8">
          <title>Allugi Consultoria</title>
        </head>
        <body style="font-family: Arial; text-align: center; padding: 50px; background: #f5f5f5;">
          <h1 style="color: #283273;">✅ Servidor Funcionando!</h1>
          <p style="font-size: 18px;">Allugi Consultoria Online</p>
          <p style="color: #999; margin-top: 30px;">Plataforma de Análise de Marketing</p>
        </body>
      </html>
    `);
    return;
  }

  // Serve static files from src
  const filePath = path.join(__dirname, 'src', req.url);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const content = fs.readFileSync(filePath);
    const ext = path.extname(filePath);
    const mimeType = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml'
    }[ext] || 'text/plain';

    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(content);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
});

server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Visit http://localhost:${PORT}`);
});
