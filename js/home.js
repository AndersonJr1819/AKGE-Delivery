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
            const card = button.closest('.menu-item-card') || button.closest('.restaurant-card') || button.closest('div');
            const id = card ? card.getAttribute('data-id') || 'item-geral' : 'item-geral';
            const name = card ? card.getAttribute('data-name') || 'Produto AKGEFood' : 'Produto AKGEFood';
            const price = card ? parseFloat(card.getAttribute('data-price') || '25.00') : 25.00;
            const quantityControl = card ? card.querySelector('.quantity-control') : null;
            const qtyValue = card ? card.querySelector('.qty-value') : null;

            if (!cartItems[id]) {
                cartItems[id] = { name: name, price: price, quantity: 1 };
            } else {
                cartItems[id].quantity += 1;
            }

            button.style.display = 'none';
            if (quantityControl) {
                quantityControl.style.display = 'flex';
            }
            if (qtyValue) {
                qtyValue.textContent = cartItems[id].quantity;
            }

            updateCartUI();
            showCustomAlert(`${name} foi adicionado ao seu carrinho!`);
        });
    });

    const quantityControls = document.querySelectorAll('.quantity-control');
    quantityControls.forEach(control => {
        const decreaseBtn = control.querySelector('.decrease');
        const increaseBtn = control.querySelector('.increase');
        const qtyValue = control.querySelector('.qty-value');
        const card = control.closest('.menu-item-card') || control.closest('.restaurant-card');
        const id = card ? card.getAttribute('data-id') : null;
        const addButton = card ? card.querySelector('.btn-add-cart') : null;

        if (increaseBtn && id) {
            increaseBtn.addEventListener('click', () => {
                if (cartItems[id]) {
                    cartItems[id].quantity += 1;
                    if (qtyValue) qtyValue.textContent = cartItems[id].quantity;
                    updateCartUI();
                }
            });
        }

        if (decreaseBtn && id) {
            decreaseBtn.addEventListener('click', () => {
                if (cartItems[id]) {
                    cartItems[id].quantity -= 1;
                    if (cartItems[id].quantity <= 0) {
                        delete cartItems[id];
                        control.style.display = 'none';
                        if (addButton) addButton.style.display = 'block';
                    } else {
                        if (qtyValue) qtyValue.textContent = cartItems[id].quantity;
                    }
                    updateCartUI();
                }
            });
        }
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
                let summaryText = `Seu carrinho possui ${totalCount} item(ns):\n`;
                for (const id in cartItems) {
                    summaryText += `- ${cartItems[id].quantity}x ${cartItems[id].name}\n`;
                }
                showCustomAlert(summaryText);
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
                cartItems = {};
                updateCartUI();
                document.querySelectorAll('.quantity-control').forEach(qc => qc.style.display = 'none');
                document.querySelectorAll('.btn-add-cart').forEach(bc => bc.style.display = 'block');
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query !== '') {
                    showCustomAlert(`Pesquisando por: "${query}" na AKGEFood`);
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
                "Olá! Seja muito bem-vindo ao AKGEFood. O que vamos pedir hoje?",
                "Oi! Como posso ajudar você a encontrar um restaurante delicioso agora?",
                "Olá! Pronto para escolher algo saboroso? Me diga o que procura."
            ]);
        }

        const farewells = ['obrigado', 'obrigada', 'valeu', 'tchau', 'até mais', 'vlws', 'muito obrigado'];
        if (farewells.some(word => query.includes(word))) {
            return getRandomResponse([
                "Por nada! Sempre à disposição. Bom apetite! 🍔",
                "Imagina! Volte sempre que bater aquela fome. 🚀",
                "Disponível sempre! Tenha uma excelente refeição."
            ]);
        }

        const restaurantsList = ['burger house', 'pizzaria top', 'sushi prime', 'frango na brasa', 'açaí do vale', 'refresh drinks'];
        if (restaurantsList.some(r => query.includes(r))) {
            return "Excelente escolha! Você pode acessar o cardápio completo desse restaurante clicando diretamente no botão 'Ver cardápio' do estabelecimento.";
        }

        const vagueHunger = ['fome', 'com fome', 'o que comer', 'me indica', 'indica', 'sugestão', 'sugestao', 'o que tem', 'quero comer', 'alguma coisa'];
        if (vagueHunger.some(word => query.includes(word))) {
            return "Claro! 😋 No AKGEFood temos ótimas opções: Burger House (Hambúrgueres), Pizzaria Top (Pizzas), Sushi Prime (Japonês), Frango na Brasa, Açaí do Vale e Refresh Drinks.";
        }

        if (query.includes('cardápio') || query.includes('cardapio') || query.includes('restaurante')) {
            return "Temos 6 restaurantes incríveis disponíveis na nossa plataforma. Escolha o seu favorito na seção de restaurantes e clique em 'Ver cardápio'.";
        }

        if (query.includes('carrinho')) {
            return "Você pode verificar os itens adicionados e o total do seu pedido clicando no ícone do carrinho no topo da página.";
        }

        return getRandomResponse([
            "Entendi! Posso ajudar você a encontrar restaurantes, tirar dúvidas sobre pedidos ou orientar sobre a navegação. O que prefere?",
            "Hmm, não tenho certeza se entendi perfeitamente. Quer que eu te indique nossos principais restaurantes recomendados?"
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