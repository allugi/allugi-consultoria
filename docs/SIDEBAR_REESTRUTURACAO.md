# 📋 Reestruturação do Sidebar - Allugi

## Estrutura Nova

```
📊 Dashboard
├── Dashboard Geral (KPIs, gráficos, timeline)
└── [Manter o que existe + melhorias]

⚡ Comercial
├── 📋 Contatos (Lista completa, filtros, busca)
├── 📄 Propostas (Criar, editar, status, timeline)
├── 🔄 CRM (Pipeline, funil, atividades)
├── 💬 WhatsApp (Integração, chat, automações)
└── 📈 Dashboard Comercial (KPIs de vendas, conversão, pipeline)

📱 Marketing
├── 📊 Planejamento Estratégico (Existing: Dashboard, Acordeão, Ações, Estratégia)
├── 🎯 Branding (Posicionamento, marca, assets)
├── 📸 Social Media (Calendário, posts, engajamento)
├── 🛠️ CRM Operacional (Leads, conversão, automações)
├── 💰 Tráfego Pago (Google Ads, Meta Ads, ROI)
└── 📈 Dashboard Marketing (KPIs marketing, ROI, conversão)

📈 Relatórios
├── 🏆 Ranking de Vendedores (Top 10, comissões, performance)
├── 📊 Engajamento Redes Sociais (Por rede, por dia, tendências)
├── 🎯 Metas (vs Realizado, progresso, análise)
├── 🔍 Análise Redes Sociais (Detalhado, hashtags, comentários)
└── 💾 Download de Relatórios (PDF/Excel, separado ou completo)

⚙️ Configurações
├── 👥 Equipe (Usuários, roles, departamentos)
├── 🔔 Notificações (Preferências, alertas, templates)
├── 🔐 Usuários & Permissões (Gerenciamento de acessos)
├── 💳 Pagamentos (Planos, histórico, faturas)
└── 📝 Históricos (Logs, auditoria, backup)
```

---

## Fases de Implementação

### Fase 1: Reestruturar Sidebar & Rotas (1-2h)
- [ ] Criar novo componente SidebarMenu com submenu support
- [ ] Reorganizar rotas no main.tsx
- [ ] Criar hubs para cada seção (Comercial, Marketing, etc)

### Fase 2: Melhorar Dashboard (2-3h)
- [ ] Adicionar mais KPIs
- [ ] Melhorar visualizações
- [ ] Adicionar timeline de eventos

### Fase 3: Comercial Module (4-6h)
- [ ] Página de Contatos (lista, filtro, busca)
- [ ] Página de Propostas (CRUD, status)
- [ ] Dashboard Comercial (KPIs específicos)
- [ ] Placeholder para WhatsApp

### Fase 4: Marketing Enhancements (3-4h)
- [ ] Dashboard Marketing
- [ ] Branding Page
- [ ] CRM Operacional
- [ ] Tráfego Pago integrado

### Fase 5: Relatórios Advanced (4-5h)
- [ ] Ranking de Vendedores
- [ ] Engajamento Social
- [ ] Metas Tracking
- [ ] Export PDF/Excel

### Fase 6: Configurações Complete (2-3h)
- [ ] Gerenciamento de Equipe
- [ ] Notificações
- [ ] Históricos & Auditoria
- [ ] Pagamentos

---

## Nova Sidebar Component

```tsx
interface MenuSection {
  id: string
  label: string
  icon: string
  items: MenuItem[]
}

interface MenuItem {
  label: string
  path: string
  icon?: string
}
```

Cada seção terá um hub page que mostra os submódulos como cards clicáveis.

---

## Rotas Principais

```
/dashboard                           → Dashboard Geral
/comercial                           → Hub Comercial
/comercial/contatos                  → Lista de Contatos
/comercial/propostas                 → Propostas
/comercial/crm                       → CRM
/comercial/whatsapp                  → WhatsApp
/comercial/dashboard                 → Dashboard Comercial

/marketing                           → Hub Marketing
/marketing/planejamento-estrategico  → Planejamento (existing)
/marketing/branding                  → Branding
/marketing/social                    → Social Media (existing)
/marketing/crm-operacional           → CRM Operacional
/marketing/trafego-pago              → Tráfego Pago
/marketing/dashboard                 → Dashboard Marketing

/relatorios                          → Hub Relatórios
/relatorios/vendedores               → Ranking Vendedores
/relatorios/redes-sociais            → Engajamento Social
/relatorios/metas                    → Metas
/relatorios/analise-redes            → Análise Redes
/relatorios/download                 → Download

/configuracoes                       → Hub Config
/configuracoes/equipe                → Equipe
/configuracoes/notificacoes          → Notificações
/configuracoes/usuarios              → Usuários & Permissões
/configuracoes/pagamentos            → Pagamentos
/configuracoes/historicos            → Históricos
```

---

## Próximos Passos

1. Confirmar se quer fazer tudo nessa ordem
2. Começar com **Fase 1** (Sidebar + Rotas)
3. Depois melhorar Dashboard
4. Depois construir módulos comercial/marketing
5. Por fim, relatórios e configurações avançadas

Quer que eu comece? 🚀
