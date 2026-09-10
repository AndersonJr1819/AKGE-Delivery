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
                alert('Por favor, digite seu endereço ou bairro para buscar restaurantes.');
                locationInput.focus();
            } else {
                alert(`Buscando restaurantes disponíveis para: ${locationValue}`);
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query !== '') {
                    alert(`Pesquisando por: "${query}"`);
                }
            }
        });
    }

    if (cartButton) {
        cartButton.addEventListener('click', () => {
            if (cartCount === 0) {
                alert('Seu carrinho está vazio no momento.');
            } else {
                alert(`Carrinho possui ${cartCount} item(ns). Total: R$ ${cartTotal.toFixed(2).replace('.', ',')}`);
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
            
            alert(`Você acessou o cardápio de "${restaurantName}". Um item de demonstração (R$ 35,00) foi adicionado ao carrinho!`);
        });
    });

    if (trackingDetailBtn) {
        trackingDetailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Detalhes do Pedido #1024: Entregue com sucesso ao Burger House. Obrigado por pedir com o AKGEFood!');
        });
    }

    offerButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            alert(`Oferta especial #${index + 1} selecionada! O desconto será aplicado na finalização.`);
        });
    });

    donationBadges.forEach((badge) => {
        badge.addEventListener('click', () => {
            donationBadges.forEach(b => b.style.backgroundColor = 'var(--cor-branco)');
            donationBadges.forEach(b => b.style.color = 'var(--cor-preto)');
            
            badge.style.backgroundColor = 'var(--cor-preto)';
            badge.style.color = 'var(--cor-amarelo)';
            
            alert(`Doação de ${badge.textContent} selecionada para a ONG parceira. Obrigado!`);
        });
    });
});