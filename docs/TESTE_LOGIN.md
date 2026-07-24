# 🔐 Testando Login no Allugi

A aplicação está rodando em **http://localhost:5174** mas o login ainda não funciona porque não há usuários criados no Supabase Auth.

## ✅ Como criar um usuário teste para login

### Opção 1: Supabase Console (Recomendado)

1. Acesse: https://app.supabase.com
2. Clique em **Authentication** → **Users**
3. Clique em **+ Add user**
4. Preencha:
   - **Email:** `test@example.com`
   - **Password:** `Password123!`
5. Clique **Save**

### Opção 2: Criar múltiplos usuários de teste

Para testar diferentes roles, crie esses usuários:

#### Admin (acesso total às empresas clientes)
- **Email:** `admin@allugi.ag`
- **Password:** `AdminTest123!`
- ⚠️ Adicione manualmente em `company_users` com role `allugi_admin`

#### Vendedor Vértice
- **Email:** `alice@vertice-solucoes.com`
- **Password:** `SellerTest123!`
- Depois execute no Supabase SQL Editor:
```sql
INSERT INTO company_users (user_id, company_id, role)
SELECT u.id, c.id, 'seller'::app_role
FROM auth.users u, companies c
WHERE u.email = 'alice@vertice-solucoes.com' AND c.slug = 'vertice-solucoes';
```

#### Gerente NovaTech
- **Email:** `bob@novatech-sistemas.com`
- **Password:** `ManagerTest123!`
- Execute no SQL Editor:
```sql
INSERT INTO company_users (user_id, company_id, role)
SELECT u.id, c.id, 'manager'::app_role
FROM auth.users u, companies c
WHERE u.email = 'bob@novatech-sistemas.com' AND c.slug = 'novatech-sistemas';
```

---

## 🚀 Testando com cada usuário

### Admin Allugi
1. Email: `admin@allugi.ag`
2. Password: `AdminTest123!`
3. Pode ver:
   - ✅ Dashboard geral
   - ✅ Página de empresas clientes (`/empresas`)
   - ✅ Company selector no header

### Vendedor Vértice
1. Email: `alice@vertice-solucoes.com`
2. Password: `SellerTest123!`
3. Pode ver:
   - ✅ Dashboard com dados de Vértice Soluções
   - ✅ Contatos da Vértice
   - ✅ Marketing > Planejamento
   - ✅ Marketing > Tráfego
   - ✅ Marketing > Social
   - ✅ Equipe (Kanban)
   - ✅ Relatórios
   - ✅ Configurações
   - ❌ Não vê dados de NovaTech (RLS protege)

### Gerente NovaTech
1. Email: `bob@novatech-sistemas.com`
2. Password: `ManagerTest123!`
3. Acesso similar ao vendedor, mas dados de NovaTech Sistemas

---

## 📊 Verificar após criar usuários

Após criar os usuários, rode este query no SQL Editor para confirmar:

```sql
SELECT 
  u.email,
  c.name as company,
  cu.role
FROM auth.users u
LEFT JOIN company_users cu ON u.id = cu.user_id
LEFT JOIN companies c ON cu.company_id = c.id
ORDER BY u.email;
```

Deve retornar algo como:
```
email                        | company                 | role
admin@allugi.ag              | Allugi                  | allugi_admin
alice@vertice-solucoes.com   | Vértice Soluções B2B   | seller
bob@novatech-sistemas.com    | NovaTech Sistemas       | manager
test@example.com             | (null)                  | (null)
```

---

## 🔍 Troubleshooting

### Erro "Invalid login credentials"
- Verificar se email está correto (case-sensitive em alguns casos)
- Confirmar password está correta
- Aguardar alguns segundos antes de tentar novamente

### Usuário criado mas redirect não funciona
- Verifique se `company_users` foi preenchido corretamente
- Confirme que `company_id` referencia uma empresa que existe
- Teste com SQL: `SELECT * FROM company_users WHERE user_id = 'seu_user_id'`

### Vê dashboard mas dados vazios
- Isso significa que RLS está funcionando (proteção ativa)
- Verifique que o `company_id` no JWT é válido
- Confirme no SQL que `company_users` existe para este user

---

## 📝 Dados disponíveis para testar

Após logar como Vendedor Vértice, você verá:

**Dashboard KPIs:**
- Receita do Mês: R$ 345k (2 clientes ganhos)
- Leads Ativos: 12
- Conversões: 2
- Taxa de Conversão: 15.4%

**Contatos:**
- 13 contatos total (novo_lead até cliente)
- Distribuído pelos estágios do funil

**Marketing:**
- 3 campanhas (LinkedIn, Google Ads, Email)
- Dados de tráfego dos últimos 4 dias
- 3 posts publicados

**Equipe:**
- 5 tarefas (TODO, In Progress, Review, Done)

**Relatórios:**
- Gráficos de funil, receita, atividades
- Resumo executivo

---

## 🎯 Próximo passo

Após confirmar que o login funciona:

1. ✅ Teste navegação entre páginas
2. ✅ Verifique dados carregando corretamente
3. ✅ Teste company selector (admin só)
4. ✅ Verificar que dados são isolados por empresa (RLS)
5. ✅ Confirmar sidebar mostrando itens corretos

Pronto para desenvolvimento! 🚀
