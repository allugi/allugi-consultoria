# 🏢 Arquitetura Multi-Tenant da Allugi

## 📋 Visão Geral

A plataforma Allugi foi redesenhada para ser uma **plataforma SaaS multi-tenant**, permitindo que uma única instância atenda múltiplas empresas com dados completamente isolados.

## 🎯 Objetivos Alcançados

✅ **Isolamento de Dados**: Cada empresa possui dados completamente isolados  
✅ **Gestão de Usuários**: Sistema robusto de usuários com papéis e permissões  
✅ **Permissões Escaláveis**: Sistema genérico que funciona para qualquer módulo  
✅ **Auditoria Completa**: Rastreamento de todas as ações dos usuários  
✅ **Seletor de Empresa**: Usuários da Allugi podem trocar entre empresas  
✅ **Gerenciamento de Equipe**: Interface completa para gerenciar membros  
✅ **Convites por Email**: Sistema de convite com tokens de acesso  

---

## 📁 Estrutura de Arquivos Criada

```
src/
├── types/
│   └── multitenant.ts          # Tipos e interfaces
├── contexts/
│   └── CompanyContext.tsx       # Contexto de empresa (núcleo)
├── components/
│   └── CompanySelector.tsx      # Seletor de empresa no header
├── routes/
│   └── configuracoes-equipe-multitenant.tsx  # Gerenciamento de equipe
└── lib/
    └── permissions.ts           # Utilitários de permissão

database/
└── schema-multitenant.sql       # Schema completo do banco de dados

ARQUITETURA_MULTITENANT.md      # Esta documentação
```

---

## 🗄️ Schema do Banco de Dados

### Tabelas Principais

#### 1. **companies** - Empresas
Armazena informações de cada empresa na plataforma.
```sql
- id (UUID)
- name (string)
- slug (unique)
- status (active, inactive, suspended, deleted)
- createdAt, updatedAt
```

#### 2. **users** - Usuários
Usuários únicos da plataforma.
```sql
- id (UUID)
- email (unique)
- firstName, lastName
- phone, avatarUrl
- last_login_at
```

#### 3. **user_companies** - Relacionamento Usuário-Empresa
Conecta usuários a empresas com roles específicos.
```sql
- id (UUID)
- user_id, company_id, role_id
- status (pending, active, inactive, blocked)
- job_title, department
- invitation_token, invitation_expires_at
```

#### 4. **roles** - Papéis/Perfis
Perfis com níveis de acesso.
```sql
- id (UUID)
- company_id
- name (e.g., "Admin Allugi", "Consultor", "Gestor")
- level (0-10 para ordenação)
- is_system (perfis do sistema)
```

#### 5. **permissions** - Permissões
Permissões granulares por módulo e ação.
```sql
- id (UUID)
- module (crm, planning, diagnosis, etc)
- action (view, create, edit, delete, export, approve)
```

#### 6. **audit_logs** - Auditoria
Rastreamento de todas as ações.
```sql
- id (UUID)
- user_id, company_id
- action, module, resource_id
- description, changes (JSONB)
- ip_address, user_agent
- created_at
```

---

## 🔑 Tipos TypeScript

### Enums Principais

```typescript
enum CompanyStatus { ACTIVE, INACTIVE, SUSPENDED, DELETED }
enum UserStatus { PENDING, ACTIVE, INACTIVE, BLOCKED }
enum RoleLevel { 
  ADMIN_ALLUGI = 0,
  CONSULTANT_ALLUGI = 1,
  COMPANY_MANAGER = 2,
  DEPARTMENT_MANAGER = 3,
  COLLABORATOR = 4,
  VIEWER = 5
}
enum Module { CRM, PLANNING, DIAGNOSIS, MARKETING, FINANCIAL, ... }
enum PermissionAction { VIEW, CREATE, EDIT, DELETE, EXPORT, APPROVE, SHARE }
```

---

## 🎭 Perfis e Permissões

### 1. **Administrador Allugi** (Level 0)
**Acesso total à plataforma**
- ✅ Visualizar todas as empresas
- ✅ Criar/editar/deletar empresas
- ✅ Gerenciar todos os usuários
- ✅ Alterar permissões
- ✅ Acessar todos os módulos
- ✅ Ver seletor de empresa no header

### 2. **Consultor Allugi** (Level 1)
**Consultor externo da Allugi**
- ✅ Acessar apenas empresas atribuídas
- ✅ Realizar diagnósticos
- ✅ Editar planejamentos
- ✅ Criar OKRs
- ✅ Acompanhar indicadores
- ✅ Ver seletor de empresa no header
- ❌ Excluir empresas
- ❌ Gerenciar usuários das empresas

