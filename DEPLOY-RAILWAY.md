# 🚂 Deploy no Railway - ConversaLearn

## ⚠️ Importante - OpenAI API

Este projeto agora usa **OpenAI API** para converter texto livre em lições estruturadas!

### Como funciona:
- **Sem IA:** Você precisa seguir um formato rígido (`[GANCHO]`, `BOTÃO:`, etc.)
- **Com IA:** Você escreve texto livre e a OpenAI converte automaticamente! ✨

## 📋 Pré-requisitos

1. Conta no Railway: https://railway.app
2. Repositório Git configurado
3. Arquivos criados: `package.json`, `server.js`, `railway.json`

## 🚀 Passos para Deploy

### 1. Conectar Repositório

1. Acesse https://railway.app
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Escolha este repositório: `ftsp_edtech_create`

### 2. Configuração Automática

O Railway detectará automaticamente:
- ✅ `package.json` → Ambiente Node.js
- ✅ `railway.json` → Configurações de build
- ✅ `server.js` → Comando de start

### 3. Deploy

1. Railway iniciará o build automaticamente
2. Aguarde 2-3 minutos
3. Acesse a URL fornecida (ex: `https://seu-projeto.up.railway.app`)

### 4. Configurar Variáveis de Ambiente

**OBRIGATÓRIO** para usar a geração com IA:

No Railway Dashboard:
1. Vá em **"Variables"**
2. Adicione:

```env
OPENAI_API_KEY=sk-proj-sua-chave-aqui
```

**Opcional:**
```env
OPENAI_MODEL=gpt-4o-mini
OPENAI_TEMPERATURE=0.7
NODE_ENV=production
```

#### Como obter a chave OpenAI:
1. Acesse: https://platform.openai.com/api-keys
2. Crie uma nova chave
3. Cole no Railway (aba Variables)

**Custo estimado:**
- Modelo: `gpt-4o-mini`
- ~$0.001 por lição gerada (muito barato!)
- Você pode usar o parsing manual sem custo (modo antigo)

## 🌐 URLs Após Deploy

Seu projeto terá uma URL como:
```
https://conversalearn-production.up.railway.app
```

**Rotas disponíveis:**
- `/` → Landing page ([index.html](index.html:1-325))
- `/app` → WebApp conversacional ([webapp.html](webapp.html:1-140))
- `/content-creator.html` → Criador de conteúdo

## 📂 Estrutura de Arquivos Railway

```
package.json         → Dependências (Express)
server.js           → Servidor Node.js simples
railway.json        → Configuração Railway
.railwayignore      → Arquivos ignorados
```

## 🧪 Testar Localmente

Antes de fazer deploy, teste localmente:

```bash
# Instalar dependências
npm install

# Rodar servidor
npm start

# Acesse
http://localhost:3000
```

## 🔧 Troubleshooting

### "Build failed"
```bash
# Verifique se package.json está correto
cat package.json
```

### "Application crashed"
```bash
# Veja os logs no Railway Dashboard
# Procure por erros de porta ou Express
```

### "Service Worker não funciona"
- Railway fornece HTTPS automaticamente ✅
- Certifique-se de acessar via `https://`

## 🆚 Railway vs Vercel

| Recurso | Railway | Vercel |
|---------|---------|--------|
| **Tipo** | Backend/Fullstack | Static/Serverless |
| **Ideal para** | APIs, Databases | Sites estáticos |
| **Custo** | $5/mês após trial | Grátis |
| **Deploy** | ~3 min | ~30s |
| **Nossa recomendação** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**Para este projeto:** Vercel é mais adequado, mas Railway funciona perfeitamente!

## 📊 Recursos Railway (Free Tier)

- ✅ 500h/mês de runtime
- ✅ HTTPS automático
- ✅ Deploy contínuo (Git)
- ✅ Logs em tempo real
- ⚠️ Crédito inicial de $5 (depois pago)

## 🎯 Comandos Úteis

### Deploy Manual
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Logs
```bash
railway logs
```

### Variáveis
```bash
railway variables
```

## 🔗 Links Úteis

- **Dashboard:** https://railway.app/dashboard
- **Documentação:** https://docs.railway.app
- **Status:** https://status.railway.app

## ✅ Checklist de Deploy

- [ ] Código commitado no Git
- [ ] `package.json` criado
- [ ] `server.js` criado
- [ ] `railway.json` criado
- [ ] Repositório conectado no Railway
- [ ] Build concluído com sucesso
- [ ] URL acessível
- [ ] PWA funcionando (Service Worker)
- [ ] Teste em mobile

## 🎓 Sobre o Projeto

Este é um **PWA educacional** para ensino de fundamentos cristãos em Moçambique.

**Características:**
- 🇲🇿 Cores de Moçambique
- 💬 Interface conversacional
- 🎮 Gamificação (XP, streaks)
- 📱 Funciona offline
- ✝️ Conteúdo teológico reformado

## 🙏 Conclusão

**NÃO é necessário configurar nenhuma API da OpenAI**. O projeto funciona 100% standalone.

Se tiver dúvidas, consulte:
- [README.md](README.md:1-225) → Visão geral
- [DEPLOY-VERCEL.md](DEPLOY-VERCEL.md:1) → Deploy alternativo (recomendado)

---

**"Procura apresentar-te a Deus aprovado, como obreiro que não tem de que se envergonhar."** - 2 Timóteo 2:15 🇲🇿✝️
