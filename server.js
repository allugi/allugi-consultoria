import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { generateReportHTML } from './src/server/services/report-generator.js';
import { sendAnalysisEmail } from './src/server/services/email-service.js';

console.log('🚀 Starting server...');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

console.log('📁 __dirname:', __dirname);
console.log('🔌 PORT:', PORT);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
  console.log('📨 GET / request received');
  res.sendFile(join(__dirname, 'src/formulario-allugi.html'));
});

app.use(express.static(join(__dirname, 'src')));

app.get('/resultado', (req, res) => {
  res.sendFile(join(__dirname, 'src/resultado-formulario.html'));
});

app.get('/pagamento', (req, res) => {
  res.sendFile(join(__dirname, 'src/pagamento.html'));
});

app.get('/obrigado', (req, res) => {
  res.sendFile(join(__dirname, 'src/obrigado.html'));
});

app.post('/api/processar-pagamento', async (req, res) => {
  console.log('💳 POST /api/processar-pagamento recebido');

  try {
    const formData = req.body;

    if (!formData || !formData.companyName || !formData.email) {
      return res.status(400).json({
        success: false,
        message: 'Dados incompletos'
      });
    }

    console.log('📊 Gerando relatório para:', formData.companyName);
    const reportHTML = generateReportHTML(formData);

    console.log('📧 Enviando email com relatório...');
    const emailSent = await sendAnalysisEmail(formData.email, formData.companyName, reportHTML);

    if (!emailSent) {
      console.warn('⚠️  Email não foi enviado, mas relatório foi gerado');
    }

    return res.json({
      success: true,
      message: 'Pagamento processado com sucesso!',
      report: reportHTML,
      emailSent
    });

  } catch (error) {
    console.error('❌ Erro ao processar pagamento:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao processar pagamento',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
