// ===== Estado Global da Aplicação =====
const AppState = {
    xp: 0,
    streak: 0,
    currentCourse: null,
    currentLesson: null,
    currentDropIndex: 0,
    currentMessageIndex: 0,
    totalDrops: 0,
    completedDrops: 0,
    lastStudyDate: null,
    consecutiveCorrect: 0
};

// ===== LocalStorage =====
const Storage = {
    save() {
        localStorage.setItem('conversalearn-state', JSON.stringify({
            xp: AppState.xp,
            streak: AppState.streak,
            lastStudyDate: AppState.lastStudyDate
        }));
    },

    load() {
        const saved = localStorage.getItem('conversalearn-state');
        if (saved) {
            const data = JSON.parse(saved);
            AppState.xp = data.xp || 0;
            AppState.streak = data.streak || 0;
            AppState.lastStudyDate = data.lastStudyDate;

            // Verificar se manteve a streak
            this.checkStreak();
        }
    },

    checkStreak() {
        if (!AppState.lastStudyDate) return;

        const lastDate = new Date(AppState.lastStudyDate);
        const today = new Date();
        const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays > 1) {
            AppState.streak = 0; // Perdeu a streak
            showToast('😢 Você perdeu sua ofensiva! Vamos recomeçar!', 'error');
        } else if (diffDays === 1) {
            // Continuou a streak (será incrementada ao completar lição)
        }
    },

    updateStreak() {
        const today = new Date().toDateString();
        const lastDate = AppState.lastStudyDate ? new Date(AppState.lastStudyDate).toDateString() : null;

        if (today !== lastDate) {
            AppState.streak++;
            AppState.lastStudyDate = new Date();
            this.save();

            if (AppState.streak >= 3) {
                showToast(`🔥 Ofensiva de ${AppState.streak} dias! Continue assim!`, 'success');
            }
        }
    }
};

// ===== UI Helper Functions =====
const UI = {
    updateStats() {
        document.getElementById('xp').textContent = AppState.xp;
        document.getElementById('streak').textContent = AppState.streak;

        // Animação de "fogo" quando streak >= 3
        const streakIcon = document.querySelector('.stat-item .stat-icon');
        if (AppState.streak >= 3) {
            streakIcon.classList.add('on-fire');
        }
    },

    updateProgress() {
        const progress = (AppState.completedDrops / AppState.totalDrops) * 100;
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');

        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}% completo`;
    },

    addMessage(text, sender = 'professor', delay = 0) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const chatContainer = document.getElementById('chatContainer');
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${sender}`;

                const bubble = document.createElement('div');
                bubble.className = 'message-bubble';

                const textDiv = document.createElement('div');
                textDiv.className = 'message-text';
                textDiv.innerHTML = text; // Permite HTML (negrito, emojis)

                bubble.appendChild(textDiv);
                messageDiv.appendChild(bubble);
                chatContainer.appendChild(messageDiv);

                // Scroll imediato para o final (sem animação)
                chatContainer.scrollTo({
                    top: chatContainer.scrollHeight,
                    behavior: 'auto'
                });

                resolve();
            }, delay);
        });
    },

    showTypingIndicator() {
        const chatContainer = document.getElementById('chatContainer');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message professor';
        typingDiv.id = 'typing-indicator';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';

        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';

        bubble.appendChild(indicator);
        typingDiv.appendChild(bubble);
        chatContainer.appendChild(typingDiv);

        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'auto'
        });
    },

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    },

    clearInteractionArea() {
        document.getElementById('interactionArea').innerHTML = '';
    },

    createButton(text, onClick, className = 'btn-primary') {
        const button = document.createElement('button');
        button.className = `btn ${className}`;
        button.textContent = text;
        button.onclick = onClick;
        return button;
    },

    createInteractionContent() {
        const area = document.getElementById('interactionArea');
        area.innerHTML = '';

        const content = document.createElement('div');
        content.className = 'interaction-content';
        area.appendChild(content);

        return content;
    }
};

// ===== Toast Notifications =====
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;

    // Mostrar
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Esconder após 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showXPGain(amount) {
    showToast(`+${amount} XP! ⭐`, 'xp-gain');
    AppState.xp += amount;
    UI.updateStats();
    Storage.save();
}

// ===== Processamento de Drops =====
class LessonRunner {
    constructor(lesson) {
        this.lesson = lesson;
        this.drops = lesson.drops;
        AppState.totalDrops = this.drops.length;
        AppState.completedDrops = 0;
        AppState.currentDropIndex = 0;
    }

    async start() {
        UI.updateProgress();
        await this.processDrop(0);
    }

    async processDrop(dropIndex) {
        if (dropIndex >= this.drops.length) {
            this.complete();
            return;
        }

        const drop = this.drops[dropIndex];
        AppState.currentDropIndex = dropIndex;

        // Mostrar indicador de digitação
        UI.showTypingIndicator();
        await new Promise(resolve => setTimeout(resolve, 800));
        UI.hideTypingIndicator();

        // Exibir mensagens sequencialmente
        for (const message of drop.messages) {
            await UI.addMessage(message.text, drop.sender, message.delay);
        }

        // XP por ler o conteúdo
        if (drop.xp) {
            showXPGain(drop.xp);
        }

        // Processar interação
        await this.handleInteraction(drop.interaction, dropIndex);
    }

