export async function sendAnalysisEmail(email, companyName, pdfBuffer) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY não configurada');
    return false;
  }

  try {
    const formData = new FormData();
    formData.append('from', 'noreply@allugi.com');
    formData.append('to', email);
    formData.append('subject', 'Sua Análise de Marketing - Allugi Consultoria');
    formData.append('html', `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1B2154;">Sua Análise de Marketing Chegou! 🎯</h1>
        <p>Olá <strong>${companyName}</strong>,</p>
        <p>Obrigado por usar a Allugi Consultoria! Em anexo está seu relatório completo com análise e recomendações estratégicas.</p>
        <p style="margin-top: 30px; color: #999; font-size: 12px;">Allugi Soluções Comerciais</p>
      </div>
    `);

    formData.append('attachments', new Blob([pdfBuffer], { type: 'application/pdf' }), 'analise-marketing.pdf');

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: formData
    });

    if (response.ok) {
      console.log('✅ Email enviado para:', email);
      return true;
    } else {
      console.error('❌ Erro ao enviar email:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('❌ Erro no serviço de email:', error);
    return false;
  }
}
