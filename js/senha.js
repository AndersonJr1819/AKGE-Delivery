document.addEventListener('DOMContentLoaded', function() {
  const formulario = document.getElementById('formulario-recuperacao');
  const campoEmail = document.getElementById('email');
  const botaoEntrar = document.getElementById('botao-entrar');
  const textoBotaoEntrar = document.getElementById('texto-botao-entrar');
  const spinnerCarregamento = document.getElementById('spinner-carregamento');
  const blocoSucesso = document.getElementById('mensagem-sucesso');
  const linkVoltar = document.getElementById('link-voltar');

  function validarEmailOuTelefone(valor) {
    const valorLimpo = valor.trim();
    if (valorLimpo === '') return false;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const apenasNumeros = valorLimpo.replace(/\D/g, '');
    return regexEmail.test(valorLimpo) || apenasNumeros.length >= 10 || valorLimpo.length > 3;
  }

  function mostrarErro(campoId, mostrar) {
    const elementoErro = document.querySelector(`[id-erro="${campoId}"]`);
    if (elementoErro) {
      elementoErro.style.display = mostrar ? 'block' : 'none';
    }
  }

  formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const valorEmail = campoEmail.value;
    let formularioValido = true;

    if (!validarEmailOuTelefone(valorEmail)) {
      mostrarErro('email', true);
      formularioValido = false;
    } else {
      mostrarErro('email', false);
    }

    if (!formularioValido) {
      return;
    }

    textoBotaoEntrar.style.display = 'none';
    spinnerCarregamento.style.display = 'block';
    botaoEntrar.disabled = true;

    setTimeout(function() {
      spinnerCarregamento.style.display = 'none';
      textoBotaoEntrar.style.display = 'inline-block';
      botaoEntrar.disabled = false;
      formulario.style.display = 'none';
      blocoSucesso.style.display = 'block';
    }, 1500);
  });

  linkVoltar.addEventListener('click', function(evento) {
    evento.preventDefault();
    alert('Retornando para a página de login...');
  });
});