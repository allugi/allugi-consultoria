# 📧 Integração: Email + Convites

Guia passo-a-passo para integrar o sistema de email com os convites de membros.

---

## 🎯 O que acontece agora:

```
Usuário clica "Convidar Membro"
    ↓
Preenche formulário (email, nome, cargo, role)
    ↓
Clica "Enviar Convite"
    ↓
Frontend envia para /api/users/invite
    ↓
Backend:
  1. Cria registro em user_companies com status 'pending'
  2. Gera token de convite único
  3. ✨ ENVIA EMAIL AUTOMATICAMENTE com link
  4. Registra auditoria
    ↓
Frontend mostra toast: "✅ Convite enviado para email@..."
    ↓
Lista de membros se atualiza com novo membro (status: pendente)
```

---

## 🛠️ Implementação

### **Passo 1: Configurar Backend (Express)**

Se está usando Express, adicione as rotas:

```typescript
// src/server.ts (ou seu arquivo principal)
import inviteRoutes from './server/api/invite'

const app = express()

// Middleware necessário
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Middleware de autenticação (adaptado para seu caso)
app.use((req, res, next) => {
  // Verificar JWT e adicionar user ao request
  // req.user = { id: '...', currentCompanyId: '...' }
  next()
})

// Registrar rotas de convite
app.use(inviteRoutes)

// Rotas de empresa
app.get('/api/companies/:id/team-members', (req, res) => {
  // Buscar membros
})

app.get('/api/companies/:id/roles', (req, res) => {
  // Buscar roles
})

app.get('/api/companies/:id/departments', (req, res) => {
  // Buscar departamentos
})
```

### **Passo 2: Variáveis de Ambiente**

Certifique-se de que `.env.local` tem:

```env
# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=suporte@allugi.com

# App
APP_URL=http://localhost:3000
NODE_ENV=development
```

### **Passo 3: Instalar Pacotes**

```bash
npm install uuid express
npm install -D @types/express
```

### **Passo 4: Implementar Funções Auxiliares**

No arquivo `src/server/api/invite.ts`, você precisa implementar:

```typescript
// 1. Hash de senha (usar bcrypt)
async function hashPassword(password: string): Promise<string> {
  const bcrypt = require('bcrypt')
  return bcrypt.hash(password, 10)
}

// 2. Geração de JWT
function generateJWT(userId: string, companyId: string): string {
  const jwt = require('jsonwebtoken')
  return jwt.sign(
    { userId, companyId },
    process.env.JWT_SECRET || 'seu-secret-key',
    { expiresIn: '7d' }
  )
}

// 3. Acesso ao banco de dados
// Precisamos de uma forma de acessar o BD
// Opção A: Usar Supabase
// Opção B: Usar MongoDB
// Opção C: Outro BD que você usa
```

---

## 🗄️ Banco de Dados - Tabelas Necessárias

### **user_companies** (Relação usuário-empresa)

```sql
CREATE TABLE user_companies (
  id UUID PRIMARY KEY,
  email VARCHAR(255),
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  companyId UUID NOT NULL REFERENCES companies(id),
  roleId UUID NOT NULL REFERENCES roles(id),
  jobTitle VARCHAR(255),
  department VARCHAR(255),
  status VARCHAR(50) CHECK (status IN ('pending', 'active', 'inactive', 'blocked')),
  
  -- Convite
  invitationToken VARCHAR(255) UNIQUE,
  invitationExpiresAt TIMESTAMP,
  emailStatus VARCHAR(50) DEFAULT 'pending', -- pending, sent, failed
  
  createdAt TIMESTAMP DEFAULT NOW(),
  createdBy UUID,
  updatedAt TIMESTAMP DEFAULT NOW(),
  updatedBy UUID
);

CREATE INDEX idx_user_companies_email_company 
ON user_companies(email, companyId);
CREATE INDEX idx_user_companies_token 
ON user_companies(invitationToken);
```

### **audit_logs** (Auditoria)

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id),
  companyId UUID REFERENCES companies(id),
  action VARCHAR(100),
  module VARCHAR(50),
  resourceId UUID,
  resourceType VARCHAR(100),
  description TEXT,
  ipAddress VARCHAR(50),
  userAgent TEXT,
  createdAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_company 
