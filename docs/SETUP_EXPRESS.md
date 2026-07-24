# 🚀 Setup Express - Guia Completo

Guia passo-a-passo para configurar o servidor Express e integrar tudo.

---

## 📋 Passo 1: Instalar Dependências

```bash
npm install express cors dotenv jsonwebtoken bcrypt uuid
npm install -D @types/express @types/node @types/jsonwebtoken @types/bcrypt
```

**O que cada pacote faz:**
- `express` - Framework web
- `cors` - Permitir requisições do frontend
- `dotenv` - Carregar variáveis de ambiente
- `jsonwebtoken` - JWT para autenticação
- `bcrypt` - Hash seguro de senhas
- `uuid` - Gerar IDs únicos

---

## 🛠️ Passo 2: Estrutura de Pastas

```
ALLUGI/
├── src/
│   ├── server/
│   │   ├── server.ts              ← NOVO: Arquivo principal
│   │   ├── middleware/
│   │   │   └── auth.ts            ← NOVO: JWT, bcrypt, etc
│   │   ├── api/
│   │   │   └── invite.ts          ← Já existe
│   │   └── db/
│   │       └── database.ts        ← NOVO: Abstração do BD
│   ├── lib/
│   │   ├── email.ts
│   │   └── email-templates.tsx
│   ├── routes/
│   ├── components/
│   └── types/
├── .env.local                     ← CRIAR/ATUALIZAR
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## 🔧 Passo 3: Configurar `.env.local`

```env
# Server
PORT=3001
NODE_ENV=development

# Frontend (CORS)
APP_URL=http://localhost:3000

# JWT Secret (MUDAR EM PRODUÇÃO!)
JWT_SECRET=sua-chave-super-secreta-aqui-com-pelo-menos-32-caracteres

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=suporte@allugi.com

# Banco de Dados (escolha uma das opções abaixo)

# Opção 1: Supabase
# SUPABASE_URL=https://xxx.supabase.co
# SUPABASE_SERVICE_KEY=eyJhbGc...

# Opção 2: MongoDB
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/allugi

# Opção 3: PostgreSQL Nativo
# DATABASE_URL=postgresql://user:pass@localhost:5432/allugi
```

---

## 🏃 Passo 4: Executar Servidor

### **Desenvolvimento (com hot reload):**

```bash
npm install -D nodemon ts-node
```

Adicione ao `package.json`:

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/server/server.ts",
    "start": "node dist/server/server.js",
    "build": "tsc"
  }
}
```

Depois execute:

```bash
npm run dev
```

**Deve aparecer:**
```
✅ Servidor rodando em http://localhost:3001
📧 Email: suporte@allugi.com
🏢 Frontend: http://localhost:3000
```

---

## 📊 Passo 5: Escolher Banco de Dados

### **Opção A: Supabase (Recomendado para iniciantes)**

```bash
npm install @supabase/supabase-js
```

**Criar arquivo:** `src/server/db/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'
import { Database } from './database'

export class SupabaseDatabase implements Database {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  users = {
    findById: async (id: string) => {
      const { data } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
      return data
    },
    // ... implementar outros métodos
  }

  // ... implementar rest
}
```

---

### **Opção B: MongoDB**

```bash
npm install mongodb
```

**Criar arquivo:** `src/server/db/mongodb.ts`

```typescript
import { MongoClient, Db } from 'mongodb'
import { Database, User } from './database'

export class MongoDatabase implements Database {
  private client: MongoClient
  private db: Db | null = null

  constructor() {
    this.client = new MongoClient(process.env.MONGODB_URI!)
  }

  async connect(): Promise<void> {
    await this.client.connect()
    this.db = this.client.db('allugi')
  }

  users = {
    findById: async (id: string) => {
      return this.db?.collection('users').findOne({ _id: id })
    },
    // ... implementar outros métodos
  }

  // ... implementar rest
}
```

---

### **Opção C: PostgreSQL Nativo**

```bash
npm install pg
```

**Criar arquivo:** `src/server/db/postgres.ts`

```typescript
import { Pool } from 'pg'
import { Database, User } from './database'

export class PostgresDatabase implements Database {
  private pool = new Pool({
    connectionString: process.env.DATABASE_URL
  })

  users = {
    findById: async (id: string) => {
      const result = await this.pool.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      )
      return result.rows[0]
    },
    // ... implementar outros métodos
  }

  // ... implementar rest
}
```

