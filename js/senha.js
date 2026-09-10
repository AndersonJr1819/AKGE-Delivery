document.addEventListener('DOMContentLoaded', () => {
    const recoveryForm = document.querySelector('.recovery-form');
    const recoveryInput = document.getElementById('recovery-identifier');
    const formMessage = document.getElementById('form-message');

    if (recoveryForm) {
        recoveryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const identifierValue = recoveryInput.value.trim();

            if (identifierValue === '') {
                showFeedback('Por favor, preencha o campo com seu e-mail ou telefone.', 'error');
                return;
            }

            showFeedback('Instruções enviadas com sucesso! Verifique seu e-mail ou SMS.', 'success');
            recoveryForm.reset();
        });
    }

    function showFeedback(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
    }
});