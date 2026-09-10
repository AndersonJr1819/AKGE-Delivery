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
        p.innerHTML = text;
        messageDiv.appendChild(p);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getRandomResponse(array) {
        const index = Math.floor(Math.random() * array.length);
        return array[index];
    }

    function getAIResponse(userText) {
        const query = userText.toLowerCase().trim();

        const greetings = ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'e aí', 'salve'];
        if (greetings.some(word => query === word || query.startsWith(word + ' '))) {
            return getRandomResponse([
                "Olá! Seja muito bem-vindo ao AKGEFood. O que manda hoje?",
                "Oi! Como posso ajudar a saciar sua fome agora?",
                "Olá! Pronto para escolher algo delicioso? Me diga o que procura.",
                "Oi, tudo bem? Em que posso ajudar no seu pedido de hoje?"
            ]);
        }

        const farewells = ['obrigado', 'obrigada', 'valeu', 'tchau', 'até mais', 'vlws', 'muito obrigado'];
        if (farewells.some(word => query.includes(word))) {
                return getRandomResponse([
                "Por nada! Sempre à disposição. Bom apetite! 🍔",
                "Imagina! Volte sempre que bater aquela fome. 🚀",
                "Disponível sempre! Tenha uma excelente refeição.",
                "Tchau! Conte com o AKGEFood sempre que precisar."
            ]);
        }

        const vagueHunger = ['fome', 'com fome', 'o que comer', 'me indica', 'indica', 'sugestão', 'sugestao', 'o que tem', 'quero comer', 'alguma coisa'];
        if (vagueHunger.some(word => query.includes(word)) && !query.includes('hambúrguer') && !query.includes('hamburguer') && !query.includes('pizza') && !query.includes('sushi') && !query.includes('doce') && !query.includes('bebida')) {
            return "Claro! 😋 Você prefere:<br>🍔 Hambúrguer<br>🍕 Pizza<br>🍣 Sushi<br>🥩 Churrasco<br>🥗 Saudável<br>🍰 Sobremesa";
        }

        if (query.includes('hambúrguer') || query.includes('hamburguer') || query.includes('lanche')) {
            return getRandomResponse([
                "Que tal o Hambúrguer Artesanal do Burger House? É uma ótima opção para matar a fome. 🍔",
                "Para lanches, o Burger House é imbatível! Recomendo muito o Burger Duplo Artesanal.",
                "Com certeza o Burger House com seu pão brioche e carne Angus vai te surpreender hoje! 🍔"
            ]);
        }

        if (query.includes('pizza')) {
            return getRandomResponse([
                "Você pode experimentar a Pizza da Pizzaria Top. Quer que eu te mostre o cardápio? 🍕",
                "A Pizzaria Top tem massas incríveis e recheios generosos. Uma excelente escolha!",
                "Que tal uma pizza quentinha da Pizzaria Top? Perfeita para dividir ou comer sozinho. 🍕"
            ]);
        }

        if (query.includes('sushi') || query.includes('japonesa') || query.includes('japones')) {
            return getRandomResponse([
                "Uma boa opção é o Combinado de Sushi do Sushi Prime. 🍣",
                "O Sushi Prime traz peixes frescos e muita qualidade no cardápio japonês.",
                "Se quer algo leve e sofisticado, o Sushi Prime vai te atender super bem. 🍣"
            ]);
        }

        if (query.includes('churrasco') || query.includes('carne') || query.includes('brasileira')) {
            return getRandomResponse([
                "O Churrasco & Brasa oferece cortes nobres suculentos que valem muito a pena! 🥩",
                "Para pratos tradicionais e carnes na brasa, o Churrasco & Brasa é o destaque."
            ]);
        }

        if (query.includes('salada') || query.includes('saudável') || query.includes('saudavel') || query.includes('leve')) {
            return getRandomResponse([
                "O Green Bowl Saladas é perfeito para um almoço leve, nutritivo e super saboroso. 🥗",
                "Quer algo saudável? As opções do Green Bowl Saladas são excelentes!"
            ]);
        }

        if (query.includes('doce') || query.includes('sobremesa') || query.includes('bolo') || query.includes('sorvete') || query.includes('açaí') || query.includes('acai')) {
            return getRandomResponse([
                "Tenho algumas opções de sobremesa. O Brownie do Burger House ou os bolos da Doce Mel Confeitaria podem ser uma ótima escolha. 🍫",
                "Para adoçar o dia, a Doce Mel Confeitaria tem bolos e doces maravilhosos!",
                "Que tal conferir as delícias da Doce Mel Confeitaria ou pedir uma sobremesa? 🍰"
            ]);
        }

        if (query.includes('bebida') || query.includes('drink') || query.includes('suco') || query.includes('refrigerante')) {
            return getRandomResponse([
                "Todos os restaurantes contam com seção de bebidas geladas no cardápio, incluindo refrigerantes e sucos naturais. 🥤",
                "Para acompanhar seu prato, você pode escolher sucos, refrigerantes ou drinks disponíveis em cada cardápio."
            ]);
        }

        if (query.includes('restaurante') || query.includes('loja') || query.includes('quais')) {
            return "Atualmente temos 6 excelentes restaurantes disponíveis no AKGEFood:<br>1. Burger House (Lanches)<br>2. Pizzaria Napolitana (Pizzas)<br>3. Sushi Prime (Japonesa)<br>4. Churrasco & Brasa (Brasileira)<br>5. Green Bowl Saladas (Saudável)<br>6. Doce Mel Confeitaria (Sobremesas)";
        }

        if (query.includes('cardápio') || query.includes('cardapio') || query.includes('prato') || query.includes('acompanhamento')) {
            return "Cada restaurante em nossa plataforma possui um cardápio organizado em seções como Principais, Acompanhamentos, Bebidas e Sobremesas. Basta clicar em 'Ver cardápio' no restaurante desejado.";
        }

        if (query.includes('oferta') || query.includes('desconto') || query.includes('promoção') || query.includes('promocao') || query.includes('cupom')) {
            return "Temos ótimas ofertas ativas:<br>• 20% OFF no primeiro pedido com o cupom AKGEPRIME20<br>• Frete Grátis em lojas parceiras selecionadas<br>• Combo Especial Dupla em lanches selecionados.";
        }

        if (query.includes('pedido') || query.includes('status') || query.includes('acompanhar') || query.includes('entrega') || query.includes('tempo')) {
            return "Você pode acompanhar o seu pedido atual na seção de rastreamento da página inicial. A simulação atual mostra o Pedido #1024 do Burger House entregue com sucesso!";
        }

        if (query.includes('carrinho') || query.includes('comprar') || query.includes('total')) {
            return "Você pode verificar os itens adicionados e o valor total do seu pedido na seção do carrinho logo acima na página.";
        }

        if (query.includes('doação') || query.includes('doacao') || query.includes('ong') || query.includes('social')) {
            return "Na finalização do pedido, você pode escolher adicionar uma doação solidária (R$ 1,00, R$ 3,00 ou R$ 5,00) para ONGs parceiras do AKGEFood. Faça a diferença!";
        }

        return getRandomResponse([
            "Entendi! Posso ajudar você a encontrar restaurantes, conferir cardápios, ver ofertas ou tirar dúvidas sobre o funcionamento do AKGEFood. O que prefere?",
            "Hmm, não tenho certeza se entendi perfeitamente. Quer que eu te mostre nossos restaurantes ou as ofertas do dia?",
            "Posso recomendar pratos, buscar restaurantes ou tirar dúvidas sobre entregas e cardápios. Como posso ajudar?"
        ]);
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