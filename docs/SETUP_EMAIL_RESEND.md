# 📧 Setup de Email com Resend

Guia completo para configurar envio de emails automáticos via Resend com domínio próprio (suporte@allugi.com).

---

## 🚀 **Passo 1: Criar Conta no Resend**

1. Acesse [resend.com](https://resend.com)
2. Clique em "Sign Up"
3. Crie conta com seu email
4. Confirme email

---

## 🔑 **Passo 2: Obter API Key**

1. No dashboard do Resend, vá em **Settings > API Keys**
2. Clique em **"Create API Key"**
3. Copie a chave (começa com `re_`)
4. **Salve em um lugar seguro** - você vai usar no `.env`

---

## 🌐 **Passo 3: Adicionar Domínio (suporte@allugi.com)**

### **No Resend:**
1. Vá em **Settings > Domains**
2. Clique em **"Add Domain"**
3. Digite: `allugi.com` (não precisa de `suporte@`, só o domínio base)
4. Clique em **"Add"**

### **No seu provedor de DNS:**

Resend vai gerar 3 registros DNS que você precisa adicionar. Será algo assim:

```
CNAME: mail._domainkey.allugi.com → resend.domain...
CNAME: resend._domainkey.allugi.com → resend.domain...
MX: allugi.com → feedback-resend.com (prioridade 10)
```

**Procure por:**
- GoDaddy
- Hostinger
- Cloudflare
- Seu provedor de domínios

E adicione os registros lá.

**⏱️ Leva 24-48h para propagação. Você pode continuar testando nesse meio tempo.**

---

## 🛠️ **Passo 4: Configurar Variáveis de Ambiente**

Crie ou edite `.env.local`:

```env
# Resend Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=suporte@allugi.com
RESEND_FROM_NAME=Allugi
```

---

## 📦 **Passo 5: Instalar Pacotes**

```bash
npm install resend react-email
```

Ou se usar pnpm:
```bash
pnpm add resend react-email
```

---

## 💻 **Passo 6: Usar no Backend**

### **Exemplo: Enviar Convite**

```typescript
import { sendInviteEmail } from '@/lib/email'

// Em sua rota/função
const result = await sendInviteEmail({
  email: 'novo@example.com',
  firstName: 'João',
  companyName: 'Estúdio Matriarca',
  inviteLink: 'https://allugi.com/invite?token=xyz123',
  inviteToken: 'xyz123',
  senderName: 'Maria Silva'
})

if (result.success) {
  console.log('Email enviado:', result.messageId)
} else {
  console.error('Erro:', result.error)
}
```

### **Exemplo: Recuperar Senha**

```typescript
import { sendResetPasswordEmail } from '@/lib/email'

await sendResetPasswordEmail({
  email: 'user@example.com',
  firstName: 'João',
  resetLink: 'https://allugi.com/reset?token=xyz123'
})
```

---

## 🧪 **Passo 7: Testar**

### **Opção 1: Via Resend Dashboard**
1. Vá em **Emails** no dashboard
2. Clique em **"Send Test Email"**
3. Digite seu email
4. Escolha um template para testar

### **Opção 2: Via Código**
```typescript
import { sendEmail } from '@/lib/email'

await sendEmail({
  to: 'seu-email@example.com',
  template: 'welcome',
  data: {
    firstName: 'Teste',
    companyName: 'Allugi'
  }
})
```

---

## ✅ **Checklist de Configuração**

- [ ] Conta criada no Resend
- [ ] API Key copiada
- [ ] Domínio adicionado no Resend (allugi.com)
- [ ] Registros DNS adicionados
- [ ] DNS propagado (espere 24-48h)
- [ ] `.env.local` com RESEND_API_KEY
- [ ] Pacotes instalados (`resend`, `react-email`)
- [ ] Testes enviados com sucesso

---

## 📊 **Limites do Plano Free**

```
✅ 100 emails/dia
✅ Unlimited templates
✅ Custom domains
✅ Webhooks
✅ Analytics básica
```

**Quando migrar para pago:** ~$20/mês para mais volume

---

## 🔄 **Migrar para Supabase depois**

Quando quiser consolidar tudo no Supabase:

1. Criar novo arquivo `src/lib/email-supabase.ts`
2. Usar mesma interface
3. Mudar import em `src/lib/email.ts`
4. **Resto da app não muda nada!**

---

## 🆘 **Troubleshooting**

### **Emails em spam?**
- Verifique registros SPF/DKIM no Resend
- Espere DNS propagar completamente
- Teste com domínio verificado

### **"API Key invalid"**
- Copie novamente da Resend (Settings > API Keys)
- Certifique-se que está em `.env.local`
- Reinicie o servidor

### **"Domain not verified"**
- Aguarde 24-48h após adicionar registros DNS
- Clique em **"Verify"** no Resend para forçar check

---

## 📞 **Contato Resend**

- 📧 support@resend.com
- 🌐 https://resend.com/docs
- 💬 Discord da comunidade

---

## 📁 **Arquivos Criados**

```
src/lib/
├── email.ts                 # Serviço principal
└── email-templates.tsx      # Templates React Email

.env.local (criar)
└── RESEND_API_KEY=...
```

**Pronto! Agora você pode usar `sendInviteEmail()` em qualquer lugar do app.** ✨
