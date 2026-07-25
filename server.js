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
app.use(express.static(join(__dirname, 'src')));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Allugi - Consultoria</title>
      <style>
        body { font-family: Arial; max-width: 800px; margin: 100px auto; padding: 20px; }
        h1 { color: #283273; }
        .form-group { margin: 20px 0; }
        input, textarea, select { width: 100%; padding: 10px; margin: 5px 0; }
        button { background: #283273; color: white; padding: 10px 20px; border: none; cursor: pointer; }
      </style>
    </head>
    <body>
      <h1>📋 Consultoria Allugi</h1>
      <p>Formulário de Análise de Marketing</p>
      <form>
        <div class="form-group">
          <label>Nome da Empresa:</label>
          <input type="text" placeholder="Digite o nome">
        </div>
        <div class="form-group">
          <label>Email:</label>
          <input type="email" placeholder="seu@email.com">
        </div>
        <button type="submit">Enviar</button>
      </form>
    </body>
    </html>
  `);
});

app.get('/resultado', (req, res) => {
  res.sendFile(join(__dirname, 'src/resultado-formulario.html'));
});

app.get('/pagamento', (req, res) => {
  res.sendFile(join(__dirname, 'src/pagamento.html'));
});

app.get('/obrigado', (req, res) => {
  res.sendFile(join(__dirname, 'src/obrigado.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
