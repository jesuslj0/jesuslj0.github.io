const texto = document.getElementById('texto');
const caracteres = document.getElementById('caracteres');
const palabras = document.getElementById('palabras');

texto.addEventListener('input', function() {
    const valor = texto.value;
    caracteres.textContent = 'Caracteres: ' + valor.length;
    const palabrasContadas = valor.trim() === '' ? 0 : valor.trim().split(/\s+/).length;
    palabras.textContent = 'Palabras: ' + palabrasContadas;
});