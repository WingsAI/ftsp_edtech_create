import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

// Configuração ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

// Inicializar OpenAI (apenas se a chave existir)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  console.log('✅ OpenAI configurada');
} else {
  console.log('⚠️  OpenAI não configurada (OPENAI_API_KEY não encontrada)');
}

// ===== ROTAS HTML =====

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para o webapp
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'webapp.html'));
});

// Rota para o criador de conteúdo
app.get('/content-creator', (req, res) => {
  res.sendFile(path.join(__dirname, 'content-creator.html'));
});

// ===== API ROUTES =====

// API: Gerar lição com OpenAI
app.post('/api/generate-lesson', async (req, res) => {
  if (!openai) {
    return res.status(503).json({
      error: 'OpenAI não configurada',
      message: 'Configure OPENAI_API_KEY nas variáveis de ambiente'
    });
  }

  const { userText } = req.body;

  if (!userText || userText.trim().length === 0) {
    return res.status(400).json({ error: 'Texto vazio' });
  }

  if (userText.length > 5000) {
    return res.status(400).json({ error: 'Texto muito longo (máx: 5000 caracteres)' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
      messages: [
        {
          role: 'system',
          content: `Você é um assistente que converte texto livre em lições conversacionais estruturadas para uma plataforma de micro-learning cristã em Moçambique.

REGRAS:
- Criar lições de 3-5 minutos
- Usar linguagem simples e portuguesa de Moçambique
- Estrutura: Gancho → Conceito → Quiz → Reforço
- Gancho: pergunta instigante
- Conceito: explicação clara com versículos bíblicos (use ** para negrito)
- Quiz: 3 opções (A/B/C), apenas 1 correta
- Reforço: parabéns e encorajamento
- Use emojis apropriados (💙 ✝️ 🎉 💡 💪 🎊)
- XP: Gancho (0), Conceito (5), Quiz correto (10/errado 2), Reforço bonus (20)

RETORNE APENAS JSON válido no formato:
{
  "id": "lesson-${Date.now()}",
  "title": "Título da Lição",
  "estimatedTime": "3 minutos",
  "drops": [
    {
      "type": "gancho",
      "sender": "professor",
      "messages": [
        {"text": "Mensagem 1", "delay": 0},
        {"text": "Mensagem 2", "delay": 1500}
      ],
      "interaction": {"type": "continue", "button": "Texto do botão"}
    },
    {
      "type": "conceito",
      "sender": "professor",
      "messages": [{"text": "Explicação com **negrito**", "delay": 0}],
      "interaction": {"type": "continue", "button": "Entendi!"},
      "xp": 5
    },
    {
      "type": "reflexao",
      "sender": "professor",
      "messages": [{"text": "Agora vamos testar:", "delay": 0}],
      "interaction": {
        "type": "quiz",
        "question": "Pergunta?",
        "options": [
          {"id": "a", "text": "Opção correta", "correct": true, "feedback": "Parabéns! 🎉"},
          {"id": "b", "text": "Opção errada", "correct": false, "feedback": "Tente novamente! 💪"},
          {"id": "c", "text": "Opção errada", "correct": false, "feedback": "Quase! 💡"}
        ],
        "xpCorrect": 10,
        "xpIncorrect": 2
      }
    },
    {
      "type": "reforco",
      "sender": "professor",
      "messages": [{"text": "Parabéns! Você completou! 🎊", "delay": 0}],
      "interaction": {"type": "complete", "button": "Finalizar", "bonusXP": 20}
    }
  ]
}`
        },
        {
          role: 'user',
          content: `Crie uma lição conversacional baseada neste texto:\n\n${userText}`
        }
      ]
    });

    let generatedJSON = completion.choices[0].message.content;

    // Remover markdown code blocks se houver
    generatedJSON = generatedJSON.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Validar JSON
    const lesson = JSON.parse(generatedJSON);

    // Garantir ID
    if (!lesson.id) {
      lesson.id = `lesson-${Date.now()}`;
    }

    return res.status(200).json({
      success: true,
      lesson: lesson,
      usage: {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens
      }
    });

  } catch (error) {
    console.error('❌ Erro ao gerar lição:', error);

    return res.status(500).json({
      error: 'Erro ao gerar lição',
      message: error.message
    });
  }
});

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    openai: openai ? 'configured' : 'not configured',
    timestamp: new Date().toISOString()
  });
});

// ===== SERVIDOR =====

app.listen(PORT, () => {
  console.log(`🚀 ConversaLearn rodando na porta ${PORT}`);
  console.log(`📱 Acesse: http://localhost:${PORT}`);
  console.log(`🤖 OpenAI: ${openai ? '✅ Configurada' : '⚠️  Não configurada'}`);
});
