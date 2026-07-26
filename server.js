import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

console.log('🚀 Starting server...');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

console.log('📁 __dirname:', __dirname);
console.log('🔌 PORT:', PORT);

app.use(cors());
app.use(express.json());

// Teste básico
app.get('/', (req, res) => {
  console.log('✅ GET / - Servidor respondendo!');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`
    <html>
      <head>
        <title>Allugi Consultoria</title>
        <meta charset="utf-8">
      </head>
      <body style="font-family: Arial; text-align: center; padding: 50px;">
        <h1>✅ Servidor Funcionando!</h1>
        <p>Allugi Consultoria Online - Teste Básico</p>
      </body>
    </html>
  `);
});

app.use(express.static(join(__dirname, 'src')));

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
