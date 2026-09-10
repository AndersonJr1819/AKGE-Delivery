document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-box input');
    const locationInput = document.querySelector('.location-input-wrapper input');
    const searchButton = document.querySelector('.hero-section .btn-submit');
    const cartButton = document.querySelector('.cart-btn');
    const cartBadge = document.querySelector('.cart-badge');
    const viewMenuButtons = document.querySelectorAll('.restaurant-card .btn-secondary');
    const trackingDetailBtn = document.querySelector('.tracking-footer .btn-secondary');
    const offerButtons = document.querySelectorAll('.offer-card .btn-secondary');
    const donationBadges = document.querySelectorAll('.donation-badge');
    const cartItemsList = document.querySelector('.cart-items-list');
    const summaryRows = document.querySelectorAll('.summary-row span');

    let cartCount = 0;
    let cartTotal = 0;

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
        if (cartBadge) {
            cartBadge.textContent = cartCount;
        }

        if (cartItemsList) {
            if (cartCount > 0) {
                cartItemsList.innerHTML = `
                    <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                        <span>Item Demonstrativo (${cartCount}x)</span>
                        <span>R$ ${(cartTotal).toFixed(2).replace('.', ',')}</span>
                    </div>
                `;
            } else {
                cartItemsList.innerHTML = `
                    <div class="cart-item-placeholder">
                        <span>Nenhum produto adicionado no momento (Demonstração)</span>
                    </div>
                `;
            }
        }

        if (summaryRows.length >= 4) {
            summaryRows[1].textContent = `R$ ${cartTotal.toFixed(2).replace('.', ',')}`;
            summaryRows[3].textContent = `R$ ${cartTotal.toFixed(2).replace('.', ',')}`;
        }
    }

    if (searchButton && locationInput) {
        searchButton.addEventListener('click', () => {
            const locationValue = locationInput.value.trim();
            if (locationValue === '') {
                showCustomAlert('Por favor, digite seu endereço ou bairro para buscar restaurantes.');
                locationInput.focus();
            } else {
                showCustomAlert(`Buscando restaurantes disponíveis para: ${locationValue}`);
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query !== '') {
                    showCustomAlert(`Pesquisando por: "${query}"`);
                }
            }
        });
    }

    if (cartButton) {
        cartButton.addEventListener('click', () => {
            if (cartCount === 0) {
                showCustomAlert('Seu carrinho está vazio no momento.');
            } else {
                showCustomAlert(`Carrinho possui ${cartCount} item(ns). Total: R$ ${cartTotal.toFixed(2).replace('.', ',')}`);
            }
        });
    }

    viewMenuButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.restaurant-card');
            const restaurantName = card ? card.querySelector('h3').textContent : `Restaurante ${index + 1}`;
            
            cartCount += 1;
            cartTotal += 35.00;
            updateCartUI();
            
            showCustomAlert(`Você acessou o cardápio de "${restaurantName}". Um item de demonstração (R$ 35,00) foi adicionado ao carrinho!`);
        });
    });

    if (trackingDetailBtn) {
        trackingDetailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showCustomAlert('Detalhes do Pedido #1024: Entregue com sucesso ao Burger House. Obrigado por pedir com o AKGEFood!');
        });
    }

    offerButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showCustomAlert(`Oferta especial #${index + 1} selecionada! O desconto será aplicado na finalização.`);
        });
    });

    donationBadges.forEach((badge) => {
        badge.addEventListener('click', () => {
            donationBadges.forEach(b => b.style.backgroundColor = 'var(--cor-branco)');
            donationBadges.forEach(b => b.style.color = 'var(--cor-preto)');
            
            badge.style.backgroundColor = 'var(--cor-preto)';
            badge.style.color = 'var(--cor-amarelo)';
            
            showCustomAlert(`Doação de ${badge.textContent} selecionada para a ONG parceira. Obrigado!`);
        });
    });
});