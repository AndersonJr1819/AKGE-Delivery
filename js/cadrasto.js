document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('.signup-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const toggleConfirmPasswordBtn = document.getElementById('toggle-confirm-password');
    const formMessage = document.getElementById('form-message');

    function setupTogglePassword(inputField, buttonElement) {
        if (!inputField || !buttonElement) return;
        const eyeIcon = buttonElement.querySelector('.eye-icon');

        buttonElement.addEventListener('click', () => {
            const isPassword = inputField.getAttribute('type') === 'password';
            
            if (isPassword) {
                inputField.setAttribute('type', 'text');
                if (eyeIcon) eyeIcon.textContent = '🙈';
                buttonElement.setAttribute('aria-label', 'Ocultar senha');
            } else {
                inputField.setAttribute('type', 'password');
                if (eyeIcon) eyeIcon.textContent = '👁️';
                buttonElement.setAttribute('aria-label', 'Mostrar senha');
            }
        });
    }

    setupTogglePassword(passwordInput, togglePasswordBtn);
    setupTogglePassword(confirmPasswordInput, toggleConfirmPasswordBtn);

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const passwordValue = passwordInput.value;
            const confirmPasswordValue = confirmPasswordInput.value;

            if (passwordValue !== confirmPasswordValue) {
                showFeedback('As senhas não coincidem. Por favor, verifique.', 'error');
                return;
            }

            if (passwordValue.length < 6) {
                showFeedback('A senha deve ter pelo menos 6 caracteres.', 'error');
                return;
            }

            showFeedback('Conta criada com sucesso! Redirecionando...', 'success');
            signupForm.reset();
        });
    }

    function showFeedback(message, type) {
        if (!formMessage) return;
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
    }
});