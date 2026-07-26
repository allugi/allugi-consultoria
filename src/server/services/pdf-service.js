import pdf from 'html-pdf';
import { promisify } from 'util';

const createPdf = promisify(pdf.create);

export async function htmlToPdf(htmlContent) {
  try {
    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      timeout: 30000
    };

    const pdfBuffer = await createPdf(htmlContent, options);
    console.log('✅ PDF gerado com sucesso');
    return pdfBuffer;
  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error);
    throw error;
  }
}
