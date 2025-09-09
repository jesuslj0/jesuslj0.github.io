document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.getElementById('addBtn');
    const itemList = document.getElementById('list');
    const itemInput = document.getElementById('text');

    addBtn.addEventListener('click', function() {
        const itemText = itemInput.value.trim();
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'x';
        deleteBtn.style.backgroundColor = 'black';
        deleteBtn.style.color = 'white';
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.style.border = 'none';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.borderRadius = '50%';

        deleteBtn.addEventListener('click', function() {
            itemList.removeChild(this.parentElement);
        });
        if (itemText !== '') {
            const item = document.createElement('li');
            item.textContent = itemText;
            item.appendChild(deleteBtn);
            itemList.appendChild(item);
            itemInput.value = '';
            itemInput.focus();
        }
    });
});
