document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('formulario-login');
    const campoEmail = document.getElementById('email');
    const campoSenha = document.getElementById('senha');
    const botaoToggleSenha = document.getElementById('botao-toggle-senha');
    const botaoEntrar = document.getElementById('botao-entrar');
    const textoBotaoEntrar = document.getElementById('texto-botao-entrar');
    const spinnerCarregamento = document.getElementById('spinner-carregamento');
    const botaoCriarConta = document.getElementById('botao-criar-conta');
    const linkCadastro = document.getElementById('link-cadastro');
    const linkEsqueci = document.getElementById('link-esqueci');

    botaoToggleSenha.addEventListener('click', function () {
        if (campoSenha.type === 'password') {
            campoSenha.type = 'text';
            botaoToggleSenha.textContent = ' ocultar ';
        } else {
            campoSenha.type = 'password';
            botaoToggleSenha.textContent = '👁️';
        }
    });

    function validarEmailOuTelefone(valor) {
        const valorLimpo = valor.trim();
        if (valorLimpo === '') return false;
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const regexTelefone = /^[0-9]{10,11}$/;
        const apenasNumeros = valorLimpo.replace(/\D/g, '');
        return regexEmail.test(valorLimpo) || regexTelefone.test(apenasNumeros) || valorLimpo.length > 5;
    }

    function mostrarErro(campoId, mostrar) {
        const elementoErro = document.querySelector(`[id-erro="${campoId}"]`);
        if (elementoErro) {
            elementoErro.style.display = mostrar ? 'block' : 'none';
        }
    }

    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();

        const valorEmail = campoEmail.value;
        const valorSenha = campoSenha.value;

        let formularioValido = true;

        if (!validarEmailOuTelefone(valorEmail)) {
            mostrarErro('email', true);
            formularioValido = false;
        } else {
            mostrarErro('email', false);
        }

        if (valorSenha.trim().length < 6) {
            mostrarErro('senha', true);
            formularioValido = false;
        } else {
            mostrarErro('senha', false);
        }

        if (!formularioValido) {
            return;
        }

        textoBotaoEntrar.style.display = 'none';
        spinnerCarregamento.style.display = 'block';
        botaoEntrar.disabled = true;

        setTimeout(function () {
            spinnerCarregamento.style.display = 'none';
            textoBotaoEntrar.style.display = 'inline-block';
            botaoEntrar.disabled = false;
            alert('Login simulado com sucesso! Redirecionando para a IA AKGEFood...');
        }, 1500);
    });

    botaoCriarConta.addEventListener('click', function () {
        alert('Redirecionando para a página de criação de conta...');
    });

    linkCadastro.addEventListener('click', function (evento) {
        evento.preventDefault();
        alert('Abrindo formulário de cadastro...');
    });

    linkEsqueci.addEventListener('click', function (evento) {
        evento.preventDefault();
        alert('Instruções de recuperação de senha enviadas para o fluxo de suporte.');
    });
});