# Fase 5: Análise Comparativa - Alinhamento Institucional vs Colaboradores

## 🎯 Objetivo

Comparar a visão estratégica da liderança com a percepção operacional da equipe, identificando divergências, consensos e gerando recomendações para melhorar alinhamento organizacional.

## 📦 Arquivos Criados

### 1. **src/components/analise-alinhamento.tsx** (380 linhas)
Componente visual que exibe resultados de alinhamento de forma clara e acionável.

**Componentes internos:**
- Alinhamento Geral (circular progress com percentual)
- Alinhamento por Dimensão (barras com cores dinâmicas)
- Principais Divergências (cards expansíveis)
- Consensos (listagem com checkmarks)
- Recomendações (numeradas com badges)
- Próximas Ações (guia de implementação)

**Features:**
- Interpretação automática de percentuais (Excelente/Bom/Precisa melhorar)
- Cards coloridos: Verde (>=80%), Azul (>=60%), Laranja (<60%)
- Divergências expandíveis mostrando visão liderança vs equipe
- Design responsivo mobile-first

### 2. **src/components/diagnostico-comparativo.tsx** (310 linhas)
Orquestrador que coordena a análise comparativa.

**Responsabilidades:**
- Coleta dados do gestor e colaboradores
- Formata dados para o serviço de IA
- Chama `analisarAlinhamento()` da ia-service
- Exibe status de coleta de dados
- Renderiza AnaliseAlinhamentoComponent com resultados

**Estados:**
- `loading`: Processamento em andamento
- `analise`: Resultados retornados
- `showAnalise`: Toggle para mostrar componente de resultados
- `error`: Mensagens de erro com retry

### 3. **src/components/diagnostico-exemplo-comparativo.tsx**
Exemplo completo de uso com dados fictícios de empresa.

**Inclui:**
- Dados de exemplo do gestor (3 colaboradores)
- Dados de exemplo dos colaboradores (3 respostas)
- Documentação de como integrar

## 🔌 Integração com ia-service.ts

O serviço `analisarAlinhamento()` já existe e retorna:

```typescript
interface AnaliseAlinhamento {
  percentualGeral: number                    // 0-100
  porDimensao: {
    [dimensao: string]: {
      percentual: number
      interpretacao: string
    }
  }
  principaisDivergencias: Array<{
    dimensao: string
    visaoGestor: string
    visaoEquipe: string
    impacto: string
  }>
  consensos: string[]
  recomendacoes: string[]
}
```

## 📊 Fluxo de Uso

```
Gestor preenche Diagnóstico Institucional
         ↓
Colaboradores respondem questionários
         ↓
Respostas são coletadas em base de dados
         ↓
Admin acessa "Análise Comparativa"
         ↓
DiagnosticoComparativo exibe status
         ↓
Admin clica "Gerar Análise de Alinhamento"
         ↓
ia-service.analisarAlinhamento() é chamado
         ↓
Claude API processa e compara dados
         ↓
AnaliseAlinhamentoComponent exibe resultados
         ↓
Admin vê alinhamento, divergências e recomendações
```

## 🚀 Como Integrar

### 1. No componente planejamento-estrategico-v2.tsx

```typescript
import DiagnosticoComparativo from '@/components/diagnostico-comparativo'

// No JSX:
{activeModule === 'diagnostico' && (
  <DiagnosticoComparativo
    diagnosticoGestor={diagnosticoGestorData}
    diagnosticosColaboradores={respostasColaboradoresData}
  />
)}
```

### 2. Estrutura de dados esperada

**DiagnosticoGestorData:**
```typescript
{
  atividadePrincipal: string         // O que empresa faz
  diferencialCompetitivo: string     // O que diferencia
  estagio: string                    // Startup/Crescimento/etc
  objetivos: string[]                // 3 objetivos para 12 meses
  colaboradores: number              // Número de pessoas
  departamentos: string[]            // Departamentos da empresa
  organograma: string                // Estrutura hierárquica
  processoDocumentados: string       // Sim/Não/Parcialmente
  processospadronizados: string      // Sim/Não/Em progresso
  dificuldadesOperacionais: string[] // Principais problemas
  culturaTipo: string                // Inovadora/Tradicional/etc
  culturaDescricao: string           // Descrição livre
  desafios: string[]                 // 3 principais desafios
  riscos: string                     // Descrição de riscos
  autoavaliacao: {
    [dimensao: string]: number       // Escala 0-10
  }
}
```

**DiagnosticoColaboradorData:**
```typescript
{
  nome: string                       // Nome do colaborador
  setor: string                      // Departamento
  atividadePrincipal: string         // Visão dele sobre atividade
  diferencialCompetitivo: string     // Visão dele sobre diferencial
  desafios: string[]                 // Desafios que ele percebe
  respostasSetor: {
    [pergunta: string]: string       // Respostas setor-específicas
  }
  autoavaliacao: {
    [dimensao: string]: number       // Escala 0-10
  }
}
```

### 3. Exemplo prático

```typescript
const diagnosticoGestor = {
  atividadePrincipal: 'SaaS de RevOps',
  diferencialCompetitivo: 'IA consultiva integrada',
  estagio: 'Crescimento',
  objetivos: ['Aumentar faturamento', 'Expandir mercado'],
  colaboradores: 15,
  // ... outros campos
}

const diagnosticosColaboradores = [
  {
    nome: 'João Silva',
    setor: 'Comercial',
    atividadePrincipal: 'Soluções SaaS de RevOps',
    // ... outros campos
  },
  // ... mais colaboradores
]

return (
  <DiagnosticoComparativo
    diagnosticoGestor={diagnosticoGestor}
    diagnosticosColaboradores={diagnosticosColaboradores}
  />
)
```

