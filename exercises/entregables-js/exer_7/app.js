const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:,.<>?/";

document.getElementById('generate').addEventListener('click', function() {
    const lengthInput = document.getElementById('length');
    const errorDiv = document.getElementById('error');
    const length = parseInt(lengthInput.value, 10);

    errorDiv.textContent = '';

    if (!lengthInput.value || isNaN(length) || length < 4) {
        errorDiv.textContent = 'La longitud debe ser mayor o igual a 4.';
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        const randIndex = Math.floor(Math.random() * charset.length);
        password += charset[randIndex];
    }
    const passwordElement = document.getElementById("generatedPassword");
    passwordElement.textContent = password;

    const copyButton = document.getElementById("copyPassword");
    copyButton.style.display = 'inline-block';
    copyButton.addEventListener('click', function() {
        try {
            navigator.clipboard.writeText(password);
            alert('Contraseña copiada al portapapeles');
        } catch (err) {
            alert('Error al copiar la contraseña: ' + err);
        }
    });
});