    async handleInteraction(interaction, dropIndex) {
        const content = UI.createInteractionContent();

        switch (interaction.type) {
            case 'continue':
                const continueBtn = UI.createButton(interaction.button, async () => {
                    AppState.completedDrops++;
                    UI.updateProgress();
                    UI.clearInteractionArea();
                    await this.processDrop(dropIndex + 1);
                });
                content.appendChild(continueBtn);
                break;

            case 'quiz':
                await this.handleQuiz(interaction, dropIndex, content);
                break;

            case 'complete':
                const completeBtn = UI.createButton(interaction.button, (e) => {
                    // Prevent multiple clicks
                    if (e.target.disabled) return;
                    e.target.disabled = true;
                    e.target.textContent = 'Carregando...';

                    showXPGain(interaction.bonusXP);
                    Storage.updateStreak();
                    UI.updateStats();

                    setTimeout(() => {
                        alert('Lição completada! 🎉\n\nEm breve: próximas lições!');
                        location.reload(); // Reinicia para demonstração
                    }, 1000);
                });
                content.appendChild(completeBtn);
                break;
        }
    }

    async handleQuiz(interaction, dropIndex, content) {
        const quizDiv = document.createElement('div');
        quizDiv.className = 'quiz-options';

        const question = document.createElement('div');
        question.className = 'quiz-question';
        question.textContent = interaction.question;
        quizDiv.appendChild(question);

        let answered = false;

        interaction.options.forEach(option => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'btn btn-option';
            optionBtn.textContent = option.text;

            optionBtn.onclick = async () => {
                if (answered) return;
                answered = true;

                // Desabilitar todos os botões
                quizDiv.querySelectorAll('.btn-option').forEach(btn => {
                    btn.disabled = true;
                });

                if (option.correct) {
                    optionBtn.classList.add('correct');
                    await UI.addMessage(option.feedback, 'professor', 0);
                    showXPGain(interaction.xpCorrect);

                    AppState.consecutiveCorrect++;

                    // Modo "Em Chamas" - 5 acertos seguidos
                    if (AppState.consecutiveCorrect >= 5 && AppState.consecutiveCorrect % 5 === 0) {
                        showToast('🔥 MODO EM CHAMAS! XP em dobro nas próximas!', 'success');
                    }
                } else {
                    optionBtn.classList.add('incorrect');
                    await UI.addMessage(option.feedback, 'professor', 0);
                    showXPGain(interaction.xpIncorrect);
                    AppState.consecutiveCorrect = 0;
                }

                // Continuar após resposta
                setTimeout(async () => {
                    AppState.completedDrops++;
                    UI.updateProgress();
                    UI.clearInteractionArea();
                    await this.processDrop(dropIndex + 1);
                }, 2000);
            };

            quizDiv.appendChild(optionBtn);
        });

        content.appendChild(quizDiv);
    }

    complete() {
        showToast('🎊 Parabéns! Você completou a lição!', 'success');
    }
}

// ===== Carregamento de Conteúdo =====
async function loadContent() {
    try {
        let data;

        // Primeiro, verificar se existe conteúdo customizado no cache
        const customContent = localStorage.getItem('conversalearn-custom-content');

        if (customContent) {
            // Usar conteúdo customizado
            console.log('📝 Carregando conteúdo personalizado do cache...');
            data = JSON.parse(customContent);

            // Mostrar indicador visual
            const indicator = document.getElementById('customContentIndicator');
            if (indicator) {
                indicator.style.display = 'flex';
            }

            // Mostrar notificação ao usuário
            showToast('📝 Usando seu conteúdo personalizado!', 'success');
        } else {
            // Carregar conteúdo padrão do JSON
            console.log('📚 Carregando conteúdo padrão...');
            const response = await fetch('content-structure.json');
            data = await response.json();
        }

        // Pegar primeiro curso e primeira lição
        const course = data.courses[0];
        const lesson = course.lessons[0];

        AppState.currentCourse = course;
        AppState.currentLesson = lesson;

        console.log('✅ Lição carregada:', lesson.title);

        // Iniciar a lição
        const runner = new LessonRunner(lesson);
        runner.start();

    } catch (error) {
        console.error('❌ Erro ao carregar conteúdo:', error);
        showToast('Erro ao carregar conteúdo. Verifique sua conexão.', 'error');
    }
}

// ===== Inicialização =====
document.addEventListener('DOMContentLoaded', () => {
    // Carregar estado salvo
    Storage.load();
    UI.updateStats();

    // Carregar conteúdo
    loadContent();

    // Registrar Service Worker para PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('Service Worker registrado'))
            .catch(err => console.log('Erro no Service Worker:', err));
    }
});

// ===== Função Global para Limpar Conteúdo Customizado =====
function clearCustomContent() {
    if (confirm('Deseja remover seu conteúdo personalizado e usar o conteúdo padrão?')) {
        localStorage.removeItem('conversalearn-custom-content');
        showToast('🗑️ Conteúdo personalizado removido. Recarregando...', 'success');
        setTimeout(() => {
            location.reload();
        }, 1500);
    }
}
