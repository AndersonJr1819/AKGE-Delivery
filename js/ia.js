document.addEventListener("DOMContentLoaded", () => {
    const chatToggleBtn = document.querySelector(".ai-chat-toggle-btn");
    const chatWindow = document.querySelector(".ai-chat-window");
    const chatCloseBtn = document.querySelector(".ai-chat-close-btn");
    const chatClearBtn = document.querySelector(".ai-chat-clear-btn");
    const chatMessages = document.querySelector(".ai-chat-messages");
    const chatInput = document.querySelector(".ai-chat-input");
    const chatSendBtn = document.querySelector(".ai-chat-send-btn");

    if (!chatToggleBtn || !chatWindow) return;

    let conversationContext = {
        lastRestaurant: null,
        lastCategory: null
    };

    function getAvailableRestaurants() {
        const cards = document.querySelectorAll('.restaurant-card');
        const list = [];
        cards.forEach(card => {
            const nameEl = card.querySelector('h3');
            const categoryEl = card.querySelector('.restaurant-category');
            const ratingEl = card.querySelector('.rating');
            const deliveryTimeEl = card.querySelector('.delivery-time');
            const minOrderEl = card.querySelector('.min-order');
            const menuLinkEl = card.querySelector('.btn-secondary') || card.querySelector('a');

            if (nameEl) {
                list.push({
                    name: nameEl.textContent.trim(),
                    category: categoryEl ? categoryEl.textContent.trim() : "",
                    rating: ratingEl ? ratingEl.textContent.trim() : "",
                    deliveryTime: deliveryTimeEl ? deliveryTimeEl.textContent.trim() : "",
                    minOrder: minOrderEl ? minOrderEl.textContent.trim() : "",
                    menuLink: menuLinkEl ? menuLinkEl.getAttribute('href') : "#",
                    element: card
                });
            }
        });
        return list;
    }

    function getAvailableProducts() {
        const productCards = document.querySelectorAll('.product-card, .menu-item, [data-product]');
        const products = [];
        productCards.forEach(card => {
            const titleEl = card.querySelector('h4, h3, .product-title');
            const priceEl = card.querySelector('.price, .product-price');
            const descEl = card.querySelector('p, .product-desc');
            if (titleEl) {
                products.push({
                    name: titleEl.textContent.trim(),
                    price: priceEl ? priceEl.textContent.trim() : "",
                    description: descEl ? descEl.textContent.trim() : "",
                    element: card
                });
            }
        });
        return products;
    }

    chatToggleBtn.addEventListener("click", () => {
        const isHidden = chatWindow.getAttribute("aria-hidden") === "true";
        chatWindow.setAttribute("aria-hidden", !isHidden);
        chatWindow.style.display = isHidden ? "flex" : "none";
        if (isHidden && chatInput) chatInput.focus();
    });

    if (chatCloseBtn) {
        chatCloseBtn.addEventListener("click", () => {
            chatWindow.setAttribute("aria-hidden", "true");
            chatWindow.style.display = "none";
        });
    }

    if (chatClearBtn) {
        chatClearBtn.addEventListener("click", () => {
            conversationContext = { lastRestaurant: null, lastCategory: null };
            chatMessages.innerHTML = `
                <div class="ai-message bot">
                    <p>Conversa limpa! Como posso ajudar você a pedir algo delicioso no AKGE Food?</p>
                </div>
            `;
        });
    }

    function appendMessage(sender, htmlContent) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("ai-message", sender);
        messageDiv.innerHTML = `<p>${htmlContent}</p>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement("div");
        typingDiv.classList.add("ai-message", "bot", "ai-typing");
        typingDiv.innerHTML = `<p>Digitando...</p>`;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingDiv;
    }

    function processAIResponse(userText) {
        const text = userText.toLowerCase().trim();
        const restaurants = getAvailableRestaurants();
        const products = getAvailableProducts();

        const typingIndicator = showTypingIndicator();

        setTimeout(() => {
            typingIndicator.remove();
            let response = "";

            const matchedRestaurant = restaurants.find(r => text.includes(r.name.toLowerCase()));
            if (matchedRestaurant) {
                conversationContext.lastRestaurant = matchedRestaurant;
                response = `Encontrei o <b>${matchedRestaurant.name}</b> (${matchedRestaurant.category})!<br>⭐ Avaliação: ${matchedRestaurant.rating} | ⏱️ Entrega: ${matchedRestaurant.deliveryTime} | Pedido mínimo: ${matchedRestaurant.minOrder}.<br><a href="${matchedRestaurant.menuLink}" style="color: #ff4757; text-decoration: underline; font-weight: bold;">Clique aqui para ver o cardápio completo</a>`;
            } 
            else if (text.includes("olá") || text.includes("oi") || text.includes("bom dia") || text.includes("boa tarde") || text.includes("boa noite")) {
                response = "Olá! Sou o assistente inteligente do AKGE Food. Posso mostrar restaurantes, sugerir pratos do cardápio, explicar sobre entregas, carrinho ou doações para ONGs. O que deseja agora?";
            } 
            else if (text.includes("restaurante") || text.includes("lista") || text.includes("quais") || text.includes("opções") || text.includes("lugares") || text.includes("lugares posso pedir")) {
                response = "Estes são os restaurantes disponíveis no AKGE Food:<br>";
                restaurants.forEach(r => {
                    response += `• <b>${r.name}</b> (${r.category}) - ⭐ ${r.rating} | Entrega: ${r.deliveryTime} | <a href="${r.menuLink}" style="color: #ff4757; text-decoration: underline;">Ver cardápio</a><br>`;
                });
            }
            else if (text.includes("bebida") || text.includes("sucos") || text.includes("refrigerante") || text.includes("água")) {
                response = "Temos diversas opções de bebidas refrescantes disponíveis nos cardápios dos nossos restaurantes parceiros. Pode acessar o cardápio do seu restaurante favorito para escolher a sua preferida!";
            }
            else if (text.includes("acompanhamento") || text.includes("porção") || text.includes("extras")) {
                response = "Os acompanhamentos variam conforme o estabelecimento escolhido. Verifique os detalhes diretamente no cardápio do restaurante desejado na página inicial.";
            }
            else if (text.includes("sobremesa") || text.includes("doce") || text.includes("chocolate")) {
                response = "Procurando algo doce? Nossos restaurantes oferecem opções incríveis de sobremesas nos respectivos cardápios.";
            }
            else if ((text.startsWith("e o ") || text.startsWith("e a ") || text.includes("sobre o")) && conversationContext.lastRestaurant) {
                const r = conversationContext.lastRestaurant;
                response = `Sobre o <b>${r.name}</b>: Categoria ${r.category}, nota ${r.rating}, tempo de entrega estimado em ${r.deliveryTime}. <a href="${r.menuLink}" style="color: #ff4757; text-decoration: underline;">Acesse o cardápio aqui</a>.`;
            }
            else if (text.includes("fome") || text.includes("recomenda") || text.includes("sugere") || text.includes("indica") || text.includes("principal")) {
                if (restaurants.length > 0) {
                    const top = restaurants.reduce((prev, current) => (parseFloat(prev.rating) > parseFloat(current.rating)) ? prev : current);
                    conversationContext.lastRestaurant = top;
                    response = `Baseado nas avaliações, recomendo o <b>${top.name}</b> (${top.category}), avaliado em ⭐ ${top.rating} com entrega em ${top.deliveryTime}. Deseja conferir o <a href="${top.menuLink}" style="color: #ff4757; text-decoration: underline;">cardápio</a>?`;
                } else {
                    response = "No momento não há restaurantes carregados na página.";
                }
            }
            else if (text.includes("pizza")) {
                const pizzaRest = restaurants.find(r => r.category.toLowerCase().includes("pizza") || r.name.toLowerCase().includes("pizza"));
                if (pizzaRest) {
                    conversationContext.lastRestaurant = pizzaRest;
                    response = `Para pizzas, temos o <b>${pizzaRest.name}</b> (Nota ${pizzaRest.rating}, entrega em ${pizzaRest.deliveryTime}). Confira <a href="${pizzaRest.menuLink}" style="color: #ff4757; text-decoration: underline;">o cardápio aqui</a>.`;
                } else {
                    response = "Não encontrei pizzarias específicas cadastradas agora, mas confira as opções na página inicial!";
                }
            }
            else if (text.includes("lanche") || text.includes("hamburguer") || text.includes("burger")) {
                const burgerRest = restaurants.find(r => r.category.toLowerCase().includes("lanche") || r.category.toLowerCase().includes("burger"));
                if (burgerRest) {
                    conversationContext.lastRestaurant = burgerRest;
                    response = `O destaque para lanches é o <b>${burgerRest.name}</b>! Pedido mínimo de ${burgerRest.minOrder}. Veja o cardápio <a href="${burgerRest.menuLink}" style="color: #ff4757; text-decoration: underline;">aqui</a>.`;
                } else {
                    response = "Temos excelentes opções de lanches na página inicial!";
                }
            }
            else if (text.includes("carrinho")) {
                response = "Você pode visualizar e gerenciar os itens adicionados ao seu pedido clicando no ícone do carrinho localizado no topo da página.";
            }
            else if (text.includes("entrega") || text.includes("taxa") || text.includes("tempo")) {
                response = "O tempo de entrega e as taxas variam conforme cada restaurante parceiro e sua localização informada. Você pode ver o prazo exato diretamente no cardápio de cada estabelecimento.";
            }
            else if (text.includes("ong") || text.includes("doação") || text.includes("doar")) {
                response = "O AKGE Food apoia causas sociais! Parte dos nossos pedidos ajuda a gerar doações automáticas para ONGs parceiras cadastradas em nossa plataforma.";
            }
            else if (text.includes("pedido") || text.includes("acompanhar") || text.includes("status")) {
                response = "Você pode acompanhar o status atualizado do seu pedido diretamente na seção de acompanhamento de pedidos da página inicial.";
            }
            else if (text.includes("desconto") || text.includes("oferta") || text.includes("promoção")) {
                response = "Fique de olho na nossa página inicial para conferir os cupons de desconto ativos, ofertas do dia e campanhas especiais!";
            }
            else {
                response = `Não encontrei informações específicas sobre "${userText}" no AKGE Food. Posso ajudar com restaurantes, cardápios, categorias, carrinho, entregas ou doações para ONGs.`;
            }

            appendMessage("bot", response);
        }, 500);
    }

    function handleUserMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        appendMessage("user", text);
        chatInput.value = "";
        processAIResponse(text);
    }

    if (chatSendBtn) {
        chatSendBtn.addEventListener("click", handleUserMessage);
    }

    if (chatInput) {
        chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                handleUserMessage();
            }
        });
    }
});
