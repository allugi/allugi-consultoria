# 🗄️ Setup Supabase - Guia Completo

Guia passo-a-passo para configurar PostgreSQL gerenciado com Supabase.

---

## 📋 Passo 1: Criar Conta no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em **"Sign Up"**
3. Faça login com GitHub ou email
4. Confirme email
5. Crie uma organização (ex: "Allugi")

---

## 🚀 Passo 2: Criar Projeto

1. No dashboard, clique **"New Project"**
2. Configure:
   - **Organization**: Seu org
   - **Project name**: `allugi` (ou seu nome)
   - **Database password**: Crie senha forte (guardar!)
   - **Region**: Escolha próximo a seus usuários
   - **Pricing Plan**: Free (para testes)

3. Clique **"Create new project"**
4. ⏳ Aguarde criação (2-3 minutos)

---

## 🔑 Passo 3: Obter Credenciais

Quando projeto estiver pronto:

1. Vá em **Settings > API** (ou clique na aba SQL)
2. Copie:
   - **URL**: `https://xxxx.supabase.co`
   - **Service Role Key**: `eyJhbGc...` (⚠️ muito importante!)

3. Adicione em `.env.local`:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...
```

---

## 📊 Passo 4: Criar Tabelas

1. No Supabase, vá em **SQL Editor**
2. Clique **"New Query"**
3. **Cole todo o conteúdo** de `database/migrations-supabase.sql`
4. Clique **"Run"** (ou Ctrl+Enter)

**Resultado esperado:**
```
✅ Query successful (0 ms)
```

Se houver erro, verifique:
- Se copiou todo o SQL
- Se não tem caracteres estranhos
- Tente linha por linha

---

## 🔗 Passo 5: Instalar Pacotes

```bash
npm install @supabase/supabase-js
```

---

## ⚙️ Passo 6: Configurar Servidor

No `src/server/server.ts`, altere:

```typescript
// De:
// const database = new MongoDatabase()

// Para:
import { SupabaseDatabase } from './db/supabase'
const database = new SupabaseDatabase()
```

---

## 🧪 Passo 7: Testar Conexão

Execute servidor:

```bash
npm run dev
```

Deve aparecer:
```
✅ Banco de dados conectado
✅ Servidor rodando em http://localhost:3001
```

Se houver erro:
- Verificar `.env.local` tem SUPABASE_URL e SUPABASE_SERVICE_KEY
- Verificar SQL foi executado com sucesso
- Ver console do servidor para erro específico

---

## 📱 Passo 8: Teste de API

### **Health Check:**
```bash
curl http://localhost:3001/health
```

Resposta:
```json
{ "status": "ok", "message": "Servidor rodando!" }
```

### **Convidar Membro (requer JWT):**

Primeiro, gere um JWT válido (você pode usar seu próprio userId/companyId):

```bash
curl -X POST http://localhost:3001/api/users/invite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu-jwt-token-aqui" \
  -d '{
    "email": "novo@example.com",
    "firstName": "João",
    "lastName": "Silva",
    "jobTitle": "Developer",
    "department": "TI",
    "roleId": "role-uuid-aqui"
  }'
