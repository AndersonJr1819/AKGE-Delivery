document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-box input');
    const cartButton = document.querySelector('.cart-btn');
    const cartBadge = document.querySelector('.cart-badge');
    const cartItemsList = document.querySelector('.cart-items-list');
    const summaryRows = document.querySelectorAll('.summary-row span');
    const addItemButtons = document.querySelectorAll('.btn-add-cart');
    const checkoutButton = document.querySelector('.btn-checkout');

    let cartItems = {};

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'akge-modal-overlay';
    modalOverlay.innerHTML = `
        <div class="akge-modal-box">
            <h3 class="akge-modal-title">AKGEFood</h3>
            <p class="akge-modal-text"></p>
            <button class="akge-modal-btn">OK</button>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    const modalTextElement = modalOverlay.querySelector('.akge-modal-text');
    const modalButton = modalOverlay.querySelector('.akge-modal-btn');

    function showCustomAlert(message) {
        modalTextElement.textContent = message;
        modalOverlay.classList.add('active');
    }

    function closeCustomAlert() {
        modalOverlay.classList.remove('active');
    }

    modalButton.addEventListener('click', closeCustomAlert);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeCustomAlert();
        }
    });

    function updateCartUI() {
        let totalCount = 0;
        let subtotal = 0;

        for (const id in cartItems) {
            totalCount += cartItems[id].quantity;
            subtotal += cartItems[id].price * cartItems[id].quantity;
        }

        if (cartBadge) {
            cartBadge.textContent = totalCount;
        }

        if (cartItemsList) {
            if (totalCount > 0) {
                cartItemsList.innerHTML = '';
                for (const id in cartItems) {
                    const item = cartItems[id];
                    const itemRow = document.createElement('div');
                    itemRow.style.display = 'flex';
                    itemRow.style.justifyContent = 'space-between';
                    itemRow.style.alignItems = 'center';
                    itemRow.style.width = '100%';
                    itemRow.style.marginBottom = '8px';
                    itemRow.innerHTML = `
                        <div style="display: flex; flex-direction: column;">
                            <span style="font-weight: 600; font-size: 13px;">${item.name}</span>
                            <span style="font-size: 11px; color: #718096;">${item.quantity}x R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <span style="font-weight: 700; font-size: 13px;">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                    `;
                    cartItemsList.appendChild(itemRow);
                }
            } else {
                cartItemsList.innerHTML = `
                    <div class="cart-item-placeholder">
                        <span>Nenhum produto adicionado no momento</span>
                    </div>
                `;
            }
        }

        if (summaryRows.length >= 8) {
            summaryRows[1].textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
            summaryRows[3].textContent = `R$ 0,00`;
            summaryRows[5].textContent = `R$ 0,00`;
            summaryRows[7].textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        }
    }

    addItemButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.menu-item-card');
            const id = card.getAttribute('data-id');
            const name = card.getAttribute('data-name');
            const price = parseFloat(card.getAttribute('data-price'));
            const quantityControl = card.querySelector('.quantity-control');
            const qtyValue = card.querySelector('.qty-value');

            if (!cartItems[id]) {
                cartItems[id] = { name: name, price: price, quantity: 1 };
            } else {
                cartItems[id].quantity += 1;
            }

            button.style.display = 'none';
            quantityControl.style.display = 'flex';
            qtyValue.textContent = cartItems[id].quantity;

            updateCartUI();
            showCustomAlert(`${name} foi adicionado ao seu carrinho!`);
        });
    });

    const quantityControls = document.querySelectorAll('.quantity-control');
    quantityControls.forEach(control => {
        const decreaseBtn = control.querySelector('.decrease');
        const increaseBtn = control.querySelector('.increase');
        const qtyValue = control.querySelector('.qty-value');
        const card = control.closest('.menu-item-card');
        const id = card.getAttribute('data-id');
        const addButton = card.querySelector('.btn-add-cart');

        increaseBtn.addEventListener('click', () => {
            if (cartItems[id]) {
                cartItems[id].quantity += 1;
                qtyValue.textContent = cartItems[id].quantity;
                updateCartUI();
            }
        });

        decreaseBtn.addEventListener('click', () => {
            if (cartItems[id]) {
                cartItems[id].quantity -= 1;
                if (cartItems[id].quantity <= 0) {
                    delete cartItems[id];
                    control.style.display = 'none';
                    addButton.style.display = 'block';
                } else {
                    qtyValue.textContent = cartItems[id].quantity;
                }
                updateCartUI();
            }
        });
    });

    if (cartButton) {
        cartButton.addEventListener('click', () => {
            let totalCount = 0;
            for (const id in cartItems) {
                totalCount += cartItems[id].quantity;
            }
            if (totalCount === 0) {
                showCustomAlert('Seu carrinho está vazio no momento.');
            } else {
                showCustomAlert(`Seu carrinho possui ${totalCount} item(ns).`);
            }
        });
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            let totalCount = 0;
            for (const id in cartItems) {
                totalCount += cartItems[id].quantity;
            }
            if (totalCount === 0) {
                showCustomAlert('Adicione pelo menos um item ao carrinho antes de finalizar o pedido.');
            } else {
                showCustomAlert('Pedido enviado com sucesso! Acompanhe o status na página inicial.');
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query !== '') {
                    showCustomAlert(`Pesquisando por: "${query}" na Pizzaria POP`);
                }
            }
        });
    }

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
                "Olá! Seja muito bem-vindo à Pizzaria POP no AKGEFood. O que vai pedir hoje?",
                "Oi! Como posso ajudar você a escolher uma pizza deliciosa agora?",
                "Olá! Pronto para escolher algo saboroso? Me diga o que procura."
            ]);
        }

        const farewells = ['obrigado', 'obrigada', 'valeu', 'tchau', 'até mais', 'vlws', 'muito obrigado'];
        if (farewells.some(word => query.includes(word))) {
            return getRandomResponse([
                "Por nada! Sempre à disposição. Bom apetite! 🍕",
                "Imagina! Volte sempre que bater aquela fome. 🚀",
                "Disponível sempre! Tenha uma excelente refeição."
            ]);
        }

        const vagueHunger = ['fome', 'com fome', 'o que comer', 'me indica', 'indica', 'sugestão', 'sugestao', 'o que tem', 'quero comer', 'alguma coisa'];
        if (vagueHunger.some(word => query.includes(word)) && !query.includes('hambúrguer') && !query.includes('pizza') && !query.includes('pão') && !query.includes('refrigerante') && !query.includes('doce')) {
            return "Claro! 😋 Aqui na Pizzaria POP você pode pedir:<br>🍕 Pizza Especial<br>🥖 Pão de Alho<br>🥤 Refrigerante<br>🍰 Petit Gâteau";
        }

        if (query.includes('pizza') || query.includes('massa')) {
            return getRandomResponse([
                "Que tal a Pizza Especial da Pizzaria POP? É preparada com massa artesanal, queijo, molho de tomate e ingredientes selecionados por R$ 39,90. 🍕",
                "Nossa Pizza Especial é imperdível! Recomendo muito adicionar ao carrinho."
            ]);
        }

        if (query.includes('pão de alho') || query.includes('pao de alho') || query.includes('acompanhamento')) {
            return getRandomResponse([
                "Para acompanhar sua pizza, temos o Pão de Alho assado e temperado por R$ 12,00. 🥖"
            ]);
        }

        if (query.includes('bebida') || query.includes('refrigerante')) {
            return getRandomResponse([
                "Temos Refrigerante gelado por R$ 6,00 para acompanhar seu pedido. 🥤"
            ]);
        }

        if (query.includes('doce') || query.includes('sobremesa') || query.includes('petit gâteau') || query.includes('petit gateau')) {
            return getRandomResponse([
                "Para a sobremesa, temos o delicioso Petit Gâteau de chocolate quente por R$ 16,00. 🍰"
            ]);
        }

        if (query.includes('cardápio') || query.includes('cardapio') || query.includes('prato')) {
            return "O cardápio da Pizzaria POP conta com a Pizza Especial (Principal), Refrigerante (Bebida), Pão de Alho (Acompanhamento) e Petit Gâteau (Sobremesa).";
        }

        if (query.includes('carrinho')) {
            return "Você pode verificar os itens adicionados e o total do seu pedido no painel do carrinho ao lado.";
        }

        return getRandomResponse([
            "Entendi! Posso ajudar você a encontrar itens no cardápio da Pizzaria POP, tirar dúvidas sobre preços ou sobre o carrinho. O que prefere?",
            "Hmm, não tenho certeza se entendi perfeitamente. Quer que eu te indique nossas principais pizzas ou sobremesas?"
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