document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const eyeIcon = togglePasswordBtn.querySelector('.eye-icon');
    const loginForm = document.querySelector('form'); // Seleciona o formulário

    togglePasswordBtn.addEventListener('click', () => {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        
        if (isPassword) {
            passwordInput.setAttribute('type', 'text');
            eyeIcon.textContent = '🙈';
            togglePasswordBtn.setAttribute('aria-label', 'Ocultar senha');
        } else {
            passwordInput.setAttribute('type', 'password');
            eyeIcon.textContent = '👁️';
            togglePasswordBtn.setAttribute('aria-label', 'Mostrar senha');
        }
    });

    // Adiciona o redirecionamento ao enviar o formulário
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita o recarregamento padrão se for uma simulação
            window.location.href = 'home.html';
        });
    }
});