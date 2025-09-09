const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const deleteCompletedBtn = document.getElementById('delete-completed-btn');
const taskList = document.getElementById('task-list');

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.forEach(task => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        if (task.completed) li.classList.add('completed');
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed', checkbox.checked);
            saveTasks();
        });
        li.appendChild(checkbox);

        const span = document.createElement('span');
        span.textContent = task.text;
        span.style.marginLeft = '0.5em';
        li.appendChild(span);

        taskList.appendChild(li);
    });
}

function saveTasks() {
    const tasks = Array.from(taskList.children).map(li => {
        const checkbox = li.querySelector('input[type="checkbox"]');
        const text = li.querySelector('span').textContent;
        return { text, completed: checkbox.checked };
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteCompletedTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const incompleteTasks = tasks.filter(task => !task.completed);
    localStorage.setItem('tasks', JSON.stringify(incompleteTasks));
}

addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text) {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed', checkbox.checked);
        });
        li.appendChild(checkbox);

        const span = document.createElement('span');
        span.textContent = text;
        span.style.marginLeft = '0.5em';
        li.appendChild(span);

        taskList.appendChild(li);
        taskInput.value = '';
    }

    saveTasks();
});

deleteCompletedBtn.addEventListener('click', () => {
    const items = Array.from(taskList.children);
    items.forEach(li => {
        const checkbox = li.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            taskList.removeChild(li);
        }
    });

    deleteCompletedTasks();
});

taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTaskBtn.click();
});

document.addEventListener('DOMContentLoaded', loadTasks);