```

---

## 🌐 Passo 9: Acessar Banco via Dashboard

No Supabase, você pode:

- **Ver tabelas**: Table Editor
- **Ver dados**: Clicar na tabela
- **Executar SQL**: SQL Editor
- **Ver logs**: Database > Query Performance
- **Gerenciar permissões**: Auth > RLS

---

## 📁 Passo 10: Estrutura Completa

```
Seu Projeto
├── .env.local
│   ├── SUPABASE_URL=https://xxxx.supabase.co
│   └── SUPABASE_SERVICE_KEY=eyJhbGc...
│
├── src/server/
│   ├── server.ts (usando SupabaseDatabase)
│   ├── middleware/auth.ts
│   ├── db/
│   │   ├── database.ts
│   │   └── supabase.ts ✅
│   └── api/invite.ts
│
├── database/
│   └── migrations-supabase.sql ✅ (já executado)
│
└── npm run dev
```

---

## 🔐 Segurança em Produção

### **Service Key vs Anon Key:**

- **Service Key**: Use no backend (servidor) - acesso total
- **Anon Key**: Use no frontend - acesso restrito por RLS

Em `.env.local`, você usa Service Key.

Em produção no Vercel/Railway/Heroku, adicione em **Environment Variables**.

---

## 🗑️ Dados de Teste

Para popular banco com dados de teste:

### **Criar empresa:**
```sql
INSERT INTO companies (name, slug, industry, status)
VALUES ('Estúdio Matriarca', 'estudio-matriarca', 'Consultoria', 'active');
```

### **Criar usuário:**
```sql
INSERT INTO users (email, firstName, lastName, passwordHash, status)
VALUES ('admin@allugi.com', 'Admin', 'Allugi', 'hash-aqui', 'active');
```

### **Criar role:**
```sql
INSERT INTO roles (companyId, name, level, isSystem)
VALUES ('company-uuid', 'Gestor', 2, false);
```

---

## 🆘 Troubleshooting

### **Erro: "SUPABASE_URL is required"**
- Verificar `.env.local` tem SUPABASE_URL
- Reiniciar servidor (`npm run dev`)

### **Erro: "Invalid API key"**
- SUPABASE_SERVICE_KEY está errado
- Copiar novamente de Settings > API

### **Erro: "relation does not exist"**
- Tabelas não foram criadas
- Executar migrations-supabase.sql novamente

### **Erro: "permission denied"**
- RLS está bloqueando acesso
- Verificar RLS policies em tabela
- Considerar desabilitar RLS para desenvolvimento

### **Email não envia mas BD salva**
- `emailStatus` fica `failed`
- Verificar RESEND_API_KEY
- Botão "Reenviar" na UI ajuda

---

## 📊 Dashboard Supabase

Coisas úteis para monitorar:

1. **Table Editor** - Ver dados em tempo real
2. **SQL Editor** - Executar queries
3. **Logs** - Ver erros de conexão
4. **Reports** - Database performance
5. **Auth** - Gerenciar usuários (se usar Supabase Auth)
6. **Realtime** - Ativar para sync em tempo real

---

## 🔄 Backup e Restore

Supabase oferece backups automáticos (plano Free = 7 dias).

Para backup manual:
1. Settings > Database > Backups
2. Clique "Create backup"
3. Baixe arquivo SQL

Para restore:
1. Settings > Database > Backups
2. Selecione backup
3. Clique "Restore"

---

## 📈 Próximos Passos

1. ✅ Supabase criado
2. ✅ Tabelas criadas
3. ✅ Servidor rodando
4. ⏭️ Testar endpoints (login, convites, etc)
5. ⏭️ Integrar frontend com backend
6. ⏭️ Criar página de aceitar convite
7. ⏭️ Deploy em produção

---

## 💰 Cotos do Supabase

### **Free Plan:**
- 500MB Storage
- 2GB Bandwidth
- Unlimited API Requests (soft limit)
- Bom para desenvolvimento

### **Pro Plan:**
- $25/mês
- 8GB Storage
- 250GB Bandwidth
- Melhor para produção pequena

### **Team Plan:**
- $599/mês
- 100GB Storage
- 2TB Bandwidth
- Enterprise features

---

## 📞 Contato Supabase

- 📧 support@supabase.com
- 🌐 https://supabase.com/docs
- 💬 Discord: https://discord.supabase.com
- 🐛 GitHub Issues: https://github.com/supabase/supabase

---

## ✅ Checklist Final

- [ ] Conta criada no Supabase
- [ ] Projeto criado
- [ ] SUPABASE_URL e SUPABASE_SERVICE_KEY copiados
- [ ] `.env.local` configurado
- [ ] migrations-supabase.sql executado
- [ ] Tabelas criadas com sucesso
- [ ] `@supabase/supabase-js` instalado
- [ ] `src/server/db/supabase.ts` criado
- [ ] `npm run dev` funcionando
- [ ] `/health` retorna 200
- [ ] Banco conectado com sucesso

**Pronto para testar!** 🚀
