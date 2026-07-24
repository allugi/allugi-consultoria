# Fase 4: IA Inteligente - Instruções de Implementação

## 🚀 Visão Geral

A Fase 4 implementa integração com Claude API (Anthropic) para análises de diagnóstico estratégico inteligentes. O sistema analisa dados institucionais e colaborativos, gerando recomendações baseadas em IA.

## 📋 Arquivos Criados

### 1. **src/lib/ia-service.ts**
Serviço central de IA com três funções principais:

#### `analisarDiagnosticoInstitucional(diagnostico)`
Analisa o diagnóstico do gestor/admin e retorna:
- Resumo executivo da situação atual
- Nível de maturidade (Inicial, Desenvolvimento, Consolidado, Otimizado)
- Análise SWOT (Pontos Fortes, Fracos, Oportunidades, Riscos)
- 5 recomendações estratégicas

**Uso:**
```typescript
const analise = await analisarDiagnosticoInstitucional(diagnosticoGestor)
```

#### `analisarAlinhamento(diagnosticoGestor, diagnosticosColaboradores)`
Compara visão da liderança com percepção da equipe:
- Percentual de alinhamento geral (0-100%)
- Alinhamento por dimensão
- Principais divergências identificadas
- Consensos da equipe
- Recomendações para melhorar alinhamento

**Uso:**
```typescript
const alinhamento = await analisarAlinhamento(gestor, colaboradores)
```

#### `sugerirOKRs(diagnostico, analiseIA)`
Gera sugestões de OKRs baseadas na análise:
- 4-5 objetivos estratégicos para 12 meses
- Alinhamento com objetivos declarados
- Key Results mensuráveis e ambiciosos
- Priorização por impacto

**Uso:**
```typescript
const okrs = await sugerirOKRs(diagnostico, analise)
```

### 2. **src/components/resultado-diagnostico-ia.tsx**
Componente visual que exibe resultados de análise:
- Resumo executivo com ícones
- Barra de progresso de maturidade
- Grid visual de SWOT (com cores)
- Alinhamento por dimensão
- Divergências com impacto no negócio
- Consensos identificados
- OKRs sugeridas com priorização
- Botões de exportação e ação

### 3. **src/components/diagnostico-resultados.tsx**
Modal que encapsula a experiência de análise:
- Prompt inicial incentivando análise
- Integração com ia-service
- Loading state durante processamento
- Exibição de resultados via ResultadoDiagnosticoIA
- Tratamento de erros com retry
- Botões de salvar e fechar

## ⚙️ Configuração

### 1. Obter Chave API
1. Acesse https://console.anthropic.com/
2. Crie uma conta ou faça login
3. Navegue para "API Keys"
4. Clique em "Create Key"
5. Copie a chave gerada

### 2. Configurar Variáveis de Ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env.local

# Editar .env.local e adicionar sua chave
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

### 3. Verificar Configuração
```bash
# O arquivo .env.local é automaticamente carregado pelo Vite
# Nenhuma reinicialização necessária - apenas recarregue o navegador
```

## 🧪 Testando a Integração

### 1. Acessar o Diagnóstico
```
http://localhost:5173/demo/planejamento-v2
```

### 2. Preencher Diagnóstico Institucional
- Abra a seção "Diagnóstico"
- Complete as 8 seções (Empresa, Direcionamento, etc.)
- Clique em "Gerar Diagnóstico com IA"

### 3. Visualizar Resultados
O sistema exibirá:
- Análise institucional com SWOT
- Nível de maturidade
- OKRs sugeridas
- Recomendações estratégicas

## 🔄 Fluxo de Funcionamento

```
Usuário preenche diagnóstico
          ↓
Clica "Gerar Diagnóstico com IA"
          ↓
DiagnosticoResultados abre modal
          ↓
Usuário clica "Gerar Diagnóstico Completo"
          ↓
ia-service.ts processa dados
          ↓
Claude API retorna análise em JSON
          ↓
ResultadoDiagnosticoIA exibe resultados
          ↓
Usuário vê recomendações e OKRs
```

## 📊 Estrutura de Dados

### Resposta de Análise Institucional
```typescript
{
  resumoExecutivo: string
  maturidadeEmpresa: {
    nivel: 'Inicial' | 'Desenvolvimento' | 'Consolidado' | 'Otimizado'
    percentual: 0-100
  }
  pontosFortes: string[]
  pontosFracos: string[]
  oportunidades: string[]
  riscos: string[]
  recomendacoes: string[]
}
```

### Resposta de Alinhamento
```typescript
{
  percentualGeral: 0-100
  porDimensao: {
    [dimensao]: {
      percentual: 0-100
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

### Resposta de OKRs
```typescript
{
  okrs: Array<{
    objetivo: string
    racional: string
    keyResults: string[]
    prioridade: 'Alta' | 'Média' | 'Baixa'
  }>
}
```

## 🎨 Design & UX

### Visual Design
- **Paleta Neutra**: Branco, cinza (200/300), azul #283273 para destaque
- **Sem Emojis**: Apenas ícones Lucide
- **Cards com Cores Sutis**: Fundo colorido leve (50) com borda
- **Progress Bars**: Gradient azul para engajamento visual

### Componentes de Resultado
- **SWOT**: Grid 2x2 com cores: Verde (Fortes), Laranja (Fracos), Azul (Oportunidades), Vermelho (Riscos)
- **Alinhamento**: Barras com cores dinâmicas (Verde ≥80%, Azul ≥60%, Laranja <60%)
- **OKRs**: Cards com borda colorida à esquerda indicando prioridade

## 🚫 Modo de Fallback

Se a chave API não estiver configurada:
1. Sistema detecta `VITE_ANTHROPIC_API_KEY` faltando
2. Usa dados mock profissionais estruturados
3. Continua funcionando para prototipagem
4. Log no console avisa sobre falta de chave

## 🔐 Segurança

- **Chave API**: Nunca commit em git (use .env.local)
- **Request Origin**: Claude API valida requisições
- **CORS**: Handled transparently pelo Anthropic
- **Dados Sensíveis**: Não são armazenados (processados inline)

## 📱 Responsividade

- Mobile: Cards stack verticalmente
- Grid 2x2 em desktop → 1 coluna em mobile
- Textarea e inputs full-width
- Progress bars adaptativos

## ⚡ Performance

- Análises são async/await
- Loading state durante processamento
- Timeout de 30s para requisição
- Mock fallback rápido se API falhar

## 🔧 Próximas Fases

- **Fase 5**: Persistência em Supabase (salvar análises)
- **Fase 6**: Relatório comparativo institucional vs colaboradores
- **Fase 7**: Export em PDF com branding customizado

## 🆘 Troubleshooting

### "VITE_ANTHROPIC_API_KEY não configurada"
```
✓ Copie .env.example para .env.local
✓ Adicione sua chave real
✓ Recarregue o navegador
```

### "Erro ao chamar Claude API"
```
✓ Verifique se a chave está correta
✓ Confira se a chave ainda é válida em console.anthropic.com
✓ Verifique conexão com internet
✓ Veja console.log() para detalhes
```

### Resultados com dados mock
```
✓ Indica que a API não foi configurada
✓ Sistema continua funcionando para testes
✓ Configure VITE_ANTHROPIC_API_KEY para usar IA real
```

## 📚 Referências

- Claude API: https://docs.anthropic.com/
- Modelos disponíveis: claude-3-5-sonnet-20241022
- OKRs Framework: https://en.wikipedia.org/wiki/OKR
- SWOT Analysis: https://en.wikipedia.org/wiki/SWOT_analysis