### 3. **Gestor da Empresa** (Level 2)
**Representante do cliente**
- ✅ Visualizar todos os usuários da empresa
- ✅ Convidar colaboradores
- ✅ Responder diagnóstico institucional
- ✅ Criar planejamentos
- ✅ Aprovar estratégias
- ✅ Visualizar dashboards
- ✅ Acessar relatórios
- ❌ Acessar outras empresas
- ❌ Gerenciar permissões

### 4. **Gerente** (Level 3)
**Gerente de departamento**
- ✅ Visualizar departamentos permitidos
- ✅ Responder diagnósticos
- ✅ Criar tarefas
- ✅ Atualizar estratégias
- ✅ Acompanhar indicadores
- ❌ Visualizar outras equipes
- ❌ Alterar departamentos

### 5. **Colaborador** (Level 4)
**Membro da equipe**
- ✅ Responder pesquisas/diagnósticos
- ✅ Visualizar tarefas
- ✅ Concluir atividades
- ✅ Anexar arquivos
- ✅ Comentar em itens
- ❌ Criar conteúdo novo
- ❌ Alterar configurações

### 6. **Visualizador** (Level 5)
**Apenas leitura**
- ✅ Visualizar dashboards
- ✅ Visualizar relatórios
- ✅ Visualizar comentários
- ❌ Editar qualquer conteúdo
- ❌ Criar recursos

---

## 🔐 React Context - CompanyContext

### Principais Funcionalidades

```typescript
// Usar o contexto
const { 
  user,           // Usuário autenticado
  currentCompany, // Empresa atual
  currentRole,    // Papel do usuário
  companies,      // Empresas acessíveis
  canAccess,      // Verificar permissão
  switchCompany   // Trocar empresa
} = useCompany()

// Hooks auxiliares
const { company } = useCurrentCompany()
const { user, role } = useCurrentUser()
const hasPermission = useHasPermission(Module.CRM, 'edit')
```

### Verificação de Permissões

```typescript
// Verificar acesso
if (canAccess('crm', 'edit')) {
  // Usuário pode editar CRM
}

// Verificar todas as ações de um módulo
const crmActions = getPermissionsForModule('crm')
```

---

## 🏠 Seletor de Empresa

Aparece no header superior para usuários da Allugi (Admin/Consultor).

**Características:**
- ✅ Lista todas as empresas acessíveis
- ✅ Mostra empresa atual como selecionada
- ✅ Permite trocar empresa sem novo login
- ✅ Mostra informações da empresa (logo, indústria)
- ✅ Exibe usuário atual e perfil
- ✅ Não aparece para usuários normais

---

## 👥 Gerenciamento de Equipe

### Tela: Configurações > Equipe

**Funcionalidades:**
- ✅ Listar todos os membros da empresa
- ✅ Filtrar por status (pendente, ativo, inativo, bloqueado)
- ✅ Buscar por nome ou email
- ✅ Visualizar cargo, departamento e perfil
- ✅ Convidar novos membros via modal
- ✅ Editar informações de membros
- ✅ Remover membros
- ✅ Mostrar estatísticas de equipe

### Convite de Membros

**Fluxo:**
1. Admin clica "Convidar Membro"
2. Abre modal com campos:
   - Nome (primeiro + sobrenome)
   - Email
   - Cargo (opcional)
   - Departamento
   - Perfil (role)
3. Sistema envia email com link de acesso
4. Usuário clica link, cria senha
5. Status muda para "Ativo"

---

## 📝 Auditoria

### O que é Rastreado

- ✅ Login/Logout
- ✅ Troca de empresa
- ✅ CRUD de usuários
- ✅ Mudanças de permissão
- ✅ CRUD de planejamentos
- ✅ Criação de diagnósticos
- ✅ Upload/Download de arquivos
- ✅ Tudo que envolve dados da empresa

### Estrutura

```typescript
interface AuditLog {
  id: UUID
  company_id: UUID
  user_id: UUID
  action: 'login' | 'create_planning' | ...
  module: 'crm' | 'planning' | ...
  resource_id: UUID
  resource_type: string
  description: string
  changes: { before: {}, after: {} }
  ip_address: string
  user_agent: string
  created_at: Date
}
```

---

## 🚀 Implementação passo a passo

### Passo 1: Criar o Schema

```bash
# Executar o SQL em seu banco de dados Supabase
# database/schema-multitenant.sql
```

### Passo 2: Adicionar CompanyProvider

```typescript
// src/main.tsx
import { CompanyProvider } from '@/contexts/CompanyContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <CompanyProvider>
    <App />
  </CompanyProvider>
)
```

### Passo 3: Usar no Header

