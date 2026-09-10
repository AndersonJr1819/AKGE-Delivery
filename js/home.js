document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Sincronização do Carrinho ---
    let cartCount = 0;
    const cartBadge = document.querySelector(".cart-badge");
    const cartItemsList = document.querySelector(".cart-items-list");
    const subtotalEl = document.querySelector(".cart-summary .summary-row:nth-child(1) span:last-child");
    const totalEl = document.querySelector(".cart-summary .summary-row.total span:last-child");

    window.updateCartDisplay = function(items = []) {
        cartCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
        if (cartBadge) cartBadge.textContent = cartCount;

        if (cartItemsList) {
            if (items.length === 0) {
                cartItemsList.innerHTML = `<div class="cart-item-placeholder"><span>Nenhum produto adicionado no momento (Demonstração)</span></div>`;
                if (subtotalEl) subtotalEl.textContent = "R$ 0,00";
                if (totalEl) totalEl.textContent = "R$ 0,00";
            } else {
                let html = "";
                let subtotal = 0;
                items.forEach(item => {
                    subtotal += item.price * item.quantity;
                    html += `
                        <div class="cart-item" style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                            <span>${item.name} (x${item.quantity})</span>
                            <span>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                        </div>
                    `;
                });
                cartItemsList.innerHTML = html;
                if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
                if (totalEl) totalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
            }
        }
    };

    // --- 2. Busca e Filtro de Restaurantes ---
    const searchInputs = document.querySelectorAll('.search-box input, .location-input-wrapper input');
    const searchButton = document.querySelector('.location-box .btn-submit');
    const restaurantCards = document.querySelectorAll('.restaurant-card');

    function filterRestaurants(query) {
        const term = query.toLowerCase().trim();
        restaurantCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const category = card.querySelector('.restaurant-category').textContent.toLowerCase();
            
            if (title.includes(term) || category.includes(term) || term === "") {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    }

    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            filterRestaurants(e.target.value);
        });
    });

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const mainLocationInput = document.querySelector('.location-input-wrapper input');
            if (mainLocationInput && mainLocationInput.value.trim() !== "") {
                alert(`Buscando restaurantes para: "${mainLocationInput.value}"`);
                document.querySelector('.restaurants-section').scrollIntoView({ behavior: 'smooth' });
            } else {
                alert("Por favor, digite seu endereço ou bairro.");
            }
        });
    }

    // --- 3. Filtro por Categoria ---
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const catName = card.querySelector('span').textContent.toLowerCase();
            
            restaurantCards.forEach(rcard => {
                const category = rcard.querySelector('.restaurant-category').textContent.toLowerCase();
                if (category.includes(catName) || catName.includes(category)) {
                    rcard.style.display = "";
                } else {
                    rcard.style.display = "none";
                }
            });
            document.querySelector('.restaurants-section').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // --- 4. Interação com Botões do Header / Navegação Suave ---
    const navLinks = document.querySelectorAll('.nav-link, .footer-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const text = link.textContent.trim();
            if (text === "Restaurantes") {
                e.preventDefault();
                document.querySelector('.restaurants-section').scrollIntoView({ behavior: 'smooth' });
            } else if (text === "Ofertas") {
                e.preventDefault();
                document.querySelector('.offers-section').scrollIntoView({ behavior: 'smooth' });
            } else if (text === "Acompanhar Pedido") {
                e.preventDefault();
                document.querySelector('.tracking-simulation-section').scrollIntoView({ behavior: 'smooth' });
            } else if (text === "Início") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
});