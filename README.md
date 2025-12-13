# 💬 ConversaLearn - Moçambique

Plataforma de **micro-learning conversacional** para ensino de fundamentos da fé cristã, com design neobrutalist e cores de Moçambique.

## 🚀 Início Rápido

### 1. Rodar Localmente
```bash
python -m http.server 8000
```

Acesse: **http://localhost:8000**

### 2. Deploy no Vercel
```bash
npm install -g vercel
vercel --prod
```

## 📁 Estrutura de Arquivos

```
index.html              → Landing page neobrutalist (página inicial)
webapp.html             → WebApp de chat conversacional
content-creator.html    → Criador de conteúdo personalizado
app.js                  → Lógica do webapp
styles.css              → Estilos do chat
content-structure.json  → Conteúdo padrão (Fundamentos da Fé)
manifest.json           → Configuração PWA
sw.js                   → Service Worker (offline)
```

## 🌐 URLs

### Servidor Local
- **Landing:** `http://localhost:8000/`
- **WebApp:** `http://localhost:8000/webapp.html`
- **Creator:** `http://localhost:8000/content-creator.html`

### Vercel (após deploy)
- **Landing:** `https://seu-projeto.vercel.app/`
- **WebApp:** `https://seu-projeto.vercel.app/app`
- **Creator:** `https://seu-projeto.vercel.app/content-creator.html`

## ✨ Funcionalidades

### 🎨 Landing Page Neobrutalist
- Design bold com cores de Moçambique 🇲🇿 (Verde, Amarelo, Vermelho)
- Bordas grossas (4-6px) e sombras marcadas
- Animações suaves (scroll reveal, float, glitch)
- Totalmente responsivo (mobile-first)
- Tailwind CSS inline

### 💬 WebApp Conversacional
- Interface estilo WhatsApp/chat
- Lições de 3-5 minutos (micro-learning)
- Sistema de gamificação:
  - **XP** (pontos por ação)
  - **Streaks** (dias consecutivos)
  - **Modo "Em Chamas"** (5 acertos seguidos)
- Barra de progresso visual
- Feedback imediato
- PWA (funciona offline)

### ✍️ Criador de Conteúdo
- Interface visual para criar lições
- Limite: 1000 caracteres
- Conversão automática para JSON
- Preview em tempo real
- Salva no cache do navegador
- Zero configuração necessária

## 📝 Como Criar Conteúdo Personalizado

### 1. Acesse o Creator
`http://localhost:8000/content-creator.html`

### 2. Cole seu texto neste formato:

```
LIÇÃO: Nome da Lição
TEMPO: 3 minutos

[GANCHO]
Pergunta instigante ou fato curioso
Segunda mensagem explicando mais
BOTÃO: Vamos lá!

[CONCEITO]
Explicação clara do conceito
Use **negrito** para destacar
Adicione emojis! 💡
BOTÃO: Entendi!
XP: 5

[QUIZ]
PERGUNTA: Qual a resposta correta?
A) Opção correta | CORRETO | Parabéns! 🎉
B) Opção errada | ERRADO | Tente novamente! 💪
C) Opção errada | ERRADO | Quase! 💡
XP_CORRETO: 10
XP_ERRADO: 2

[REFORÇO]
Parabéns! Você completou! 🎊
Continue assim!
BOTÃO: Finalizar
XP_BONUS: 20
```

### 3. Clique "SALVAR NO CACHE"

### 4. Abra o webapp e use sua lição!

## 🎓 Conteúdo Padrão

**Curso:** Fundamentos da Fé Cristã (Contexto Moçambique)

**Lições:**
1. Quem é Deus? (4 min) - Criação, caráter divino, unicidade
2. O Ser Humano e o Pecado (5 min) - Dignidade, queda, esperança

Baseado na apostila narrativa "Fundamentos da Fé Cristã - Volume 1"

## 🎮 Sistema de Cache

O webapp verifica **cache primeiro** antes de carregar o JSON padrão:

```javascript
localStorage.getItem('conversalearn-custom-content')
  ? Usa conteúdo personalizado ✅
  : Usa content-structure.json 📚
```

### Limpar Cache
No webapp, clique no **[✕]** do indicador amarelo ou:

```javascript
// Console (F12)
localStorage.clear()
location.reload()
```

## 🎨 Cores de Moçambique

```css
--moz-green: #009639   /* Verde da bandeira */
--moz-yellow: #FCE100  /* Amarelo vibrante */
--moz-red: #D21034     /* Vermelho intenso */
--moz-black: #000000   /* Preto para bordas */
```

## 📱 PWA (Progressive Web App)

- ✅ Instala na tela inicial
- ✅ Funciona offline após primeiro acesso
- ✅ Cache first strategy
- ✅ Baixo consumo de dados (apenas texto)

## 🔧 Configuração Vercel

O `vercel.json` já está configurado:

```json
{
  "routes": [
    { "src": "/app", "dest": "/webapp.html" },
    { "src": "/(.*)", "dest": "/$1" }
  ]
}
```

## 🐛 Troubleshooting

### "Vejo página antiga"
```
Ctrl + Shift + R (limpar cache)
```

### "Conteúdo não carrega"
```javascript
// Console (F12)
localStorage.clear()
```

### "Service Worker não funciona"
- Precisa HTTPS (Vercel fornece automaticamente)
- Ou use localhost

### "Texto não converte para JSON"
- Verifique sintaxe (compare com exemplo)
- Máximo 1000 caracteres
- Use | (pipe) nos quizzes

## 📊 Performance

- **Landing:** ~31KB (gzip: ~8KB)
- **WebApp:** ~15KB total
- **Lighthouse:** 90+ em todas métricas
- **First Paint:** < 1.5s

## ✝️ Fundamentos Teológicos

Baseado nas **5 Solas Reformadas:**
- Sola Scriptura (Somente a Escritura)
- Sola Gratia (Somente a Graça)
- Sola Fide (Somente a Fé)
- Solus Christus (Somente Cristo)
- Soli Deo Gloria (Glória somente a Deus)

## 📞 Suporte

- **Documentação Vercel:** https://vercel.com/docs
- **Guia Detalhado:** Ver `DEPLOY-VERCEL.md`

## 📄 Licença

Projeto educacional open-source. Use e adapte livremente para a glória de Deus! 🙏

---

**"Procura apresentar-te a Deus aprovado, como obreiro que não tem de que se envergonhar, que maneja bem a palavra da verdade."** - 2 Timóteo 2:15

🇲🇿 Feito para Moçambique | ✝️ Para a glória de Deus
