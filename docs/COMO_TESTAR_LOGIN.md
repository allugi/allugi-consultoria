# 🔐 Como Testar o Login do Allugi

## O Problema
Quando você clica em "Entrar", volta para a página de login porque **não há usuários criados ainda no Supabase Auth**.

## ✅ Solução em 3 passos

### Passo 1: Criar usuário no Supabase Console

1. Abra: **https://app.supabase.com**
2. Clique em **Authentication** (no menu esquerdo)
3. Clique em **Users**
4. Clique em **+ Add user** (botão verde)
5. Preencha:
   - **Email:** `test@example.com`
   - **Password:** `Password123!`
6. Clique em **Save**

✅ Pronto! Usuário criado.

---

### Passo 2: Voltar para http://localhost:5174

Recarregue a página (F5) ou navegue para **http://localhost:5174**

---

### Passo 3: Fazer login

Preencha:
- **Email:** `test@example.com`
- **Senha:** `Password123!`

Clique em **Entrar**

---

## 🎉 Resultado esperado

Após fazer login com sucesso, você deve ver:

1. ✅ Página carrega (não volta para login)
2. ✅ Vê um **Dashboard vazio** (sem dados)
3. ✅ Menu lateral aparece
4. ✅ Pode navegar entre as páginas

### Por que Dashboard está vazio?

Porque o usuário `test@example.com` **não está vinculado a nenhuma empresa** (não tem `company_users`).

---

## 🚀 Testar com dados reais

Para ver dados do sistema, crie este usuário e execute as instruções:

### Email: `alice@vertice-solucoes.com`
### Senha: `SellerTest123!`

Depois execute este SQL no **Supabase SQL Editor**:

```sql
INSERT INTO company_users (user_id, company_id, role)
SELECT u.id, c.id, 'seller'::app_role
FROM auth.users u, companies c
WHERE u.email = 'alice@vertice-solucoes.com'
  AND c.slug = 'vertice-solucoes';
```

Agora fazer login com `alice@vertice-solucoes.com` / `SellerTest123!` e você verá:
- ✅ Dashboard com dados
- ✅ 13 contatos
- ✅ 3 campanhas de marketing
- ✅ 5 tarefas de equipe
- ✅ Todos os gráficos carregados

---

## ❌ Troubleshooting

### "Página não carrega após clicar em Entrar"
→ É normal se o usuário não existe. Crie em Supabase Console primeiro.

### "Vejo Dashboard mas está vazio"
→ Usuário existe mas não está vinculado a empresa. Execute o SQL INSERT acima.

### "Erro: Invalid login credentials"
→ Email ou senha incorretos. Verifique no Supabase Console.

### "Erro: User not found"
→ Usuário não foi criado. Volte ao Passo 1.

---

## 📝 Checklist para testar tudo

Após logar como `alice@vertice-solucoes.com`:

- [ ] Dashboard carrega com KPIs
- [ ] Gráficos aparecem (Receita, Leads, Funil)
- [ ] Menu lateral funciona
- [ ] Clica em "Marketing > Planejamento" e vê 3 campanhas
- [ ] Clica em "Marketing > Tráfego" e vê gráficos
- [ ] Clica em "Marketing > Social" e vê posts
- [ ] Clica em "Equipe" e vê 5 tarefas
- [ ] Clica em "Relatórios" e vê gráficos analíticos
- [ ] Clica em "Configurações" e vê lista de usuários

Se tudo funcionar ✅, o sistema está 100% operacional!

---

## 🎯 Próximo passo depois de testar

Depois que confirmar que login e dados carregam corretamente:

1. Teste com outro usuário (ex: `bob@novatech-sistemas.com`)
2. Confirme que dados são isolados por empresa (segurança RLS)
3. Experimente navegar entre todas as páginas
4. Tente criar/editar dados (botões "Novo" nas páginas)

Pronto! Sistema está pronto para desenvolvimento/produção! 🚀