```typescript
// Adicionar CompanySelector ao header
import CompanySelector from '@/components/CompanySelector'

export function Header() {
  return (
    <header>
      <Logo />
      <Navigation />
      <CompanySelector />  {/* Aparece para Allugi users */}
      <UserMenu />
    </header>
  )
}
```

### Passo 4: Proteger Rotas

```typescript
// src/routes.tsx
import { useCompany } from '@/contexts/CompanyContext'

function ProtectedRoute({ children, requiredPermission }) {
  const { canAccess, isLoading } = useCompany()

  if (isLoading) return <Loading />
  if (!canAccess(...requiredPermission)) {
    return <AccessDenied />
  }

  return children
}

// Uso
<ProtectedRoute requiredPermission={['crm', 'view']}>
  <CRMPage />
</ProtectedRoute>
```

---

## 📊 Fluxo de Dados

```
User Login
    ↓
Load User Data (email, companies)
    ↓
Load Preferences (current_company_id)
    ↓
Switch to Company
    └─ Fetch company data
    └─ Fetch user's role in company
    └─ Fetch permissions
    └─ Load accessible departments
    └─ Log audit (switch_company)
    ↓
All requests filtered by company_id
    ↓
All data belongs to current company
```

---

## 🧪 Ambiente de Testes

### Empresa de Testes: "Estúdio Matriarca"

**Usuários de Teste:**
1. **Admin Allugi** - izadora-admin@example.com
2. **Consultor Allugi** - izadora-consultant@example.com
3. **Gestor da Empresa** - gestor@estudiomatriarca.com
4. **Gerente** - gerente@estudiomatriarca.com
5. **Colaborador** - colab@estudiomatriarca.com

**Fluxo de Teste:**

1. Login como Admin Allugi
   - ✅ Ver seletor de empresa
   - ✅ Trocar para outra empresa
   - ✅ Acessar Configurações > Equipe
   - ✅ Convidar novo membro

2. Login como Gestor
   - ✅ Não ver seletor de empresa
   - ✅ Ver apenas sua empresa
   - ✅ Acessar Configurações > Equipe
   - ✅ Responder diagnóstico

3. Login como Colaborador
   - ✅ Acessar apenas módulos permitidos
   - ✅ Responder diagnósticos
   - ✅ Visualizar tarefas

---

## 🔄 Integração com Diagnóstico

### Antes (Single-tenant)
```
Admin preenche Diagnóstico
    ↓
Gestor digita emails de colaboradores
```

### Depois (Multi-tenant)
```
Gestor preenche Diagnóstico
    ↓
Seção "Percepção da Equipe"
    ↓
Buscar colaboradores cadastrados (empresa atual)
    ↓
Selecionar da lista (sem digitar email)
    ↓
Sistema envia convites automáticos
    ↓
Acompanhar status: não iniciado → em andamento → concluído
    ↓
IA usa respostas para análise de alinhamento
```

---

## 📌 Pontos Importantes

### Isolamento de Dados
- ✅ **Cada operação MUST incluir company_id**
- ✅ **Nenhuma query sem WHERE company_id =**
- ✅ **Verificar context antes de carregar dados**

### Permissões
- ✅ **Sempre verificar canAccess() antes de renderizar**
- ✅ **Proteger endpoints com verificação no backend**
- ✅ **Falhar seguro (negar acesso se não verificado)**

### Auditoria
- ✅ **Registrar TODAS as ações importantes**
- ✅ **Incluir IP e user-agent**
- ✅ **Armazenar antes/depois em mudanças**

### Convites
- ✅ **Token único com expiração**
- ✅ **Email com link seguro**
- ✅ **Status muda de pending para active após aceitar**

---

## 🎯 Próximas Integrações

Esta arquitetura é reutilizável para todos os módulos:

- [ ] CRM - Clientes isolados por empresa
- [ ] Planejamento Estratégico - OKRs por empresa
- [ ] Marketing - Campanhas por empresa
- [ ] Dashboard - Dados da empresa atual
- [ ] Financeiro - Transações por empresa
- [ ] Arquivos - Storage isolado por empresa
- [ ] Comentários - Empresa do recurso
- [ ] Notificações - Por usuário e empresa

Cada módulo usa os mesmos padrões:
1. Verificar permissão com `canAccess()`
2. Filtrar por `company_id`
3. Registrar auditoria
4. Aplicar respeitando departamentos (se aplicável)

---

## 📞 Suporte

Para dúvidas sobre a arquitetura, consulte:
- **Schema**: database/schema-multitenant.sql
- **Tipos**: src/types/multitenant.ts
- **Context**: src/contexts/CompanyContext.tsx
- **Permissões**: src/lib/permissions.ts
