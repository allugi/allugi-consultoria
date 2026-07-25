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
  res.send('✅ SERVIDOR FUNCIONANDO! Allugi Consultoria Online');
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