ON audit_logs(userId, companyId, createdAt DESC);
```

---

## 📱 Frontend - Fluxo Completo

### **1. Componente já está pronto em:**
`src/routes/configuracoes-equipe-multitenant.tsx`

**Mudanças feitas:**
- ✅ Toast notifications (sucesso/erro)
- ✅ Carregamento automático após convite
- ✅ Feedback visual durante envio
- ✅ Tratamento de erros

### **2. Estrutura de resposta esperada**

Quando convite é enviado com sucesso:

```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "email": "novo@example.com",
    "firstName": "João",
    "lastName": "Silva",
    "status": "pending",
    "inviteExpiresAt": "2024-07-22T10:30:00Z",
    "message": "✅ Convite enviado para novo@example.com"
  }
}
```

Quando há erro:

```json
{
  "success": false,
  "error": "Este email já foi convidado para essa empresa"
}
```

---

## 🧪 Testando a Integração

### **Teste 1: Enviar Convite**

1. Ir em **Configurações > Equipe**
2. Clicar **"Convidar Membro"**
3. Preencher:
   - Nome: João Silva
   - Email: joao@example.com
   - Cargo: Desenvolvedor
   - Departamento: TI
   - Role: Colaborador
4. Clicar **"Enviar Convite"**

**Resultado esperado:**
- ✅ Toast verde: "✅ Convite enviado para joao@example.com"
- ✅ Email recebido em joao@example.com com link de aceitar
- ✅ Novo membro aparece na lista com status "Convite Pendente"

### **Teste 2: Erro - Email duplicado**

1. Convidar mesmo email novamente
2. Clicar "Enviar Convite"

**Resultado esperado:**
- ❌ Toast vermelho: "Este email já foi convidado para essa empresa"
- Usuário pode tentar outro email

### **Teste 3: Reenviar Convite**

1. Na lista de membros, clicar botão "..." do membro com status pendente
2. Selecionar "Reenviar Convite"

**Resultado esperado:**
- ✅ Novo email enviado
- ✅ Token atualizado
- ✅ Expiração renovada (7 dias)

---

## 📧 Email Recebido

Quando usuário recebe o email:

```
De: Allugi <suporte@allugi.com>
Assunto: Você foi convidado para Estúdio Matriarca na Allugi

---

🎉 Bem-vindo à Allugi!

Olá João,

Maria Silva o convidou para fazer parte do time de Estúdio Matriarca 
na plataforma Allugi.

🏢 Empresa: Estúdio Matriarca
📧 Email: joao@example.com

[BOTÃO: Aceitar Convite]

Ou copie este link:
https://allugi.com/join?token=xyz123

Este link expira em 7 dias.
```

---

## 🔄 Integração com Supabase (Opcional)

Se estiver usando Supabase, pode simplificar:

```typescript
// Usar Supabase client
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

// No endpoint, trocar:
// const userCompany = await (global as any).db?.userCompanies?.create(...)

// Por:
const { data, error } = await supabase
  .from('user_companies')
  .insert([{ email, firstName, companyId, ... }])
  .select()

if (error) throw error
const userCompany = data[0]
```

---

## 📋 Checklist de Implementação

- [ ] Variáveis de ambiente configuradas (.env.local)
- [ ] Pacotes instalados (uuid, express, bcrypt, jsonwebtoken)
- [ ] Backend: Arquivo `src/server/api/invite.ts` criado
- [ ] Backend: Rotas registradas no servidor
- [ ] Backend: Funções auxiliares implementadas (hashPassword, generateJWT)
- [ ] Backend: Conexão com banco de dados configurada
- [ ] Frontend: `configuracoes-equipe-multitenant.tsx` atualizado com toasts
- [ ] Tabelas do BD criadas (user_companies, audit_logs)
- [ ] Email testado e funcionando
- [ ] Convite enviado com sucesso
- [ ] Email recebido no inbox
- [ ] Link de aceitar convite funciona

---

## 🆘 Troubleshooting

### **Erro: "Não autenticado"**
- Verificar middleware de autenticação
- Certificar-se que `req.user` está sendo setado
- Verificar JWT/cookie

### **Email não é enviado**
- Verificar `RESEND_API_KEY` em `.env.local`
- Verificar se domínio está verificado no Resend
- Ver logs do servidor: `console.error()`
- Verificar console do Resend para errors

### **Convite criado mas email não enviado**
- Será marcado com `emailStatus: 'failed'`
- Implementar job para reenviar depois
- Botão "Reenviar" na UI

### **Token inválido ao aceitar**
- Verificar expiração
- Verificar se token foi salvo corretamente
- Limpar cache do navegador

---

## 🚀 Próximos Passos

1. **Tela de Aceitar Convite** - Criar página `/join?token=...`
2. **Tela de Recuperação de Senha** - Usar `sendResetPasswordEmail`
3. **Notificações de Team** - Usar `sendEmail` com template custom
4. **Webhooks do Resend** - Rastrear opens/clicks
5. **Dashboard de Auditoria** - Mostrar histórico de convites

---

## 📞 Suporte

Dúvidas? Consulte:
- `SETUP_EMAIL_RESEND.md` - Setup do Resend
- `EXEMPLOS_EMAIL.md` - Exemplos de uso
- `src/server/api/invite.ts` - Código do backend
- `src/routes/configuracoes-equipe-multitenant.tsx` - Código do frontend