---

## 🔌 Passo 6: Integrar Banco no Servidor

No `src/server/server.ts`, adicione no início:

```typescript
import { initializeDatabase } from './db/database'
import { SupabaseDatabase } from './db/supabase' // ou MongoDB, Postgres
// import { MongoDatabase } from './db/mongodb'
// import { PostgresDatabase } from './db/postgres'

// Inicializar banco antes de iniciar servidor
const startServer = async () => {
  try {
    // Escolher qual usar:
    const database = new SupabaseDatabase()
    // const database = new MongoDatabase()
    // const database = new PostgresDatabase()

    await initializeDatabase(database)

    app.listen(PORT, () => {
      console.log(`✅ Servidor rodando em http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error)
    process.exit(1)
  }
}

startServer()
```

---

## 🧪 Passo 7: Testar Endpoints

### **Health Check:**
```bash
curl http://localhost:3001/health
```

Deve retornar:
```json
{ "status": "ok", "message": "Servidor rodando!" }
```

### **Convidar Membro (requer Auth):**
```bash
curl -X POST http://localhost:3001/api/users/invite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_JWT" \
  -d '{
    "email": "novo@example.com",
    "firstName": "João",
    "lastName": "Silva",
    "jobTitle": "Dev",
    "department": "TI",
    "roleId": "role-123"
  }'
```

---

## 📝 Passo 8: Implementar Métodos do Banco

Você precisa implementar todos os métodos em `database.ts`:

**Exemplo para Supabase:**

```typescript
users = {
  findById: async (id: string) => {
    const { data } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    return data as User | null
  },

  findByEmail: async (email: string) => {
    const { data } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    return data as User | null
  },

  create: async (data: Partial<User>) => {
    const { data: user } = await this.supabase
      .from('users')
      .insert([data])
      .select()
      .single()
    return user as User
  },

  update: async (id: string, data: Partial<User>) => {
    const { data: user } = await this.supabase
      .from('users')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    return user as User
  },

  delete: async (id: string) => {
    await this.supabase
      .from('users')
      .delete()
      .eq('id', id)
  }
}
```

---

## 🔐 Passo 9: Segurança

### **Em Desenvolvimento:**
```env
JWT_SECRET=dev-secret-key-nao-segura
```

### **Em Produção (IMPORTANTE!):**

```bash
# Gerar chave aleatória segura:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Cole em variável de ambiente segura (Vercel, Heroku, etc):
```env
JWT_SECRET=abc123xyz789...
```

---

## 📋 Checklist de Implementação

- [ ] Dependências instaladas
- [ ] Estrutura de pastas criada
- [ ] `.env.local` configurado
- [ ] `server.ts` criado
- [ ] `middleware/auth.ts` criado
- [ ] `db/database.ts` criado
- [ ] Banco de dados escolhido e implementado
- [ ] `npm run dev` rodando sem erros
- [ ] `/health` retorna 200
- [ ] Convites funcionando (email enviado)
- [ ] Dados salvos no banco de dados

---

## 🆘 Troubleshooting

### **Erro: "Cannot find module"**
```bash
npm install
```

### **Erro: "DATABASE_URL is not defined"**
Verificar `.env.local` e reiniciar servidor

### **Erro: "EADDRINUSE: address already in use"**
```bash
# Outra aplicação está usando porta 3001
# Trocar PORT em .env.local para 3002, 3003, etc
```

### **Email não envia**
Ver logs do servidor, verificar `RESEND_API_KEY`

---

## 🚀 Próximos Passos

1. Implementar todos os métodos do banco
2. Criar tela de aceitar convite (`/join?token=...`)
3. Criar tela de recuperação de senha
4. Adicionar testes
5. Deploy (Vercel, Railway, Heroku, etc)

---

## 📚 Referências

- [Express.js Docs](https://expressjs.com/)
- [JWT Intro](https://jwt.io/introduction)
- [bcrypt Guide](https://www.npmjs.com/package/bcrypt)
- [CORS Docs](https://enable-cors.org/)

**Pronto para começar!** 🎉
