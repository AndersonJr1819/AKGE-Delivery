document.addEventListener('DOMContentLoaded', () => {
    const chatToggleBtn = document.querySelector('.ai-chat-toggle-btn');
    const chatWindow = document.querySelector('.ai-chat-window');
    const chatCloseBtn = document.querySelector('.ai-chat-close-btn');
    const chatClearBtn = document.querySelector('.ai-chat-clear-btn');
    const chatMessages = document.querySelector('.ai-chat-messages');
    const chatInput = document.querySelector('.ai-chat-input');
    const chatSendBtn = document.querySelector('.ai-chat-send-btn');

    const initialMessageHTML = `
        <div class="ai-message bot">
            <p>Olá! 👋 Sou a IA AKGEFood. Posso ajudar você a encontrar restaurantes, pratos, ofertas ou recomendar algo de acordo com o seu gosto.</p>
        </div>
    `;

    if (chatToggleBtn && chatWindow) {
        chatToggleBtn.addEventListener('click', () => {
            const isHidden = chatWindow.getAttribute('aria-hidden') === 'true';
            chatWindow.setAttribute('aria-hidden', !isHidden);
            if (isHidden && chatInput) {
                chatInput.focus();
            }
        });
    }

    if (chatCloseBtn && chatWindow) {
        chatCloseBtn.addEventListener('click', () => {
            chatWindow.setAttribute('aria-hidden', 'true');
        });
    }

    if (chatClearBtn && chatMessages) {
        chatClearBtn.addEventListener('click', () => {
            chatMessages.innerHTML = initialMessageHTML;
        });
    }

    function addMessage(text, sender) {
        if (!chatMessages) return;
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('ai-message', sender);
        
        const p = document.createElement('p');
        p.textContent = text;
        messageDiv.appendChild(p);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getAIResponse(userText) {
        const query = userText.toLowerCase();

        if (query.includes('hambúrguer') || query.includes('hamburguer') || query.includes('lanche')) {
            return "Posso recomendar o Burger House! 🍔 Ele é uma das opções disponíveis no AKGEFood.";
        }
        if (query.includes('pizza')) {
            return "A Pizzaria Top pode ser uma ótima opção! 🍕 Quer conferir o cardápio?";
        }
        if (query.includes('doce') || query.includes('sobremesa') || query.includes('açaí') || query.includes('acai')) {
            return "Você pode experimentar uma sobremesa ou conferir o Açaí do Vale! 🍨";
        }
        if (query.includes('sushi') || query.includes('japonesa') || query.includes('japones')) {
            return "O Sushi Prime é excelente para quem ama comida japonesa! 🍣";
        }
        if (query.includes('frango')) {
            return "Que tal o Frango na Brasa? 🍗 Pratos suculentos e muito bem avaliados.";
        }
        if (query.includes('bebida') || query.includes('drink') || query.includes('sede')) {
            return "Para se refrescar, temos o Refresh Drinks com várias opções de bebidas! 🥤";
        }
        if (query.includes('restaurante') || query.includes('quais') || query.includes('temos')) {
            return "No momento temos Burger House, Pizzaria Top, Sushi Prime, Frango na Brasa, Açaí do Vale e Refresh Drinks.";
        }
        if (query.includes('oferta') || query.includes('desconto') || query.includes('promoção') || query.includes('promocao')) {
            return "Temos ofertas especiais como 20% OFF no primeiro pedido, frete grátis e combos promocionais.";
        }
        if (query.includes('entrega') || query.includes('tempo') || query.includes('demora')) {
            return "O tempo de entrega varia entre 15 a 60 minutos, dependendo do restaurante escolhido e da sua localização.";
        }
        if (query.includes('pedido') || query.includes('carrinho') || query.includes('acompanhar')) {
            return "Você pode acompanhar seu pedido atual na seção de rastreamento da página ou verificar os itens adicionados no carrinho.";
        }
        if (query.includes('doação') || query.includes('doacao') || query.includes('ong')) {
            return "Na finalização do pedido, você pode escolher doar valores a partir de R$ 1,00 para ONGs parceiras do AKGEFood.";
        }
        if (query.includes('como funciona') || query.includes('akgefood') || query.includes('sobre')) {
            return "O AKGEFood é sua plataforma de delivery focada em praticidade, oferecendo restaurantes variados, acompanhamento em tempo real e recomendações inteligentes.";
        }

        return "Entendi! Posso ajudar você a encontrar restaurantes, conferir cardápios, ver ofertas ou tirar dúvidas sobre o funcionamento do AKGEFood. O que prefere?";
    }

    function handleUserMessage() {
        if (!chatInput) return;
        const text = chatInput.value.trim();
        if (text === '') return;

        addMessage(text, 'user');
        chatInput.value = '';

        setTimeout(() => {
            const response = getAIResponse(text);
            addMessage(response, 'bot');
        }, 500);
    }

    if (chatSendBtn && chatInput) {
        chatSendBtn.addEventListener('click', handleUserMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleUserMessage();
            }
        });
    }
});