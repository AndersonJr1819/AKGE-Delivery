document.addEventListener("DOMContentLoaded", () => {
    const chatToggleBtn = document.querySelector(".ai-chat-toggle-btn");
    const chatWindow = document.querySelector(".ai-chat-window");
    const chatCloseBtn = document.querySelector(".ai-chat-close-btn");
    const chatClearBtn = document.querySelector(".ai-chat-clear-btn");
    const chatMessages = document.querySelector(".ai-chat-messages");
    const chatInput = document.querySelector(".ai-chat-input");
    const chatSendBtn = document.querySelector(".ai-chat-send-btn");

    if (!chatToggleBtn || !chatWindow) return;

    // Extrai dinamicamente os dados dos restaurantes da página Home
    function getAvailableRestaurants() {
        const cards = document.querySelectorAll('.restaurant-card');
        const list = [];
        cards.forEach(card => {
            const name = card.querySelector('h3').textContent.trim();
            const category = card.querySelector('.restaurant-category').textContent.trim();
            const rating = card.querySelector('.rating').textContent.trim();
            const deliveryTime = card.querySelector('.delivery-time').textContent.trim();
            const minOrder = card.querySelector('.min-order').textContent.trim();
            const menuLink = card.querySelector('.btn-secondary').getAttribute('href');

            list.exports = { name, category, rating, deliveryTime, minOrder, menuLink };
            list.push({ name, category, rating, deliveryTime, minOrder, menuLink });
        });
        return list;
    }

    // Alternar visibilidade do Chat
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

    // Limpar conversas mantendo apenas a mensagem inicial
    if (chatClearBtn) {
        chatClearBtn.addEventListener("click", () => {
            chatMessages.innerHTML = `
                <div class="ai-message bot">
                    <p>Conversa limpa! Como posso ajudar você agora?</p>
                </div>
            `;
        });
    }

    function appendMessage(sender, text) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("ai-message", sender);
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function processAIResponse(userText) {
        const text = userText.toLowerCase();
        const restaurants = getAvailableRestaurants();

        // Indicador de digitação simulado
        setTimeout(() => {
            let response = "";

            if (text.includes("olá") || text.includes("oi") || text.includes("bom dia") || text.includes("boa tarde") || text.includes("boa noite")) {
                response = "Olá! Como posso ajudar você a escolher o seu pedido hoje? Posso sugerir lanches, pizzas, comida japonesa, frango, sobremesas ou bebidas!";
            } 
            else if (text.includes("restaurante") || text.includes("lista") || text.includes("quais") || text.includes("opções")) {
                response = "Temos excelentes parceiros disponíveis na AKGEFood:<br>";
                restaurants.forEach(r => {
                    response += `• <b>${r.name}</b> (${r.category}) - ⭐ ${r.rating} | Entrega: ${r.deliveryTime} | <a href="${r.menuLink}" style="color: #ff4757; text-decoration: underline;">Ver cardápio</a><br>`;
                });
            }
            else if (text.includes("fome") || text.includes("recomenda") || text.includes("sugere") || text.includes("indica")) {
                // Seleciona um aleatório ou o melhor avaliado
                const top = restaurants.reduce((prev, current) => (parseFloat(prev.rating) > parseFloat(current.rating)) ? prev : current);
                response = `Baseado nas avaliações da nossa IA, recomendo fortemente o <b>${top.name}</b> (${top.category}), que está com nota ⭐ ${top.rating} e entrega em ${top.deliveryTime}. Deseja ver o <a href="${top.menuLink}" style="color: #ff4757; text-decoration: underline;">cardápio dele</a>?`;
            }
            else if (text.includes("pizza")) {
                const pizzaRest = restaurants.find(r => r.category.toLowerCase().includes("pizza"));
                if (pizzaRest) {
                    response = `Para pizzas, temos a ${pizzaRest.name} (Nota ${pizzaRest.rating}, entrega em ${pizzaRest.deliveryTime}). Você pode conferir <a href="${pizzaRest.menuLink}" style="color: #ff4757; text-decoration: underline;">clicando aqui no cardápio</a>.`;
                } else {
                    response = "No momento não encontrei pizzarias cadastradas, mas confira nossa seção de ofertas!";
                }
            }
            else if (text.includes("lanche") || text.includes("hamburguer") || text.includes("burger")) {
                const burgerRest = restaurants.find(r => r.category.toLowerCase().includes("lanche"));
                if (burgerRest) {
                    response = `O destaque para lanches é o ${burgerRest.name}! Pedido mínimo de ${burgerRest.minOrder}. Veja o cardápio <a href="${burgerRest.menuLink}" style="color: #ff4757; text-decoration: underline;">aqui</a>.`;
                } else {
                    response = "Temos ótimas opções de lanches na página inicial!";
                }
            }
            else if (text.includes("desconto") || text.includes("oferta") || text.includes("promoção")) {
                response = "Atualmente temos ótimas ofertas: <b>20% OFF no primeiro pedido</b>, <b>Frete Grátis</b> em pedidos acima de R$ 30 e <b>Combos especiais</b>!";
            }
            else if (text.includes("pedido") || text.includes("acompanhar") || text.includes("status")) {
                response = "Você pode acompanhar o status detalhado do seu pedido (como o Pedido #1024 do MCdonald's) diretamente na seção de acompanhamento da nossa página inicial!";
            }
            else {
                response = `Entendi sua busca por "${userText}". Posso ajudar você a encontrar restaurantes por categoria (Lanches, Pizza, Japonesa, Frango, Sobremesas, Bebidas) ou sugerir o melhor prato do dia! O que prefere?`;
            }

            appendMessage("bot", response);
        }, 600);
    }

    function handleUserMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        appendMessage("user", text);
        chatInput.value = "";

        processAIResponse(text);
    }

    if (chatSendBtn && chatInput) {
        chatSendBtn.addEventListener("click", handleUserMessage);
        chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                handleUserMessage();
            }
        });
    }
});