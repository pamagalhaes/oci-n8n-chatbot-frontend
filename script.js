document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const chatWindow = document.getElementById('chat-window');
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const welcomeMessage = document.getElementById('welcome-message');

    // Botões do cabeçalho
    const settingsBtn = document.getElementById('settings-btn');
    const newSessionBtn = document.getElementById('new-session-btn');

    // Elementos do Modal
    const settingsModal = document.getElementById('settings-modal');
    const closeBtn = document.querySelector('.close-btn');
    const webhookInput = document.getElementById('webhook-input');
    const saveWebhookBtn = document.getElementById('save-webhook-btn');

    let n8nWebhookUrl = localStorage.getItem('n8nWebhookUrl') || '';
    if (n8nWebhookUrl) {
        webhookInput.value = n8nWebhookUrl;
    }

    // --- Lógica do Cabeçalho ---
    newSessionBtn.addEventListener('click', () => {
        location.reload(); // A forma mais simples de iniciar uma nova sessão
    });

    // --- Lógica do Modal de Configurações ---
    settingsBtn.addEventListener('click', () => { settingsModal.style.display = 'flex'; });
    closeBtn.addEventListener('click', () => { settingsModal.style.display = 'none'; });
    window.addEventListener('click', (event) => { if (event.target === settingsModal) { settingsModal.style.display = 'none'; } });

    saveWebhookBtn.addEventListener('click', () => {
        const newUrl = webhookInput.value.trim();
        if (newUrl) {
            n8nWebhookUrl = newUrl;
            localStorage.setItem('n8nWebhookUrl', n8nWebhookUrl);
            alert('Webhook salvo com sucesso!');
            settingsModal.style.display = 'none';
        } else {
            alert('Por favor, insira uma URL válida.');
        }
    });

    // --- Lógica do Chat ---
    chatForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const userMessage = messageInput.value.trim();
        if (!userMessage) return;
        if (!n8nWebhookUrl) {
            alert('Por favor, configure a URL do webhook primeiro.');
            settingsModal.style.display = 'flex';
            return;
        }

        // Esconde a mensagem de boas-vindas ao enviar a primeira mensagem
        if (welcomeMessage) {
            welcomeMessage.style.display = 'none';
        }

        addMessage(userMessage, 'user');
        messageInput.value = '';
        const typingIndicator = addTypingIndicator();

        try {
            const response = await fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userMessage })
            });

            if (!response.ok) {
                throw new Error(`Erro na rede: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const botMessage = data.answer || 'Não recebi uma resposta válida. Verifique o JSON retornado pelo n8n.';
            addMessage(botMessage, 'bot');

        } catch (error) {
            console.error('Erro ao contatar o webhook:', error);
            addMessage(`Ocorreu um erro: ${error.message}. Verifique o console e a URL do webhook.`, 'bot', true);
        } finally {
            if (typingIndicator.parentNode) {
                chatWindow.removeChild(typingIndicator);
            }
        }
    });

    function addMessage(text, sender, isError = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        if (isError) { messageElement.classList.add('error-message'); }
        const p = document.createElement('p');
        p.textContent = text;
        messageElement.appendChild(p);
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function addTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.classList.add('message', 'bot-message', 'typing-indicator');
        indicator.innerHTML = '<p>OCI GenAI está pensando...</p>';
        chatWindow.appendChild(indicator);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        return indicator;
    }
});