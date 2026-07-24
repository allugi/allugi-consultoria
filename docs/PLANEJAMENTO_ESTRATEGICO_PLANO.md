# 📋 Plano de Implementação - Módulo Planejamento Estratégico

## Fases de Desenvolvimento

### Fase 1: Schema & Infrastructure (1-2h)
- [ ] Criar tabelas Supabase:
  - `strategic_plans` (planejamentos)
  - `strategic_objectives` (objetivos)
  - `strategic_actions` (ações/tarefas)
  - `strategic_timeline` (histórico)
  - `strategic_files` (arquivos)
  - `strategic_versions` (versões)
  - `brand_positioning` (marca)
  - `target_audience` (ICP/persona)
  - `value_proposition` (proposta de valor)
  - `strategic_okrs` (metas e OKRs)

### Fase 2: Dashboard Principal (1-2h)
- [ ] Página `/planejamento-estrategico`
- [ ] Cards de resumo:
  - Status dos planejamentos
  - Objetivos em andamento
  - Metas concluídas
  - Próximas ações
- [ ] Barra de progresso geral
- [ ] Timeline resumida

### Fase 3: Acordeão de Períodos (2-3h)
- [ ] Componente acordeão (curto/médio/longo prazo)
- [ ] Campos para cada período:
  - Objetivos
  - Metas
  - Resultados esperados
  - Indicadores
  - Orçamento
  - Responsáveis
  - Prazos
  - Observações

### Fase 4: Plano de Ação (2-3h)
- [ ] Página `/planejamento-estrategico/acoes`
- [ ] Visualização em Lista
- [ ] Visualização em Kanban
- [ ] CRUD completo de tarefas
- [ ] Filtros e ordenação

### Fase 5: Progresso & Gamificação (2h)
- [ ] Barra de progresso visual
- [ ] Checklist inteligente
- [ ] Indicador de saúde (🟢🟡🔴)
- [ ] Cálculo automático de progresso

### Fase 6: Secções Estratégicas (3-4h)
- [ ] Posicionamento da marca
- [ ] Público-alvo e ICP
- [ ] Proposta de valor
- [ ] Metas e OKRs
- [ ] Formulários com validação

### Fase 7: Timeline & Histórico (2h)
- [ ] Timeline visual de eventos
- [ ] Histórico de versões
- [ ] Comparador de versões
- [ ] Restauração de versões

### Fase 8: Upload & Anexos (1-2h)
- [ ] Sistema de upload de arquivos
- [ ] Galeria de anexos
- [ ] Previewers (PDF, imagens, vídeos)

---

## Estrutura de Dados

### strategic_plans
```sql
- id (UUID)
- company_id (FK)
- name (string)
- description (text)
- status (active/archived)
- start_date
- end_date
- overall_progress (%)
- health_status (green/yellow/red)
- created_at
- updated_at
```

### strategic_objectives (por período)
```sql
- id (UUID)
- plan_id (FK)
- period (short/medium/long)
- objective (text)
- goal (text)
- expected_results (text)
- success_indicators (text)
- budget (decimal)
- responsible (text)
- deadline (date)
- notes (text)
- status (planned/in_progress/completed)
```

### strategic_actions
```sql
- id (UUID)
- objective_id (FK)
- title (string)
- description (text)
- responsible_id (FK auth.users)
- start_date
- end_date
- priority (low/medium/high)
- status (not_started/in_progress/completed/overdue)
- progress (%)
- created_at
```

### strategic_timeline
```sql
- id (UUID)
- plan_id (FK)
- event_type (created/updated/task_added/goal_completed/file_uploaded/status_changed/comment_added)
- description (text)
- user_id (FK)
- created_at
```

### strategic_files
```sql
- id (UUID)
- plan_id (FK)
- file_name (string)
- file_type (pdf/ppt/docx/xlsx/image/video)
- file_url (string)
- uploaded_by (FK)
- uploaded_at
```

### strategic_versions
```sql
- id (UUID)
- plan_id (FK)
- version_number (int)
- changes_description (text)
- created_by (FK)
- created_at
- data_snapshot (jsonb)
```

### brand_positioning
```sql
- id (UUID)
- plan_id (FK)
- mission (text)
- vision (text)
- values (text[])
- positioning (text)
- differentials (text)
- voice_tone (text)
- archetype (text)
- competitors (text)
- benchmark (text)
- swot_analysis (jsonb)
```

### target_audience
```sql
- id (UUID)
- plan_id (FK)
- icp_segment (text)
- icp_company_size (text)
- icp_revenue_range (text)
- icp_region (text)
- icp_decision_maker (text)
- persona_name (text)
- persona_role (text)
- persona_goals (text)
- persona_pain_points (text)
- persona_needs (text)
- persona_objections (text)
- buying_process (text)
```

### value_proposition
```sql
- id (UUID)
- plan_id (FK)
- problem_solved (text)
- solution_offered (text)
- benefits (text[])
- differentials (text[])
- social_proof (text)
- success_cases (text)
- expected_results (text)
```

### strategic_okrs
```sql
- id (UUID)
- plan_id (FK)
- objective (text)
- key_result_1 (text)
- key_result_2 (text)
- key_result_3 (text)
- target_value (decimal)
- current_value (decimal)
- progress (%)
- status (in_progress/completed/not_started)
```

---

## Rotas Planejadas

```
/planejamento-estrategico                 - Dashboard principal
/planejamento-estrategico/novo            - Criar planejamento
/planejamento-estrategico/:id              - Detalhes
/planejamento-estrategico/:id/acoes       - Plano de ação
/planejamento-estrategico/:id/marca       - Posicionamento marca
/planejamento-estrategico/:id/publico     - Público-alvo & ICP
/planejamento-estrategico/:id/proposta    - Proposta de valor
/planejamento-estrategico/:id/okrs        - Metas e OKRs
/planejamento-estrategico/:id/timeline    - Timeline
/planejamento-estrategico/:id/versoes     - Histórico de versões
/planejamento-estrategico/:id/arquivos    - Anexos
```

---

## Componentes React Reutilizáveis

- `ProgressBar` - Barra de progresso com percentual
- `HealthIndicator` - 🟢🟡🔴 indicador de saúde
- `Accordion` - Componente acordeão
- `KanbanBoard` - Quadro kanban para tarefas
- `TimelineEvent` - Evento na timeline
- `FileUpload` - Upload de arquivos
- `OKRCard` - Card para OKR

---

## Estimativa Total

- **Desenvolvimento:** 15-20 horas
- **Fases:** 8 fases de 1-4 horas cada
- **Commit por fase:** sim, para tester progressivamente

---

## Próximas Ações

1. Confirmar se quer fazer tudo isso ou priorizar certas fases
2. Iniciar Fase 1: Schema SQL
3. Iniciar Fase 2: Dashboard
4. Testar cada fase antes de avançar

**Você quer que eu comece? E qual abordagem prefere:**

A) Fazer tudo em sequência (mais completo)
B) Fazer o essencial primeiro (Fase 1-2-3), depois refinamentos
C) Outro priorização?
