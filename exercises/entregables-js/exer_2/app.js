document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('btn');
    
    button.addEventListener('click', function() {
        const num_clics = parseInt(button.getAttribute('data-clics')) || 0;
        const new_clics = num_clics + 1;
        button.setAttribute('data-clics', new_clics);
        button.textContent = `Clics: ${new_clics}`;
    });

    const resetButton = document.getElementById('reset-btn');
    resetButton.addEventListener('click', function() {
        button.setAttribute('data-clics', 0);
        button.textContent = 'Clics: 0';
    });
});