// API Route para Railway: /api/generate-lesson
// Converte texto livre em JSON estruturado usando OpenAI

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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
- Conceito: explicação clara com versículos bíblicos
- Quiz: 3 opções (A/B/C), apenas 1 correta
- Reforço: parabéns e encorajamento
- Use emojis apropriados
- XP: Gancho (0), Conceito (5), Quiz correto (10), Reforço bonus (20)

RETORNE APENAS JSON válido no formato:
{
  "id": "lesson-timestamp",
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
      "messages": [{"text": "Introdução ao quiz", "delay": 0}],
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

    const generatedJSON = completion.choices[0].message.content;

    // Remover markdown code blocks se houver
    let cleanJSON = generatedJSON.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Validar JSON
    const lesson = JSON.parse(cleanJSON);

    // Adicionar timestamp se não tiver ID
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
      message: error.message,
      details: error.response?.data || null
    });
  }
}