## 🎨 Componentes Visuais

### Status de Coleta
Mostra 3 cards com status:
- ✓ Diagnóstico Institucional (Completo)
- ✓ Diagnósticos Colaboradores (N respostas)
- → Análise Comparativa (Pendente)

### Comparação Lado a Lado
**Esquerda:** Visão da Liderança
- Atividade Principal
- Diferencial Competitivo
- Estágio
- Objetivos (badges)

**Direita:** Visão Consolidada da Equipe
- Número de respondentes
- Setores representados
- Lista de colaboradores

### Resultado de Alinhamento

**Alinhamento Geral:**
- Número grande (ex: 78%)
- Círculo visual com percentual
- Interpretação qualitativa

**Por Dimensão:**
- 4 dimensões principais
- Barras coloridas (verde/azul/laranja)
- Interpretação por dimensão

**Divergências:**
- Cards expansíveis
- Visão liderança vs visão equipe
- Impacto no negócio (texto)

**Consensos:**
- Lista com checkmarks verdes
- Pontos de concordância total

**Recomendações:**
- 4-5 recomendações numeradas
- Cards azuis com badges

## 📈 Interpretação de Alinhamento

| Percentual | Interpretação | Ação |
|----------|--------------|------|
| 85-100% | Excelente | Manter e fortalecer |
| 70-84% | Bom | Revisar pontos fracos |
| 50-69% | Moderado | Workshops de alinhamento |
| <50% | Fraco | Ação urgente necessária |

## 🔄 Fluxo com Componente Já Pronto

1. **Coleta de dados:**
   - Gestor completa diagnóstico institucional
   - Colaboradores completam diagnósticos individuais
   - Sistema coleta e armazena respostas

2. **Preparação:**
   - Dados são formatados para o serviço de IA
   - Validação de campos obrigatórios
   - Consolidação de múltiplas respostas

3. **Análise:**
   - Claude API compara dados
   - Identifica padrões de divergência
   - Calcula percentuais de alinhamento
   - Gera recomendações contextualizadas

4. **Visualização:**
   - AnaliseAlinhamentoComponent exibe resultados
   - Cards coloridos por tipo de informação
   - Expandíveis para detalhes
   - Botões de ação (exportar, plano de ação)

## 💡 Insights Gerados

A análise gera insights sobre:

1. **Divergências críticas** - Onde liderança e equipe discordam
2. **Consensos** - Onde há total alinhamento
3. **Gaps operacionais** - Diferenças entre visão vs realidade
4. **Maturity gaps** - Diferenças em percepção de maturidade
5. **Impactos no negócio** - Como divergências afetam operações

## 🎯 Recomendações Típicas

O sistema pode recomendar:
- Reuniões de alinhamento estratégico
- Comunicação mais clara de visão/prioridades
- Implementação de processos
- Capacitação de equipes
- Ajuste de objetivos

## 🔧 Customizações Possíveis

### Adicionar dimensões
Modifique a função `consolidarDiagnosticosColaboradores()` em ia-service.ts para incluir mais dimensões na comparação.

### Alterar cores
Em `analise-alinhamento.tsx`, funções `getAlinhamentoBg()` e `getAlinhamentoColor()` controlam a paleta.

### Mudar interpretações
Atualize as strings de interpretação em `getAlinhamentoInterpretacao()`.

### Adicionar campos
Estenda interfaces `DiagnosticoGestorData` e `DiagnosticoColaboradorData`.

## 📝 Próximas Fases

- **Fase 6**: Persistência em Supabase
  - Salvar análises de alinhamento
  - Histórico de comparações
  - Tracking de melhoria ao longo do tempo

- **Fase 7**: Relatórios em PDF
  - Exportar análise em PDF profissional
  - Incluir gráficos e visualizações
  - Branding customizável

## ✅ Checklist de Integração

- [ ] Importar `DiagnosticoComparativo` no componente principal
- [ ] Passar dados do gestor e colaboradores
- [ ] Testar com dados de exemplo
- [ ] Verificar se Claude API está configurada
- [ ] Testar geração de análise
- [ ] Validar interpretação dos resultados
- [ ] Testar responsividade mobile
- [ ] Implementar persistência (Fase 6)

## 🐛 Troubleshooting

**"Erro ao gerar análise"**
- Verifique se VITE_ANTHROPIC_API_KEY está configurada
- Confira conexão com internet
- Verifique logs do navegador (F12 > Console)

**"Nenhum colaborador respondente"**
- Sistema desabilita botão se não houver respostas
- Convide colaboradores antes de usar análise comparativa
- Aguarde que completem diagnósticos

**"Resultados parecem genéricos"**
- Sistema usa fallback mock se API falhar
- Configure chave de API real para análises personalizadas
- Revise dados fornecidos (gestores vs colaboradores)

## 📚 Referências

- Conceito OKR: https://www.ycombinator.com/library/GV-how-to-run-a-great-all-hands-meeting
- Alinhamento organizacional: https://www.linkedin.com/pulse/organizational-alignment-what-it-is-why-matters/
- Análise SWOT: https://en.wikipedia.org/wiki/SWOT_analysis
