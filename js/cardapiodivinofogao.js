document.addEventListener('DOMContentLoaded', () => {
    const cartState = {
        items: [],
        deliveryFee: 6.99
    };

    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const menuCards = document.querySelectorAll('.menu-item-card');

            menuCards.forEach(card => {
                const itemName = card.getAttribute('data-name').toLowerCase();
                const itemDesc = card.querySelector('.menu-item-info p').textContent.toLowerCase();
                
                if (itemName.includes(searchTerm) || itemDesc.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    const menuCards = document.querySelectorAll('.menu-item-card');
    
    menuCards.forEach(card => {
        const itemId = card.getAttribute('data-id');
        const itemName = card.getAttribute('data-name');
        const itemPrice = parseFloat(card.getAttribute('data-price').replace(',', '.'));
        
        const addBtn = card.querySelector('.btn-add-cart');
        const qtyControl = card.querySelector('.quantity-control');
        const qtyValue = card.querySelector('.qty-value');
        const decreaseBtn = card.querySelector('.decrease');
        const increaseBtn = card.querySelector('.increase');

        addBtn.addEventListener('click', () => {
            addBtn.style.display = 'none';
            qtyControl.style.display = 'flex';
            
            updateCartItem(itemId, itemName, itemPrice, 1);
        });

        increaseBtn.addEventListener('click', () => {
            let currentQty = parseInt(qtyValue.textContent);
            currentQty++;
            qtyValue.textContent = currentQty;
            
            updateCartItem(itemId, itemName, itemPrice, currentQty);
        });

        decreaseBtn.addEventListener('click', () => {
            let currentQty = parseInt(qtyValue.textContent);
            currentQty--;
            
            if (currentQty <= 0) {
                qtyValue.textContent = '1';
                qtyControl.style.display = 'none';
                addBtn.style.display = 'block';
                
                removeCartItem(itemId);
            } else {
                qtyValue.textContent = currentQty;
                updateCartItem(itemId, itemName, itemPrice, currentQty);
            }
        });
    });

    function updateCartItem(id, name, price, quantity) {
        const existingIndex = cartState.items.findIndex(item => item.id === id);
        
        if (existingIndex > -1) {
            cartState.items[existingIndex].quantity = quantity;
        } else {
            cartState.items.push({ id, name, price, quantity });
        }
        
        renderCart();
    }

    function removeCartItem(id) {
        cartState.items = cartState.items.filter(item => item.id !== id);
        renderCart();
    }

    function renderCart() {
        const cartItemsList = document.querySelector('.cart-items-list');
        const cartBadge = document.querySelector('.cart-badge');
        
        const totalItemsCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
        if (cartBadge) {
            cartBadge.textContent = totalItemsCount;
        }

        if (cartState.items.length === 0) {
            cartItemsList.innerHTML = `
                <div class="cart-item-placeholder">
                    <span>Nenhum produto adicionado no momento</span>
                </div>
            `;
        } else {
            cartItemsList.innerHTML = '';
            cartState.items.forEach(item => {
                const itemTotal = (item.price * item.quantity).toFixed(2).replace('.', ',');
                const cartRow = document.createElement('div');
                cartRow.className = 'cart-item-row';
                cartRow.style.display = 'flex';
                cartRow.style.justifyContent = 'space-between';
                cartRow.style.alignItems = 'center';
                cartRow.style.fontSize = '14px';
                cartRow.style.marginBottom = '8px';
                
                cartRow.innerHTML = `
                    <div>
                        <strong>${item.quantity}x</strong> ${item.name}
                    </div>
                    <span>R$ ${itemTotal}</span>
                `;
                cartItemsList.appendChild(cartRow);
            });
        }

        const subtotal = cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const finalTotal = subtotal > 0 ? subtotal + cartState.deliveryFee : 0;

        const summaryRows = document.querySelectorAll('.cart-summary .summary-row span:nth-child(2)');
        if (summaryRows.length >= 4) {
            summaryRows[0].textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
            summaryRows[1].textContent = subtotal > 0 ? `R$ ${cartState.deliveryFee.toFixed(2).replace('.', ',')}` : `R$ 0,00`;
            summaryRows[2].textContent = `R$ 0,00`;
            summaryRows[3].textContent = `R$ ${finalTotal.toFixed(2).replace('.', ',')}`;
        }
    }

    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cartState.items.length === 0) {
                showModal('Sacola Vazia', 'Adicione pelo menos um item do Divino Fogão antes de finalizar o pedido.');
            } else {
                showModal('Pedido Realizado!', 'Seu pedido foi enviado com sucesso para a cozinha do Divino Fogão. Bom apetite!');
            }
        });
    }

    function showModal(title, message) {
        let overlay = document.querySelector('.akge-modal-overlay');
        
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'akge-modal-overlay';
            overlay.innerHTML = `
                <div class="akge-modal-box">
                    <h3 class="akge-modal-title"></h3>
                    <p class="akge-modal-text"></p>
                    <button class="akge-modal-btn">OK</button>
                </div>
            `;
            document.body.appendChild(overlay);

            overlay.querySelector('.akge-modal-btn').addEventListener('click', () => {
                overlay.classList.remove('active');
            });
            
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                }
            });
        }

        overlay.querySelector('.akge-modal-title').textContent = title;
        overlay.querySelector('.akge-modal-text').textContent = message;
        
        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);
    }

    const chatToggleBtn = document.querySelector('.ai-chat-toggle-btn');
    const chatWindow = document.querySelector('.ai-chat-window');
    const chatCloseBtn = document.querySelector('.ai-chat-close-btn');
    const chatClearBtn = document.querySelector('.ai-chat-clear-btn');
    const chatSendBtn = document.querySelector('.ai-chat-send-btn');
    const chatInput = document.querySelector('.ai-chat-input');
    const chatMessages = document.querySelector('.ai-chat-messages');

    if (chatToggleBtn && chatWindow) {
        chatToggleBtn.addEventListener('click', () => {
            const isHidden = chatWindow.getAttribute('aria-hidden') === 'true';
            chatWindow.setAttribute('aria-hidden', !isHidden);
        });
    }

    if (chatCloseBtn && chatWindow) {
        chatCloseBtn.addEventListener('click', () => {
            chatWindow.setAttribute('aria-hidden', 'true');
        });
    }

    if (chatClearBtn && chatMessages) {
        chatClearBtn.addEventListener('click', () => {
            chatMessages.innerHTML = `
                <div class="ai-message bot">
                    <p>Conversa limpa. Como posso ajudar com o cardápio do Divino Fogão?</p>
                </div>
            `;
        });
    }

    function handleSendMessage() {
        if (!chatInput) return;
        const text = chatInput.value.trim();
        if (!text) return;

        const userMsg = document.createElement('div');
        userMsg.className = 'ai-message user';
        userMsg.innerHTML = `<p>${escapeHtml(text)}</p>`;
        chatMessages.appendChild(userMsg);

        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'ai-message bot';
            botMsg.innerHTML = `<p>Entendi sua dúvida sobre "${text}". O Prato Feito Tradicional e o Pudim de Leite Condensado são excelentes escolhas do Divino Fogão!</p>`;
            chatMessages.appendChild(botMsg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 800);
    }

    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', handleSendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSendMessage();
            }
        });
    }

    function escapeHtml(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }
});