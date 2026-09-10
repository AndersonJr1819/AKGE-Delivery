document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const eyeIcon = togglePasswordBtn.querySelector('.eye-icon');

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
});