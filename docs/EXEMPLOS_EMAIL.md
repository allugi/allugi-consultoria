# 📧 Exemplos de Uso - Sistema de Email

Exemplos práticos de como usar o sistema de email em diferentes partes da aplicação.

---

## 📌 Índice

1. [Convite de Membro](#convite-de-membro)
2. [Recuperação de Senha](#recuperação-de-senha)
3. [Email de Boas-vindas](#email-de-boas-vindas)
4. [Notificações de Time](#notificações-de-time)
5. [Envios em Massa](#envios-em-massa)
6. [Tratamento de Erros](#tratamento-de-erros)

---

## 🎯 Convite de Membro

### Usar em: Configurações > Equipe > Convidar Membro

```typescript
// src/routes/configuracoes-equipe-multitenant.tsx
import { sendInviteEmail } from '@/lib/email'

async function handleInviteSubmit(formData) {
  try {
    // 1. Validar dados
    if (!formData.email || !formData.firstName) {
      alert('Email e nome obrigatórios')
      return
    }

    // 2. Chamar API para criar user_company e gerar token
    const inviteResponse = await fetch('/api/users/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        jobTitle: formData.jobTitle,
        department: formData.department,
        roleId: formData.roleId
      })
    })

    const result = await inviteResponse.json()

    if (result.success) {
      toast.success(`Convite enviado para ${formData.email}`)
      // Recarregar membros
      loadTeamMembers()
    } else {
      toast.error(result.error)
    }
  } catch (error) {
    toast.error('Erro ao convidar membro')
  }
}

// No backend (Express)
app.post('/api/users/invite', async (req, res) => {
  const { email, firstName, lastName, jobTitle, department, roleId } = req.body
  const companyId = req.user.currentCompanyId
  const userId = req.user.id

  // Gerar token
  const inviteToken = generateInviteToken()

  // Salvar no banco
  const userCompany = await db.userCompanies.create({
    email,
    firstName,
    lastName,
    jobTitle,
    department,
    roleId,
    companyId,
    status: 'pending',
    invitationToken: inviteToken,
    invitationExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  })

  // Enviar email
  const company = await db.companies.findById(companyId)
  const sender = await db.users.findById(userId)

  const result = await sendInviteEmail({
    email: email,
    firstName: firstName,
    companyName: company.name,
    inviteLink: `${process.env.APP_URL}/join?token=${inviteToken}`,
    inviteToken: inviteToken,
    senderName: `${sender.firstName} ${sender.lastName}`
  })

  if (!result.success) {
    return res.status(500).json({ success: false, error: 'Erro ao enviar email' })
  }

  res.json({
    success: true,
    data: { id: userCompany.id, email, status: 'pending' }
  })
})
```

---

## 🔐 Recuperação de Senha

### Usar em: Tela de Login > "Esqueci minha senha"

```typescript
// Frontend: src/pages/ForgotPassword.tsx
import { sendResetPasswordEmail } from '@/lib/email'

async function handleForgotPassword(email: string) {
  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })

    const result = await response.json()

    if (result.success) {
      toast.success('Email de recuperação enviado')
    }
  } catch (error) {
    toast.error('Erro ao enviar email')
  }
}

// Backend: POST /api/auth/forgot-password
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body

  // Buscar usuário
  const user = await db.users.findByEmail(email)

  if (!user) {
    // Não revelar se existe ou não (segurança)
    return res.json({
      success: true,
      message: 'Se este email existir, você receberá um link de recuperação'
    })
  }

  // Gerar token de reset (JWT com exp 1h)
  const resetToken = generateJWT({ userId: user.id }, '1h')

  // Salvar token no banco (opcional, para invalidação)
  await db.passwordResets.create({
    userId: user.id,
    token: resetToken,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000)
  })

  // Enviar email
  const result = await sendResetPasswordEmail({
    email: user.email,
    firstName: user.firstName,
    resetLink: `${process.env.APP_URL}/reset-password?token=${resetToken}`
  })

  res.json({
    success: true,
    message: 'Email de recuperação enviado'
  })
})
```

---

## 🎉 Email de Boas-vindas

### Usar em: Após aceitar convite ou criar conta

```typescript
// Backend: POST /api/auth/accept-invite
app.post('/api/auth/accept-invite', async (req, res) => {
  const { token, password } = req.body

  // Verificar token
  const userCompany = await db.userCompanies.findByToken(token)

  if (!userCompany || new Date() > userCompany.invitationExpiresAt) {
    return res.status(400).json({ error: 'Convite inválido ou expirado' })
  }

  // Criar usuário
  const user = await db.users.create({
    email: userCompany.email,
    firstName: userCompany.firstName,
    lastName: userCompany.lastName,
    passwordHash: await hashPassword(password),
    status: 'active'
  })

  // Ativar user_company
  await db.userCompanies.update(userCompany.id, {
    status: 'active',
    invitationToken: null
  })

  // ✨ Enviar email de boas-vindas
  const company = await db.companies.findById(userCompany.companyId)
  await sendWelcomeEmail({
    email: user.email,
    firstName: user.firstName,
    companyName: company.name
  })

  // Gerar token JWT
  const jwtToken = generateJWT(user.id, userCompany.companyId)

  res.json({
    success: true,
    token: jwtToken,
    user: { id: user.id, email: user.email }
  })
})
```

---

## 📢 Notificações de Time

### Usar em: Eventos importantes (aprovação, atribuição, etc)

```typescript
import { sendEmail } from '@/lib/email'

// Exemplo 1: Notificar quando uma tarefa é atribuída
app.post('/api/tasks/:id/assign', async (req, res) => {
  const { taskId } = req.params
  const { assignedToUserId } = req.body
  const userId = req.user.id
  const companyId = req.user.currentCompanyId

  // Atualizar tarefa
  const task = await db.tasks.update(taskId, {
    assignedTo: assignedToUserId
  })

  // Notificar usuário
  const assignedUser = await db.users.findById(assignedToUserId)
  const creator = await db.users.findById(userId)

  await sendEmail({
    to: assignedUser.email,
    template: 'team-notification',
    data: {
      title: 'Nova Tarefa Atribuída',
      message: `${creator.firstName} atribuiu a tarefa "${task.title}" para você.`,
      actionUrl: `${process.env.APP_URL}/tasks/${taskId}`,
      actionText: 'Ver Tarefa',
      userName: assignedUser.firstName
    }
  })

  res.json({ success: true })
})

// Exemplo 2: Notificar quando diagnóstico é concluído
app.post('/api/diagnosis/:id/mark-complete', async (req, res) => {
  const { diagnosisId } = req.params
  const userId = req.user.id

  // Marcar como concluído
  const diagnosis = await db.diagnosis.update(diagnosisId, {
    completedAt: new Date(),
    completedBy: userId
  })

  // Notificar gerente
  const company = await db.companies.findById(diagnosis.companyId)
  const managers = await db.users.findByRole(company.id, 'COMPANY_MANAGER')

  for (const manager of managers) {
    await sendEmail({
      to: manager.email,
      template: 'team-notification',
      data: {
        title: 'Diagnóstico Concluído',
        message: `O diagnóstico "${diagnosis.title}" foi concluído e está pronto para análise.`,
        actionUrl: `${process.env.APP_URL}/diagnosis/${diagnosisId}`,
        actionText: 'Ver Análise',
        userName: manager.firstName
      }
    })
  }

  res.json({ success: true })
})
```

---

## 📧 Envios em Massa

### Usar em: Notificar múltiplos usuários

```typescript
import { sendEmail } from '@/lib/email'

// Função auxiliar para envio em massa
async function sendEmailToMultiple(users: any[], template: string, data: any) {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as any[]
  }

  // Processar em lotes (não sobrecarregar)
  const batchSize = 10
  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize)

    const promises = batch.map(user =>
      sendEmail({
        to: user.email,
        template: template,
        data: { ...data, userName: user.firstName }
      }).catch(error => ({
        success: false,
        error,
        email: user.email
      }))
    )

    const batchResults = await Promise.allSettled(promises)

    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        if (result.value.success) {
          results.success++
        } else {
          results.failed++
          results.errors.push({
            email: batch[index].email,
            error: result.value.error
          })
        }
      }
    })

    // Aguardar um pouco entre lotes (rate limiting)
    if (i + batchSize < users.length) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  return results
}

// Usar:
app.post('/api/notify-all-members', async (req, res) => {
  const { companyId, title, message } = req.body

  // Buscar todos os membros ativos
  const members = await db.users.findByCompany(companyId, { status: 'active' })

  // Enviar email em massa
  const results = await sendEmailToMultiple(
    members,
    'team-notification',
    {
      title: title,
      message: message,
      actionUrl: `${process.env.APP_URL}/dashboard`
    }
  )

  res.json({
    success: true,
    data: {
      sent: results.success,
      failed: results.failed,
      errors: results.errors
    }
  })
})
```

---

## ⚠️ Tratamento de Erros

```typescript
import { sendEmail, sendInviteEmail } from '@/lib/email'

// Tratamento seguro com retry
async function sendEmailWithRetry(
  options: any,
  maxRetries: number = 3
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await sendEmail(options)

      if (result.success) {
        return true
      }

      console.warn(
        `Tentativa ${attempt}/${maxRetries} falhou: ${result.error}`
      )

      // Aguardar antes de retry (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt - 1) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    } catch (error) {
      console.error(`Erro na tentativa ${attempt}:`, error)
    }
  }

  // Falhou após todas as tentativas
  console.error(`Falha definitiva ao enviar email para ${options.to}`)
  return false
}

// Usar em caso crítico
app.post('/api/users/invite-critical', async (req, res) => {
  const options = {
    to: 'important@example.com',
    template: 'invite',
    data: { /* ... */ }
  }

  const success = await sendEmailWithRetry(options)

  if (!success) {
    // Opção 1: Notificar admin
    await logCriticalError({
      type: 'EMAIL_SEND_FAILED',
      email: options.to,
      timestamp: new Date()
    })

    // Opção 2: Tentar novamente depois (job queue)
    await queue.add('send-email', options, {
      delay: 60000, // 1 minuto
      attempts: 5
    })

    return res.status(500).json({
      error: 'Erro ao enviar email. Será retentado automaticamente.'
    })
  }

  res.json({ success: true })
})
```

---

## 🔧 Variáveis de Ambiente

```env
# .env.local

# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=suporte@allugi.com
RESEND_FROM_NAME=Allugi

# URLs
APP_URL=http://localhost:3000
APP_NAME=Allugi

# Email Settings
EMAIL_BATCH_SIZE=10
EMAIL_RATE_LIMIT_MS=1000
```

---

## ✅ Checklist de Implementação

- [ ] Resend configurado com domínio allugi.com
- [ ] `src/lib/email.ts` criado
- [ ] `src/lib/email-templates.tsx` criado
- [ ] API endpoint `/api/users/invite` implementado
- [ ] API endpoint `/api/auth/forgot-password` implementado
- [ ] API endpoint `/api/auth/accept-invite` implementado
- [ ] Email de boas-vindas enviado após aceitar convite
- [ ] Notificações de team implementadas
- [ ] Testes enviados com sucesso
- [ ] DNS de allugi.com propagado (24-48h)

---

## 📞 Suporte

Dúvidas sobre integração? Consulte:
- **Documentação Resend**: https://resend.com/docs
- **React Email**: https://react.email
- **Arquivo**: SETUP_EMAIL_RESEND.md
