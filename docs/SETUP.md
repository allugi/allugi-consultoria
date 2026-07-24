# Allugi - Setup Inicial

## Passo 1: Executar Schema no Supabase

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá para **SQL Editor**
3. Clique em **New Query**
4. Copie todo o conteúdo do arquivo `supabase_schema.sql` (este repositório)
5. Cole no editor do Supabase
6. Clique em **Run** (ícone de ▶️)
7. Aguarde até ver "Success"

**Isso irá criar:**
- Tabelas multi-tenant (companies, company_users)
- Tabelas operacionais (contacts, notes, tasks, activities)
- Funções de segurança (RLS)
- Triggers de auditoria
- Bootstrap automático: seu usuário `allugi.ag@gmail.com` receberá role `allugi_admin`

---

## Passo 2: Criar Usuários de Teste

No Supabase, vá para **Authentication > Users** e clique em **Add user** (canto superior direito).

### Usuário 1: Admin da Allugi
- Email: `allugi.ag@gmail.com`
- Password: (escolha uma senha forte)
- **Role será atribuído automaticamente como `allugi_admin` pelo trigger**

### Usuário 2: Cliente exemplo (opcional)
- Email: `cliente@example.com`
- Password: (escolha uma senha)
- Depois você cria a empresa cliente e vincula esse usuário manualmente via SQL:

```sql
-- Criar empresa cliente
INSERT INTO companies (name, slug, plan, status)
VALUES ('Empresa Teste', 'empresa-teste', 'starter', 'active');

-- Vincular usuário à empresa (substitua os UUIDs)
INSERT INTO company_users (user_id, company_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'cliente@example.com'),
  (SELECT id FROM companies WHERE slug = 'empresa-teste'),
  'company_admin'::app_role
);
```

---

## Passo 3: Instalar Dependências Localmente

```bash
npm install
```

---

## Passo 4: Rodar Dev Server

```bash
npm run dev
```

A aplicação será aberta em `http://localhost:5173`

---

## Passo 5: Login

Use as credenciais que criou:
- Email: `allugi.ag@gmail.com`
- Password: (a que você escolheu)

---

## Próximos Passos

Depois de tudo funcionando:
- **Bloco 2**: Seletor de empresa no header + menu "Empresas clientes"
- **Bloco 3**: Seed de dados B2B correto
- **Bloco 4**: Dashboard conectado ao Supabase
- ...

---

## Troubleshooting

**"npm: command not found"**
- Use o caminho completo: `C:\Program Files\nodejs\npm.cmd install`

**"Erro ao fazer login"**
- Verifique se o usuário foi criado no Supabase > Authentication > Users
- Verifique se o schema foi executado com sucesso

**"Contatos não aparecem"**
- Insira dados de teste direto no Supabase Dashboard:
  - Vá para **Table Editor**
  - Abra tabela `contacts`
  - Clique em **Insert row**
  - Preencha os campos (company_id, name, email, etc.)
