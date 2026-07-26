export function generateReportHTML(formData) {
  const {
    companyName,
    industry,
    description,
    platforms,
    socialLinks,
    objective,
    goalDetail,
    competitors,
    paidTraffic,
    budget,
    timestamp
  } = formData;

  const platformsList = Array.isArray(platforms) ? platforms.join(', ') : 'Não informado';
  const competitorsList = competitors ? competitors.split('\n').filter(c => c.trim()).map(c => `<li>${c.trim()}</li>`).join('') : '<li>Não informado</li>';

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Relatório de Análise - ${companyName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: "Inter", sans-serif;
      color: #6B6560;
      line-height: 1.7;
      background: #F3F4FA;
      padding: 40px 20px;
    }
    .container { max-width: 900px; margin: 0 auto; background: white; padding: 50px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #283273; padding-bottom: 20px; }
    h1 { font-family: "Anton", sans-serif; font-size: 36px; color: #1B2154; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 5px; }
    .tagline { font-size: 14px; color: #999; }
    .meta { margin-top: 15px; font-size: 13px; color: #999; }
    .section { margin: 35px 0; }
    h2 { font-family: "Anton", sans-serif; font-size: 20px; color: #283273; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 15px; border-left: 4px solid #C9A968; padding-left: 12px; }
    .info-block { background: #F9F9F7; padding: 15px; border-radius: 8px; margin-bottom: 12px; }
    .info-label { font-weight: 600; color: #1B2154; font-size: 13px; text-transform: uppercase; margin-bottom: 5px; }
    .info-value { color: #6B6560; font-size: 14px; }
    ul { margin-left: 20px; }
    li { margin-bottom: 8px; }
    .recommendation { background: #E8F4F8; border-left: 4px solid #283273; padding: 15px; margin-bottom: 12px; border-radius: 6px; }
    .recommendation strong { color: #1B2154; }
    .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #E0DDD8; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>📊 Análise de Marketing</h1>
      <p class="tagline">Consultoria Estratégica Digital — Allugi Soluções Comerciais</p>
      <div class="meta">Gerado em: ${new Date(timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
    </header>

    <!-- SEÇÃO 1: PERFIL DA EMPRESA -->
    <div class="section">
      <h2>1. Perfil da Empresa</h2>
      <div class="info-block">
        <div class="info-label">Nome da Empresa</div>
        <div class="info-value">${companyName}</div>
      </div>
      <div class="info-block">
        <div class="info-label">Segmento/Indústria</div>
        <div class="info-value">${industry}</div>
      </div>
      <div class="info-block">
        <div class="info-label">Descrição do Negócio</div>
        <div class="info-value">${description}</div>
      </div>
    </div>

    <!-- SEÇÃO 2: PRESENÇA DIGITAL -->
    <div class="section">
      <h2>2. Presença Digital</h2>
      <div class="info-block">
        <div class="info-label">Plataformas Utilizadas</div>
        <div class="info-value">${platformsList}</div>
      </div>
      <div class="info-block">
        <div class="info-label">Perfis e Links</div>
        <div class="info-value" style="white-space: pre-wrap; word-break: break-all;">${socialLinks || 'Não informado'}</div>
      </div>
    </div>

    <!-- SEÇÃO 3: OBJETIVOS -->
    <div class="section">
      <h2>3. Objetivos para 90 Dias</h2>
      <div class="info-block">
        <div class="info-label">Objetivo Principal</div>
        <div class="info-value">${objective}</div>
      </div>
      <div class="info-block">
        <div class="info-label">Detalhamento da Meta</div>
        <div class="info-value">${goalDetail || 'Não informado'}</div>
      </div>
    </div>

    <!-- SEÇÃO 4: ANÁLISE COMPETITIVA -->
    <div class="section">
      <h2>4. Análise Competitiva</h2>
      <div class="info-block">
        <div class="info-label">Principais Concorrentes</div>
        <ul style="margin-top: 10px;">
          ${competitorsList}
        </ul>
      </div>
    </div>

    <!-- SEÇÃO 5: TRÁFEGO PAGO -->
    <div class="section">
      <h2>5. Estratégia de Tráfego Pago</h2>
      <div class="info-block">
        <div class="info-label">Interesse em Tráfego Pago</div>
        <div class="info-value">${paidTraffic === 'sim' ? 'Sim, está interessado' : paidTraffic === 'talvez' ? 'Talvez no futuro' : 'Não está planejando'}</div>
      </div>
      ${paidTraffic === 'sim' ? `
        <div class="info-block">
          <div class="info-label">Orçamento Mensal Disponível</div>
          <div class="info-value">${budget}</div>
        </div>
      ` : ''}
    </div>

    <!-- RECOMENDAÇÕES -->
    <div class="section">
      <h2>6. Recomendações Estratégicas</h2>
      <div class="recommendation">
        <strong>🎯 Foco no Objetivo Principal:</strong> Priorize as ações voltadas para "${objective}". Isso garantirá ROI melhor nos primeiros 90 dias.
      </div>
      <div class="recommendation">
        <strong>📱 Otimização de Plataformas:</strong> Concentre esforços nas redes onde sua audiência é mais engajada. Qualidade sobre quantidade é a regra.
      </div>
      <div class="recommendation">
        <strong>🔍 Monitoramento Competitivo:</strong> Acompanhe os concorrentes listados. Identifique o que funciona para eles e adapte para seu negócio.
      </div>
      <div class="recommendation">
        <strong>💰 Investimento em Mídia Paga:</strong> ${paidTraffic === 'sim' ? `Com orçamento de ${budget}, recomendamos testar diferentes plataformas e otimizar continuamente.` : 'Quando estiver pronto, comece com testes pequenos (5-10% do orçamento) para validar estratégias.'}
      </div>
      <div class="recommendation">
        <strong>📊 Métricas de Sucesso:</strong> Defina KPIs claros e acompanhe semanalmente. Use dados para tomar decisões, não intuição.
      </div>
    </div>

    <div class="footer">
      <p>Este relatório foi gerado automaticamente pela plataforma Allugi Consultoria.</p>
      <p>Para dúvidas ou ajustes, entre em contato com nosso time de especialistas.</p>
    </div>
  </div>
</body>
</html>
  `;
}
