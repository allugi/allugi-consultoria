export async function sendAnalysisEmail(email, companyName, reportHTML) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY não configurada');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'noreply@allugi.com',
        to: email,
        subject: 'Sua Análise de Marketing - Allugi Consultoria',
        html: `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1B2154;">Sua Análise de Marketing Chegou! 🎯</h1>
            <p>Olá <strong>${companyName}</strong>,</p>
            <p>Obrigado por usar a Allugi Consultoria! Seu relatório completo com análise e recomendações estratégicas está pronto.</p>
            <p>Acesse seu relatório completo na plataforma para visualizar todos os detalhes e recomendações personalizadas.</p>
            <p style="margin-top: 30px; color: #999; font-size: 12px;">Allugi Soluções Comerciais</p>
          </div>
        `
      })
    });

    if (response.ok) {
      console.log('✅ Email enviado para:', email);
      return true;
    } else {
      const errorText = await response.text();
      console.error('❌ Erro ao enviar email:', errorText);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro no serviço de email:', error);
    return false;
  }
}
