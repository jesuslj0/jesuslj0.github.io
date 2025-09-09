document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('btn');
    const container = document.getElementById('container');

    button.addEventListener('click', function() {
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        container.style.backgroundColor = randomColor;
    });
});