# 🚀 Deploy no Vercel - ConversaLearn

## Passo a Passo para Deploy

### Opção 1: Deploy via CLI (Recomendado)

1. **Instale o Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Faça login no Vercel**
   ```bash
   vercel login
   ```

3. **Deploy do projeto**
   ```bash
   # Na pasta do projeto
   cd e:\GitHub\ft_edtechapp
   vercel
   ```

4. **Siga os prompts:**
   - Set up and deploy? → **Yes**
   - Which scope? → Selecione sua conta
   - Link to existing project? → **No**
   - Project name? → `conversalearn-mozambique` (ou outro nome)
   - In which directory is your code located? → `./` (Enter)
   - Want to override settings? → **No**

5. **Deploy em produção**
   ```bash
   vercel --prod
   ```

### Opção 2: Deploy via GitHub + Vercel Dashboard

1. **Faça commit e push para GitHub**
   ```bash
   git add .
   git commit -m "feat: Neobrutalist Christian landing page"
   git push origin main
   ```

2. **Acesse [vercel.com](https://vercel.com)**
   - Faça login com GitHub
   - Clique em "New Project"
   - Selecione o repositório `ft_edtechapp`
   - Clique em "Deploy"

3. **Configurações automáticas**
   O Vercel vai detectar automaticamente o projeto estático.

### Opção 3: Deploy Drag & Drop

1. **Acesse [vercel.com/new](https://vercel.com/new)**
2. **Arraste a pasta do projeto** para a área de upload
3. **Clique em Deploy**

## ⚙️ Configuração Personalizada

### Variáveis de Ambiente (se necessário)

No Vercel Dashboard:
1. Vá em Settings → Environment Variables
2. Adicione variáveis se necessário

### Build Settings

O projeto já está configurado via `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/",
      "dest": "/index-neobrutalist.html"
    },
    {
      "src": "/app",
      "dest": "/index.html"
    }
  ]
}
```

## 📁 Estrutura de URLs Após Deploy

- **Homepage (Neobrutalist):** `https://seu-projeto.vercel.app/`
- **WebApp (Chat):** `https://seu-projeto.vercel.app/app`
- **Conversor:** `https://seu-projeto.vercel.app/conversor-texto-json.html`
- **Início:** `https://seu-projeto.vercel.app/inicio.html`

## 🔧 Domínio Personalizado

1. **No Vercel Dashboard:**
   - Vá em Settings → Domains
   - Clique em "Add Domain"
   - Digite seu domínio (ex: `conversalearn.org`)

2. **Configure DNS:**
   - Aponte para os servidores do Vercel
   - Ou adicione um CNAME record

## ✅ Checklist Pré-Deploy

- [x] Todos os arquivos necessários estão presentes
- [x] `vercel.json` configurado
- [x] Links internos funcionando
- [x] Responsividade testada
- [x] PWA configurado (manifest.json, sw.js)
- [x] Service Worker para modo offline
- [x] Cores de Moçambique integradas
- [x] Animações suaves implementadas
- [x] Tailwind CSS via CDN

## 📱 PWA no Vercel

O Service Worker funcionará automaticamente após o deploy. Usuários poderão:
- Instalar o app na tela inicial
- Usar offline após primeiro acesso
- Receber atualizações automáticas

## 🐛 Troubleshooting

### Erro: "No such file or directory"
Certifique-se de estar na pasta correta:
```bash
cd e:\GitHub\ft_edtechapp
vercel
```

### Erro: "Build failed"
Verifique se todos os arquivos estão commitados:
```bash
git status
git add .
git commit -m "fix: Add missing files"
```

### Página em branco
1. Verifique o console do navegador (F12)
2. Confirme que `content-structure.json` está acessível
3. Teste localmente primeiro

### Service Worker não funciona
- HTTPS é obrigatório (Vercel fornece automaticamente)
- Limpe o cache do navegador
- Teste em modo anônimo

## 🎨 Customizações Pós-Deploy

### Mudar Página Inicial

Edite `vercel.json`:
```json
{
  "routes": [
    {
      "src": "/",
      "dest": "/index.html"  // Mude aqui
    }
  ]
}
```

### Adicionar Redirecionamentos

```json
{
  "redirects": [
    {
      "source": "/comecar",
      "destination": "/app"
    }
  ]
}
```

## 📊 Analytics

O Vercel oferece analytics grátis:
1. Vá em Analytics no dashboard
2. Veja visitantes, page views, etc.

## 🚀 Performance

O Vercel otimiza automaticamente:
- ✅ Compressão Gzip
- ✅ Cache headers
- ✅ CDN global
- ✅ HTTPS
- ✅ HTTP/2

## 📞 Suporte

- Documentação: [vercel.com/docs](https://vercel.com/docs)
- Community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

## 🎉 Após o Deploy

1. Teste em diferentes dispositivos
2. Compartilhe o link com sua comunidade
3. Monitore analytics
4. Receba feedback
5. Itere e melhore!

---

**Que Deus abençoe este projeto e que muitos cresçam na fé! 🙏**
